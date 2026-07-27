const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT as string | undefined;

export const openWhatsApp = (waLink: string, message: string) => {
  window.open(`${waLink}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
};

export const submitToFormspree = async (payload: Record<string, string>) => {
  if (!FORMSPREE_ENDPOINT) return false;

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
};
