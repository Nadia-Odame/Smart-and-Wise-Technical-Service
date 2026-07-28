import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { sendLoginOtp, verifyLoginOtp } from "@/lib/api/emailOtp";
import { clearPendingLoginEmail, getPendingLoginEmail } from "@/lib/pendingLoginEmail";
import { emailOtpSchema, EmailOtpFormValues } from "@/lib/validation/emailOtpSchema";
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

const RESEND_COOLDOWN_SECONDS = 30;

const AdminVerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading: sessionLoading } = useSupabaseAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const pendingEmail = getPendingLoginEmail();

  const redirectTo =
    (location.state as { from?: { pathname: string } } | null)?.from?.pathname ??
    "/admin/enquiries";

  const form = useForm<EmailOtpFormValues>({
    resolver: zodResolver(emailOtpSchema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(() => setResendCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendCooldown]);

  if (sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  // Verification already succeeded in this tab (e.g. hit "back" after success).
  if (session) {
    return <Navigate to={redirectTo} replace />;
  }

  // No session and nothing pending — direct URL visit, or a reload after
  // already succeeding/bailing out. Nothing to verify here.
  if (!pendingEmail) {
    return <Navigate to="/admin/login" replace />;
  }

  const onSubmit = async (values: EmailOtpFormValues) => {
    setSubmitError(null);
    try {
      await verifyLoginOtp(pendingEmail, values.code);
    } catch {
      setSubmitError("That code isn't right. Try again.");
      return;
    }
    clearPendingLoginEmail();
    navigate(redirectTo, { replace: true });
  };

  const handleResend = async () => {
    setResendMessage(null);
    try {
      await sendLoginOtp(pendingEmail);
      setResendMessage("A new code is on its way.");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setResendMessage("Couldn't resend right now. Wait a bit and try again.");
    }
  };

  const handleBackToLogin = async () => {
    clearPendingLoginEmail();
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-foreground text-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-background text-foreground border border-border p-8">
        <Mail className="w-6 h-6 text-primary" aria-hidden="true" />
        <h1 className="mt-2 font-serif text-3xl font-bold">Enter your code</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We emailed an 8-digit code to <span className="font-semibold">{pendingEmail}</span>.
          Enter it below.
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
                    <InputOTP maxLength={8} value={field.value} onChange={field.onChange}>
                      <InputOTPGroup>
                        {Array.from({ length: 8 }).map((_, i) => (
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

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-muted-foreground hover:text-foreground underline disabled:opacity-50 disabled:no-underline"
              >
                {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend code"}
              </button>
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-muted-foreground hover:text-foreground underline"
              >
                Back to login
              </button>
            </div>

            {resendMessage && <p className="text-xs text-muted-foreground">{resendMessage}</p>}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminVerifyEmail;
