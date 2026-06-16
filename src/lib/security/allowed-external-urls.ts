export const ALLOWED_EXTERNAL_HOSTS = ["www.gov.uk", "gov.uk"] as const;

export const GOVUK_COUNCIL_TAX_DISCOUNT_URL =
  "https://www.gov.uk/apply-for-council-tax-discount";

export const GOVUK_JSA_URL = "https://www.gov.uk/jobseekers-allowance";

export const ALLOWED_EXTERNAL_URLS = [
  GOVUK_COUNCIL_TAX_DISCOUNT_URL,
  GOVUK_JSA_URL,
] as const;

export type AllowedExternalUrl = (typeof ALLOWED_EXTERNAL_URLS)[number];

export function isAllowedExternalUrl(url: string): url is AllowedExternalUrl {
  if (!ALLOWED_EXTERNAL_URLS.includes(url as AllowedExternalUrl)) {
    return false;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return ALLOWED_EXTERNAL_HOSTS.includes(
      parsed.hostname as (typeof ALLOWED_EXTERNAL_HOSTS)[number],
    );
  } catch {
    return false;
  }
}

export function assertAllowedExternalUrl(url: string): AllowedExternalUrl {
  if (!isAllowedExternalUrl(url)) {
    throw new Error(`External URL is not allowlisted: ${url}`);
  }

  return url;
}
