/**
 * Reverse proxy route handler for upstream backend communication.
 * Mitigates CORS constraints and development TLS certificate validation issues.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl, isStrictTlsRequired, resolveCurrentStage } from '@/config/apiConfig';

// Configure TLS verification based on deployment stage
if (!isStrictTlsRequired() || process.env.ALLOW_INSECURE_DEV_TLS === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
} else {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1';
}

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathString = Array.isArray(path) ? path.join('/') : path;
    const url = new URL(req.url);
    const search = url.search;

    const backendBaseUrl = getBackendBaseUrl();
    const targetUrl = `${backendBaseUrl}/${pathString}${search}`;
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      // Strip hop-by-hop headers before proxying upstream
      if (lower !== 'host' && lower !== 'connection' && lower !== 'content-length') {
        headers[key] = value;
      }
    });
    let body: BodyInit | undefined = undefined;
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        body = await req.text();
      } else if (contentType.includes('multipart/form-data')) {
        body = await req.formData();
      } else {
        const text = await req.text();
        if (text) body = text;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    let backendRes: Response;
    try {
      backendRes = await fetch(targetUrl, {
        method: req.method,
        headers,
        body,
        redirect: 'manual',
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const resContentType = backendRes.headers.get('content-type') || '';
    let responseData: any;

    if (resContentType.includes('application/json')) {
      responseData = await backendRes.json().catch(() => null);
    } else {
      responseData = await backendRes.text().catch(() => '');
    }

    const responseInit: ResponseInit = {
      status: backendRes.status,
      statusText: backendRes.statusText,
    };

    const nextResponse = typeof responseData === 'object' && responseData !== null
      ? NextResponse.json(responseData, responseInit)
      : new NextResponse(responseData, {
          ...responseInit,
          headers: {
            'Content-Type': resContentType || 'text/plain',
          },
        });

    // Forward upstream Set-Cookie headers to client response
    const setCookieHeader = backendRes.headers.getSetCookie?.() || [];
    for (const cookie of setCookieHeader) {
      nextResponse.headers.append('Set-Cookie', cookie);
    }

    return nextResponse;
  } catch (err: any) {
    console.error('[API Proxy Error]', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Gagal menghubungi server backend DEV ToenToen via proxy.',
        error: err?.message || String(err),
      },
      { status: 502 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
