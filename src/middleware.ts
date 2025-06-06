import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect /dashboard route
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/dashboard") &&
    !user &&
    !pathname.startsWith("/login") &&
    !pathname.startsWith("/auth")
  ) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};

