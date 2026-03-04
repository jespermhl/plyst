import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/onboarding(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();

  const { userId, sessionClaims } = session;

  if (req.nextUrl.pathname.startsWith("/api")) {
    return;
  }

  if (
    userId &&
    req.nextUrl.pathname === "/onboarding" &&
    sessionClaims?.metadata?.onboarded
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (
    userId &&
    !sessionClaims?.metadata?.onboarded &&
    req.nextUrl.pathname !== "/onboarding"
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
