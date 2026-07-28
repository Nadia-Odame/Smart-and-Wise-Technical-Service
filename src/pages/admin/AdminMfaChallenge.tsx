import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useMfaStatus } from "@/hooks/useMfaStatus";
import { challengeAndVerifyMfa } from "@/lib/api/mfa";
import { mfaCodeSchema, MfaCodeFormValues } from "@/lib/validation/mfaCodeSchema";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const AdminMfaChallenge = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { session, loading: sessionLoading } = useSupabaseAuth();
  const { data: mfaStatus, isLoading: mfaLoading } = useMfaStatus(!!session);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<MfaCodeFormValues>({
    resolver: zodResolver(mfaCodeSchema),
    defaultValues: { code: "" },
  });

  const redirectTo =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    "/admin/enquiries";

  if (sessionLoading || (session && mfaLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }

  if (mfaStatus?.currentLevel === "aal2") {
    return <Navigate to={redirectTo} replace />;
  }

  const factorId = mfaStatus?.verifiedFactor?.id;
  if (!factorId) {
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (values: MfaCodeFormValues) => {
    setSubmitError(null);
    try {
      await challengeAndVerifyMfa(factorId, values.code);
      await queryClient.invalidateQueries({ queryKey: ["mfa-status"] });
      navigate(redirectTo, { replace: true });
    } catch {
      setSubmitError("That code isn't right. Try again.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-foreground text-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-background text-foreground border border-border p-8">
        <ShieldCheck className="w-6 h-6 text-primary" aria-hidden="true" />
        <h1 className="mt-2 font-serif text-3xl font-bold">Enter your code</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Open your authenticator app and enter the 6-digit code.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, i) => (
                          <InputOTPSlot key={i} index={i} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {submitError && <p className="text-sm text-destructive">{submitError}</p>}

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full rounded-none h-12 text-xs font-bold tracking-[0.15em] uppercase"
            >
              {form.formState.isSubmitting ? "Verifying..." : "Verify"}
            </Button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground underline"
            >
              Log out
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminMfaChallenge;
