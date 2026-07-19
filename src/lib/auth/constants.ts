export const AUTHOR_EMAIL = "gse06044@naver.com";

export function isAuthorEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase() === AUTHOR_EMAIL.toLowerCase();
}
