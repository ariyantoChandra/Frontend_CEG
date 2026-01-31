import { NextResponse } from 'next/server';

export function proxy(req) {
    const { nextUrl, cookies } = req;
    const { pathname } = nextUrl;

    const isAuthRoute = pathname === '/login' || pathname === '/register';
    const isHomepage = pathname === '/';
    const isPublic = isHomepage || isAuthRoute;

    const token = cookies.get('token')?.value;

    if (!token && !isPublic) {
        // If unauthenticated and route is protected, redirect to login with from parameter
        const url = new URL('/login', req.url);
        url.searchParams.set('from', pathname);
        return NextResponse.redirect(url);
    }

    if (token && isAuthRoute) {
        // If already logged in, redirect away from auth pages
        // Check if there's a 'from' parameter, redirect there if valid
        const fromParam = nextUrl.searchParams.get('from');
        if (fromParam && fromParam.startsWith('/')) {
            return NextResponse.redirect(new URL(fromParam, req.url));
        }
        // Otherwise, redirect to homepage
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
