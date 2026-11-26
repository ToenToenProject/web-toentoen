import { NextResponse, type NextRequest } from 'next/server';
import { getDashboardPathByRole } from '@/utils/roleRedirect';

// Protected internal operational route prefixes (clean paths without /login)
const PROTECTED_PREFIXES = [
  '/admin',
  '/sales',
  '/cmo',
  '/social-media',
];

// Legacy /login/* operational prefixes to redirect to clean paths
const LEGACY_LOGIN_PREFIXES = [
  '/login/admin',
  '/login/sales',
  '/login/cmo',
  '/login/social-media',
];

export function middleware(req: NextRequest) {
  const authToken =
    req.cookies.get('auth_token')?.value ||
    req.cookies.get('token')?.value ||
    req.cookies.get('refreshToken')?.value ||
    req.cookies.get('accessToken')?.value;
  const sessionRole = req.cookies.get('toentoen_session')?.value;
  const hasSession = Boolean(authToken || sessionRole);

  const path = req.nextUrl.pathname;

  // Redirect legacy /login/<role>/* URLs to clean /<role>/* (or /login if unauthenticated)
  const isLegacyOperational = LEGACY_LOGIN_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
  if (isLegacyOperational) {
    if (!hasSession) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
    const cleanPath = path.replace(/^\/login/, '');
    return NextResponse.redirect(new URL(cleanPath, req.url));
  }

  // If authenticated user visits /login, redirect directly to their role dashboard
  if (path === '/login' && authToken && sessionRole) {
    return NextResponse.redirect(new URL(getDashboardPathByRole(sessionRole), req.url));
  }

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );

  // Redirect unauthenticated requests (or missing token mid-session) to /login
  if (!hasSession && isProtected) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/login/admin/:path*',
    '/login/sales/:path*',
    '/login/cmo/:path*',
    '/login/social-media/:path*',
    '/admin/:path*',
    '/sales/:path*',
    '/cmo/:path*',
    '/social-media/:path*',
  ],
};
