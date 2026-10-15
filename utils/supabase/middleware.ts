import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Fetch verified user details from Supabase Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/auth/callback");
  const isUnauthorizedRoute = pathname.startsWith("/unauthorized");

  // Optional Admin email allowlist check
  const adminEmailsEnv = process.env.ADMIN_EMAILS;
  const adminEmails = adminEmailsEnv
    ? adminEmailsEnv
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
    : [];

  const isAllowedAdmin =
    !user ||
    adminEmails.length === 0 ||
    (user.email && adminEmails.includes(user.email.toLowerCase()));

  // Helper to carry over refreshed cookies into redirect responses
  const createRedirectWithCookies = (url: URL) => {
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  };

  // 1. Unauthenticated users trying to access protected paths
  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return createRedirectWithCookies(url);
  }

  // 2. Authenticated users:
  if (user) {
    // If not on the admin allowlist, divert to /unauthorized
    if (
      !isAllowedAdmin &&
      !isUnauthorizedRoute &&
      !pathname.startsWith("/auth/callback")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/unauthorized";
      return createRedirectWithCookies(url);
    }

    // If allowed and visiting /login or /unauthorized, redirect to home
    if (
      isAllowedAdmin &&
      (isAuthRoute || isUnauthorizedRoute) &&
      !pathname.startsWith("/auth/callback")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.delete("next");
      return createRedirectWithCookies(url);
    }
  }

  return supabaseResponse;
}

// Keep backwards-compatible createClient export if needed by legacy callers
export const createClient = (request: NextRequest) => updateSession(request);
