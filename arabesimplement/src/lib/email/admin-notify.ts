export const DEFAULT_ADMIN_NOTIFY_EMAIL = "arabeen10@gmail.com";

export function adminNotifyEmail(): string {
  const fromEnv = process.env.ADMIN_NOTIFY_EMAIL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_ADMIN_NOTIFY_EMAIL;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function resendFromHeader(): string {
  const from =
    process.env.RESEND_FROM ?? "ArabeSimplement <onboarding@resend.dev>";
  return from.includes("<") && from.includes(">")
    ? from
    : `ArabeSimplement <${from}>`;
}
