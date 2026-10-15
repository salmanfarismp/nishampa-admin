import { cookies } from "next/headers";
import { createClient as createServerAuthClient } from "@/utils/supabase/server";

/**
 * Validates that the active request originates from an authenticated user whose
 * email address is explicitly authorized in the ADMIN_EMAILS environment variable.
 *
 * Implements strict fail-closed security:
 * If ADMIN_EMAILS is unset or empty, all callers will be rejected.
 */
export async function assertAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerAuthClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized: Active authentication session required.");
  }

  const adminEmailsEnv = process.env.ADMIN_EMAILS;
  const adminEmails = adminEmailsEnv
    ? adminEmailsEnv
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean)
    : [];

  // Fail-secure: If no admin emails are configured, deny all operations
  if (adminEmails.length === 0) {
    throw new Error(
      "Forbidden: No administrator emails are configured in ADMIN_EMAILS."
    );
  }

  const userEmail = user.email?.toLowerCase();
  if (!userEmail || !adminEmails.includes(userEmail)) {
    throw new Error("Forbidden: This account does not have administrator access.");
  }

  return user;
}
