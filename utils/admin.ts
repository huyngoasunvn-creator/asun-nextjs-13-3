const DEFAULT_ADMIN_EMAILS = ["admin@droppii.vn"];

function parseAdminEmails(value?: string | null) {
  if (!value) return [];

  return value
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || "";
}

export function getPublicAdminEmails() {
  const configuredEmails = parseAdminEmails(process.env.NEXT_PUBLIC_ADMIN_EMAILS);
  return configuredEmails.length ? configuredEmails : DEFAULT_ADMIN_EMAILS;
}

export function getServerAdminEmails() {
  const configuredEmails = parseAdminEmails(
    process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS
  );

  return configuredEmails.length ? configuredEmails : DEFAULT_ADMIN_EMAILS;
}

export function isAdminEmail(
  email?: string | null,
  allowedEmails: string[] = getPublicAdminEmails()
) {
  const normalizedEmail = normalizeEmail(email);
  return !!normalizedEmail && allowedEmails.includes(normalizedEmail);
}
