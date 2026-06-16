import {
  getContentSecurityPolicy,
  SECURITY_META,
} from "@/lib/security/content-security-policy";

const isDevelopment = process.env.NODE_ENV === "development";

export function SecurityMetaTags() {
  return (
    <>
      <meta
        httpEquiv="Content-Security-Policy"
        content={getContentSecurityPolicy(isDevelopment)}
      />
      <meta
        httpEquiv="X-Content-Type-Options"
        content={SECURITY_META.contentTypeOptions}
      />
      <meta
        httpEquiv="Referrer-Policy"
        content={SECURITY_META.referrerPolicy}
      />
    </>
  );
}
