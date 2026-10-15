import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icons/* (PWA icons)
     * - manifest.webmanifest (PWA manifest)
     * - images and fonts (*.svg, *.png, *.jpg, *.jpeg, *.gif, *.webp, *.woff, *.woff2)
     */
    "/((?!_next/static|_next/image|favicon.ico|icons/.*|manifest\\.(?:webmanifest|json)|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)",
  ],
};
