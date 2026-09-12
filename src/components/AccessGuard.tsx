import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

const AUTH_KEY = "studybuddy-auth";

/** Session-storage access guard for Study Buddy (access-code login). */
export function AccessGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const authed =
    typeof window !== "undefined" && sessionStorage.getItem(AUTH_KEY) === "1";

  if (!authed) {
    const returnTo = `${location.pathname}${location.search}`;
    return (
      <Navigate to={`/auth?returnTo=${encodeURIComponent(returnTo)}`} replace />
    );
  }

  return (
    <div className="contents" data-testid="access-granted">
      {children}
    </div>
  );
}

/** Shown while the auth state resolves (kept for future async guards). */
export function GuardLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="size-6 animate-spin text-muted-foreground" />
    </main>
  );
}
