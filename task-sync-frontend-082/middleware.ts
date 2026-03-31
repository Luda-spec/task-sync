
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken');
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/protected');

  if (isProtectedPage && !refreshToken) {
    console.log('🔐 Protected page, no refreshToken - redirect to login');
    return NextResponse.redirect(
      new URL('/auth/login', request.url)
    );
  }

  if (isAuthPage && refreshToken) {
    console.log('🔐 Auth page with refreshToken - redirect to home');
    return NextResponse.redirect(
      new URL('/protected/home', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/:path*', '/auth/:path*'],
};