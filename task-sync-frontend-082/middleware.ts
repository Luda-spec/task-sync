import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/protected');

  if (isProtectedPage) {
    return NextResponse.next();
  }

  if (isAuthPage) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/protected/:path*', '/auth/:path*'],
};