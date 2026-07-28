import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, ShieldOff } from "lucide-react";
import { useMfaStatus } from "@/hooks/useMfaStatus";
import { enrollMfaFactor, unenrollMfaFactor, verifyMfaEnrollment } from "@/lib/api/mfa";
import { mfaCodeSchema, MfaCodeFormValues } from "@/lib/validation/mfaCodeSchema";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

interface Enrollment {
  factorId: string;
  qrCode: string;
  secret: string;
}

const AdminSecurity = () => {
  const { data: mfaStatus, isLoading } = useMfaStatus();
  const queryClient = useQueryClient();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<MfaCodeFormValues>({
    resolver: zodResolver(mfaCodeSchema),
    defaultValues: { code: "" },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["mfa-status"] });

  const enrollMutation = useMutation({
    mutationFn: enrollMfaFactor,
    onSuccess: (data) => setEnrollment(data),
    onError: () => toast({ title: "Couldn't start setup", variant: "destructive" }),
  });

  const startOverMutation = useMutation({
    mutationFn: async (staleFactorId: string) => {
      await unenrollMfaFactor(staleFactorId);
      return enrollMfaFactor();
    },
    onSuccess: (data) => setEnrollment(data),
    onError: () => toast({ title: "Couldn't start setup", variant: "destructive" }),
  });

  const verifyMutation = useMutation({
    mutationFn: (values: MfaCodeFormValues) =>
      verifyMfaEnrollment(enrollment?.factorId as string, values.code),
    onSuccess: () => {
      setEnrollment(null);
      setSubmitError(null);
      form.reset();
      invalidate();
      toast({ title: "Two-factor authentication enabled" });
    },
    onError: () => setSubmitError("That code isn't right. Try again."),
  });

  const disableMutation = useMutation({
    mutationFn: unenrollMfaFactor,
    onSuccess: () => {
      invalidate();
      toast({ title: "Two-factor authentication disabled" });
    },
    onError: () => toast({ title: "Something went wrong", variant: "destructive" }),
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-2xl font-bold">Security</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a second step to your login using an authenticator app (Google Authenticator, Authy,
        etc).
      </p>

      <div className="mt-6 border border-border bg-card p-6">
        {/* Verified: 2FA is on */}
        {!enrollment && mfaStatus?.verifiedFactor && (
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
              <div>
                <p className="font-semibold">Two-factor authentication is on</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You'll be asked for a code from your authenticator app each time you log in.
                </p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="shrink-0">
                  Disable
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Disable two-factor authentication?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Logging in will only need your email and password after this.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => disableMutation.mutate(mfaStatus.verifiedFactor!.id)}
                  >
                    Disable
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* No factor at all, and not mid-enrollment */}
        {!enrollment && !mfaStatus?.verifiedFactor && !mfaStatus?.unverifiedFactor && (
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <ShieldOff className="w-6 h-6 text-muted-foreground shrink-0" />
              <div>
                <p className="font-semibold">Two-factor authentication is off</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Turn it on for extra protection on this login.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              className="shrink-0"
              onClick={() => enrollMutation.mutate()}
              disabled={enrollMutation.isPending}
            >
              {enrollMutation.isPending ? "Starting..." : "Enable 2FA"}
            </Button>
          </div>
        )}

        {/* Stale unverified factor from an abandoned attempt */}
        {!enrollment && mfaStatus?.unverifiedFactor && (
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">An unfinished setup was found</p>
              <p className="text-sm text-muted-foreground mt-1">
                A previous attempt to enable 2FA wasn't completed. Start over to get a fresh code.
              </p>
            </div>
            <Button
              size="sm"
              className="shrink-0"
              onClick={() => startOverMutation.mutate(mfaStatus.unverifiedFactor!.id)}
              disabled={startOverMutation.isPending}
            >
              {startOverMutation.isPending ? "Starting..." : "Start over"}
            </Button>
          </div>
        )}

        {/* Mid-enrollment: show QR + code form */}
        {enrollment && (
          <div>
            <p className="font-semibold">Scan this with your authenticator app</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-6 items-start">
              <img
                src={enrollment.qrCode}
                alt="Scan this QR code with your authenticator app"
                className="w-40 h-40 border border-border shrink-0"
              />
              <div className="text-sm">
                <p className="text-muted-foreground">Can't scan? Enter this key manually:</p>
                <p className="mt-1 font-mono select-all break-all bg-muted px-2 py-1">
                  {enrollment.secret}
                </p>
              </div>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((v) => verifyMutation.mutate(v))}
                className="mt-6 space-y-4"
              >
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter the 6-digit code from the app</FormLabel>
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
                <div className="flex gap-3">
                  <Button type="submit" disabled={verifyMutation.isPending}>
                    {verifyMutation.isPending ? "Verifying..." : "Verify & enable"}
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setEnrollment(null)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSecurity;
