import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useMfaStatus } from "@/hooks/useMfaStatus";
import { getAal } from "@/lib/api/mfa";
import { loginSchema, LoginFormValues } from "@/lib/validation/loginSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading: sessionLoading } = useSupabaseAuth();
  const { data: mfaStatus, isLoading: mfaLoading } = useMfaStatus(!!session);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (!sessionLoading && !mfaLoading && session) {
    const redirectTo =
      (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
      "/admin/enquiries";
    const needsChallenge = mfaStatus?.nextLevel === "aal2" && mfaStatus?.currentLevel !== "aal2";
    if (needsChallenge) {
      return (
        <Navigate to="/admin/mfa-challenge" replace state={{ from: { pathname: redirectTo } }} />
      );
    }
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setSubmitError("That email or password isn't right. Try again.");
      return;
    }

    const redirectTo =
      (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
      "/admin/enquiries";

    // Read AAL fresh here instead of trusting useMfaStatus's cache — its query
    // was disabled/stale while session was still null, so it hasn't refetched
    // in this same tick and branching on it right after login would be a race.
    const { currentLevel, nextLevel } = await getAal();
    if (nextLevel === "aal2" && currentLevel !== "aal2") {
      navigate("/admin/mfa-challenge", { replace: true, state: { from: { pathname: redirectTo } } });
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-foreground text-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-background text-foreground border border-border p-8">
        <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-primary">
          Smart &amp; Wise
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold">Admin login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to manage enquiries, prices, and photos.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="username" className="rounded-none h-12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      className="rounded-none h-12"
                      {...field}
                    />
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
              <LogIn className="w-4 h-4 mr-2" aria-hidden="true" />
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminLogin;
