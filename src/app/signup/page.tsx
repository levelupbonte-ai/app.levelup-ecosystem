import { redirect } from "next/navigation";

import { levelUpLoginUrl } from "@/lib/levelup-login";

// One LevelUp login page for every app: it lives on the dashboard and its session
// cookie covers *.levelup-ecosystem.com. Old links (?redirect_uri=, ?next=) keep working.
export default async function Page(props: {
  searchParams: Promise<{ next?: string; redirect_uri?: string }>;
}) {
  const { next, redirect_uri } = await props.searchParams;
  redirect(levelUpLoginUrl("sign-up", next ?? redirect_uri));
}
