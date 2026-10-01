import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import Privacy from "./privacy.mdx";

const Page = () => {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-28 lg:pt-44 lg:pb-32 overflow-x-hidden">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to home
        </Link>
      </div>

      <article className="prose prose-lg dark:prose-invert max-w-none break-words [overflow-wrap:anywhere] [word-break:break-word]">
        <Privacy />
      </article>
    </section>
  );
};

export default Page;
