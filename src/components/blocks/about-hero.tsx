import { DashedLine } from "@/components/dashed-line";
import { Headline, Hero, M, Count } from "@/components/motion/primitives";
import { aboutHeroCopy } from "@/data/site-copy";
import { getSectionCopy } from "@/lib/levelup-site";
import { truthfulStats } from "@/lib/marketing-claims";

export async function AboutHero() {
  const copy = await getSectionCopy("about", "hero", aboutHeroCopy);
  const stats = truthfulStats(copy.stats, aboutHeroCopy.stats);
  return (
    <section className="">
      <div className="container flex max-w-5xl flex-col justify-between gap-8 md:gap-20 lg:flex-row lg:items-center lg:gap-24 xl:gap-24">
        <div className="flex-[1.5]">
          <Hero as="span" kind="fade" className="text-xs font-mono font-bold uppercase tracking-widest text-brand-ink">
            {copy.eyebrow}
          </Hero>
          <Headline hero as="h1" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {copy.title}
          </Headline>

          <Hero as="p" delay={260} className="text-foreground/90 mt-5 text-xl md:text-2xl lg:text-3xl font-medium leading-snug">
            {copy.lead}
          </Hero>

          <Hero delay={420} className="text-muted-foreground mt-8 hidden max-w-lg space-y-4 text-base leading-relaxed md:block lg:mt-10">
            {copy.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </Hero>
        </div>

        <div
          className={`relative flex flex-1 flex-col justify-center gap-6 pt-10 lg:pt-0 lg:pl-10`}
        >
          <DashedLine
            orientation="vertical"
            className="absolute top-0 left-0 max-lg:hidden"
          />
          <DashedLine
            orientation="horizontal"
            className="absolute top-0 lg:hidden"
          />
          {stats.map((stat, index) => (
            <M key={index} delay={index * 90} className="flex flex-col gap-1">
              <div className="font-display text-4xl font-bold tracking-tight md:text-5xl text-foreground">
                <Count value={stat.value} />
              </div>
              <div className="text-muted-foreground text-sm font-medium">{stat.label}</div>
            </M>
          ))}
        </div>
      </div>
    </section>
  );
}
