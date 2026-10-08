const LOGIN_BASE = "https://dashboard.levelup-ecosystem.com/auth";

/** LevelStudio, the AI website builder: where every free preview is built. */
export const LEVELSTUDIO_URL = "https://studio.levelup-ecosystem.com";

/**
 * URL of the single LevelUp login page. The dashboard validates `next` again
 * (only levelup-ecosystem.com and its subdomains are accepted).
 */
export function levelUpLoginUrl(mode: "sign-in" | "sign-up", next?: string | null): string {
  const url = new URL(`${LOGIN_BASE}/${mode}`);
  if (next) url.searchParams.set("next", next);
  return url.toString();
}
