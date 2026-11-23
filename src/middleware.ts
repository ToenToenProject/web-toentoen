// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

// Daftar path terproteksi internal operations ToenToen
const PROTECTED_PREFIXES = [
  '/login/admin',
  '/login/sales',
  '/login/cmo',
  '/login/social-media',
];

export function middleware(req: NextRequest) {
  const token =
    req.cookies.get('auth_token')?.value ||
    req.cookies.get('token')?.value ||
    req.cookies.get('refreshToken')?.value ||
    req.cookies.get('accessToken')?.value ||
    req.cookies.get('toentoen_session')?.value;
  const path = req.nextUrl.pathname;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => path.startsWith(prefix));

  // Jika tidak ada token dan mencoba mengakses halaman terproteksi, lempar ke login
  if (!token && isProtected) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login/admin/:path*',
    '/login/sales/:path*',
    '/login/cmo/:path*',
    '/login/social-media/:path*',
  ],
};
