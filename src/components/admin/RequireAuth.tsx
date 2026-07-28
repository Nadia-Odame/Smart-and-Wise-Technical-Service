import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useMfaStatus } from "@/hooks/useMfaStatus";

const RequireAuth = () => {
  const { session, loading } = useSupabaseAuth();
  const { data: mfaStatus, isLoading: mfaLoading, isError: mfaError } = useMfaStatus(!!session);
  const location = useLocation();

  if (loading || (session && mfaLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (mfaError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-destructive">
        Couldn't verify security status. Refresh to try again.
      </div>
    );
  }

  const needsChallenge = mfaStatus?.nextLevel === "aal2" && mfaStatus?.currentLevel !== "aal2";
  if (needsChallenge) {
    return <Navigate to="/admin/mfa-challenge" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAuth;
