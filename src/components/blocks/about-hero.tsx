import { DashedLine } from "@/components/dashed-line";

const stats = [
  {
    value: "< 2s",
    label: "Mobile page load speed",
  },
  {
    value: "24/7",
    label: "Online appointment booking",
  },
  {
    value: "100%",
    label: "Code & client ownership",
  },
  {
    value: "$0",
    label: "Bulky builder subscription lock-in",
  },
];

export function AboutHero() {
  return (
    <section className="">
      <div className="container flex max-w-5xl flex-col justify-between gap-8 md:gap-20 lg:flex-row lg:items-center lg:gap-24 xl:gap-24">
        <div className="flex-[1.5]">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
            Independent Web & Security Studio • San Diego, CA
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Meet LevelUp Ecosystem
          </h1>

          <p className="text-foreground/90 mt-5 text-xl md:text-2xl lg:text-3xl font-medium leading-snug">
            Fast, secure digital infrastructure engineered for local businesses, barbershops, salons, and creators.
          </p>

          <div className="text-muted-foreground mt-8 hidden max-w-lg space-y-4 text-base leading-relaxed md:block lg:mt-10">
            <p>
              Based in San Diego, California, LevelUp Ecosystem was born out of a clear frustration:
              local service businesses were stuck between expensive agencies charging $3,000+ for slow,
              bloated templates, and complex DIY website builders that leaked customer data and broke on mobile devices.
            </p>
            <p>
              We deliver a better alternative: clean, lightweight code engineered for effortless 24/7 customer
              appointment booking, sub-2-second mobile load speeds, and real cybersecurity protections from day one.
            </p>
          </div>
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
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <div className="font-display text-4xl font-bold tracking-tight md:text-5xl text-foreground">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
