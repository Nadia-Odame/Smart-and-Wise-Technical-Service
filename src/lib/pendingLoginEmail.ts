const STORAGE_KEY = "admin-pending-otp-email";

export function setPendingLoginEmail(email: string): void {
  sessionStorage.setItem(STORAGE_KEY, email);
}

export function getPendingLoginEmail(): string | null {
  return sessionStorage.getItem(STORAGE_KEY);
}

export function clearPendingLoginEmail(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
