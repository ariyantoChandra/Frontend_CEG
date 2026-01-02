import { NextResponse } from 'next/server';

export function proxy(req) {
    const { nextUrl, cookies } = req;
    const { pathname } = nextUrl;

    const isAuthRoute = pathname === '/login' || pathname === '/register';
    const isHomepage = pathname === '/';
    const isPublic = isHomepage || isAuthRoute;

    const token = cookies.get('token')?.value;

    if (!token && !isPublic) {
        // If unauthenticated and route is protected, send to homepage
        const url = new URL('/', req.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    if (token && isAuthRoute) {
        // If already logged in, redirect away from auth pages
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Run on all routes except static assets and API
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.\\w+$).*)',
    ],
};
