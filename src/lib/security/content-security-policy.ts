const PRODUCTION_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
];

const DEVELOPMENT_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' ws:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
];

export function getContentSecurityPolicy(isDevelopment: boolean): string {
  const directives = isDevelopment
    ? DEVELOPMENT_DIRECTIVES
    : PRODUCTION_DIRECTIVES;

  return directives.join("; ");
}

export const SECURITY_META = {
  contentTypeOptions: "nosniff",
  referrerPolicy: "strict-origin-when-cross-origin",
} as const;
