// src/app/api/proxy/[...path]/route.ts
// Universal Backend Reverse Proxy untuk Next.js
// Memecahkan kendala CORS dan SSL Certificate Subject Mismatch (SEC_E_WRONG_PRINCIPAL)
// pada browser client development yang mengakses backend DEV (dev-api-ops.toentoen.com).

import { NextRequest, NextResponse } from 'next/server';

// Abaikan validasi TLS pada dev backend jika sertifikat belum mencakup subdomain multi-level
if (process.env.NODE_ENV !== 'production' || process.env.ALLOW_INSECURE_DEV_TLS === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const BACKEND_BASE_URL = process.env.INTERNAL_API_BASE_URL || 'https://dev-api-ops.toentoen.com/api/v1';

async function handleProxy(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const pathString = Array.isArray(path) ? path.join('/') : path;
    const url = new URL(req.url);
    const search = url.search; // termasuk ?query=...

    const targetUrl = `${BACKEND_BASE_URL}/${pathString}${search}`;

    // Ekstrak headers dari client request
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      // Jangan teruskan host/origin client ke target backend
      if (lower !== 'host' && lower !== 'connection' && lower !== 'content-length') {
        headers[key] = value;
      }
    });

    // Handle body jika ada untuk POST/PUT/PATCH/DELETE
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

    const backendRes = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      redirect: 'manual',
    });

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

    // Teruskan Set-Cookie jika ada (misal sesi auth)
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
