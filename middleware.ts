import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Create a Supabase client configured to use cookies
    const supabase = createMiddlewareClient({ req, res });

    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession();

    // /admin/* route matcher.
    const adminRouteRegex = /^\/admin\/.*/;

    // If the user is not logged in, redirect to the login page.
    if (req.nextUrl.pathname.match(adminRouteRegex)) {
        try {
            const { data: session, error: sessionError } = await supabase.auth.getSession();
            const currentUser = session?.session?.user || null;

            if (!currentUser) {
                return NextResponse.redirect(new URL('/', req.url));
            }

            const { data: userData, error: userError } = await supabase.from('users').select('*').eq(currentUser?.id ? 'id' : 'email', currentUser?.id || currentUser?.email);

            if (userError) {
                // Handle user data retrieval error
                console.error('Error retrieving user data:', userError);
                return NextResponse.redirect(new URL('/', req.url));
            }

            const isAdmin = userData[0]?.is_admin || false;

            if (!isAdmin) {
                return NextResponse.redirect(new URL('/', req.url));
            }
        } catch (error) {
            // Handle other potential errors
            console.error('Error:', error);
            return NextResponse.redirect(new URL('/', req.url));
        }
    }

    return res;
}

// Ensure the middleware is only called for relevant paths.
export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
