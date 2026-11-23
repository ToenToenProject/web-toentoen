/**
 * Authentication proxy handler resolving cross-origin cookie constraints in development.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl, isStrictTlsRequired } from '@/config/apiConfig';

// Configure TLS verification based on deployment stage or explicit settings
if (!isStrictTlsRequired() || process.env.ALLOW_INSECURE_DEV_TLS === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export async function POST(req: NextRequest) {
  try {
    const backendBaseUrl = getBackendBaseUrl();
    const BACKEND_LOGIN_URL = `${backendBaseUrl}/auth/login`;
    const body = await req.json();

    const identifier = body.identifier || body.email || body.workerId || '';
    const payload = {
      ...body,
      identifier,
      email: body.email || identifier,
      password: body.password,
    };

    const backendRes = await fetch(BACKEND_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await backendRes.json().catch(() => null);

    if (!backendRes.ok || !data?.success) {
      return NextResponse.json(
        data || { success: false, message: data?.message || 'Email atau password salah' },
        { status: backendRes.status || 400 }
      );
    }

    // Extract JWT token from upstream Set-Cookie header
    const setCookieHeader = backendRes.headers.getSetCookie?.() || [];
    let jwtToken = '';

    for (const c of setCookieHeader) {
      const match = c.match(/(?:auth_token|token)=([^;]+)/);
      if (match) {
        jwtToken = match[1];
        break;
      }
    }

    if (!jwtToken) {
      const rawCookie = backendRes.headers.get('set-cookie') || '';
      const match = rawCookie.match(/(?:auth_token|token)=([^;]+)/);
      if (match) {
        jwtToken = match[1];
      }
    }

    // Attach JWT to payload body for client authorization headers
    if (jwtToken && data.data) {
      data.data.token = jwtToken;
    }

    const res = NextResponse.json(data);

    // Set same-origin authentication cookies for local session continuity
    if (jwtToken) {
      res.cookies.set('auth_token', jwtToken, {
        path: '/',
        maxAge: 86400,
        sameSite: 'lax',
      });
      res.cookies.set('token', jwtToken, {
        path: '/',
        maxAge: 86400,
        sameSite: 'lax',
      });
      if (data.data?.user?.role) {
        res.cookies.set('toentoen_session', data.data.user.role, {
          path: '/',
          maxAge: 86400,
          sameSite: 'lax',
        });
      }
    }

    return res;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
