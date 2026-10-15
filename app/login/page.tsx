"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

function LoginContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const errorParam = searchParams.get("error");
  const { signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(() => {
    if (errorParam === "oauth_callback_failed") {
      return "Google authentication failed or was cancelled. Please try again.";
    }
    if (errorParam === "unauthorized") {
      return "Your Google account is not on the authorized administrators allowlist.";
    }
    return null;
  });

  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setLoginError(null);
      await signInWithGoogle(next);
    } catch (err: unknown) {
      console.error("Sign in error:", err);
      setIsSubmitting(false);
      setLoginError(
        err instanceof Error
          ? err.message
          : "Failed to initialize Google Sign-In. Please check your network connection.",
      );
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-8 bg-canvas">
      {/* Container Card */}
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Brand Monogram & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold text-2xl shadow-md mb-4 border border-border-default">
            W
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Westernswings
          </h1>
          <p className="text-xs font-mono uppercase tracking-wider text-text-secondary mt-1">
            Commerce Studio Admin
          </p>
        </div>

        {/* Auth Action Card */}
        <div className="w-full bg-surface-container-lowest border border-border-default rounded-2xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex flex-col gap-1.5 text-center">
            <h2 className="text-base font-semibold text-on-surface">
              Administrator Sign In
            </h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Sign in with your authorized Google Workspace or email account to manage products, orders, and content.
            </p>
          </div>

          {/* Error Notice */}
          {loginError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-telemetry-critical-bg border border-telemetry-critical-border text-telemetry-critical text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
            >
              <svg
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div className="flex-1 font-medium leading-snug">{loginError}</div>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full h-12 px-4 rounded-xl border border-border-default bg-canvas hover:bg-surface-hover active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-3 text-sm font-medium text-on-surface cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed group focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-primary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Connecting to Google...</span>
              </div>
            ) : (
              <>
                {/* Official Google 'G' Logo */}
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Security Notice */}
          <div className="pt-2 border-t border-border-subtle flex items-center justify-center gap-1.5 text-[11px] text-text-subtle font-mono">
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Secured via Supabase SSR & OAuth 2.0</span>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-xs text-text-subtle text-center">
          &copy; {new Date().getFullYear()} Westernswings. Internal Use Only.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-canvas">
          <div className="w-8 h-8 rounded-full border-2 border-border-default border-t-primary animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
