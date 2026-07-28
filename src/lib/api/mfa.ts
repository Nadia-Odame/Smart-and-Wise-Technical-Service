import type { Factor } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export async function listMfaFactors(): Promise<Factor[]> {
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) throw error;
  return data.all;
}

export async function enrollMfaFactor(): Promise<{
  factorId: string;
  qrCode: string;
  secret: string;
}> {
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
    issuer: "Smart and Wise Technical Service",
  });
  if (error) throw error;
  return { factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret };
}

export async function verifyMfaEnrollment(factorId: string, code: string): Promise<void> {
  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
  if (challengeError) throw challengeError;

  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code,
  });
  if (verifyError) throw verifyError;
}

export async function challengeAndVerifyMfa(factorId: string, code: string): Promise<void> {
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
  if (error) throw error;
}

export async function unenrollMfaFactor(factorId: string): Promise<void> {
  const { error } = await supabase.auth.mfa.unenroll({ factorId });
  if (error) throw error;
}

export async function getAal(): Promise<{
  currentLevel: string | null;
  nextLevel: string | null;
}> {
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error) throw error;
  return { currentLevel: data.currentLevel, nextLevel: data.nextLevel };
}
