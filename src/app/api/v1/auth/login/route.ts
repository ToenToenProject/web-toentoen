// src/app/api/v1/auth/login/route.ts
// Proxy Login Route Handler untuk Next.js
// Memecahkan masalah cross-origin SameSite=Lax cookie pada browser development (localhost)

import { NextRequest, NextResponse } from 'next/server';

// Abaikan validasi TLS pada dev backend jika sertifikat belum mencakup subdomain multi-level
if (process.env.NODE_ENV !== 'production' || process.env.ALLOW_INSECURE_DEV_TLS === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const BACKEND_LOGIN_URL = process.env.INTERNAL_API_BASE_URL 
  ? `${process.env.INTERNAL_API_BASE_URL}/auth/login` 
  : 'https://dev-api-ops.toentoen.com/api/v1/auth/login';

export async function POST(req: NextRequest) {
  try {
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

    // Ekstrak JWT auth_token dari header Set-Cookie backend
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

    // Sisipkan token JWT ke JSON response agar client dapat menggunakannya untuk Authorization: Bearer
    if (jwtToken && data.data) {
      data.data.token = jwtToken;
    }

    const res = NextResponse.json(data);

    // Teruskan cookie ke browser untuk domain localhost / same-origin
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
