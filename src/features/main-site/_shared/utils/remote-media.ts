const trustedRemoteImageHost = "dllvucwgezsuhwktkwxd.supabase.co";

export function getTrustedImageUrl(value: string | null | undefined) {
  if (!value) return null;
  if (value.startsWith("/")) return value;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === trustedRemoteImageHost ? value : null;
  } catch {
    return null;
  }
}
