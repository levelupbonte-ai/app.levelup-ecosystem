"use client";

import Image from "next/image";

import { SplitText } from "@/components/scroll/split-text";

export function FounderSection() {
  return (
    <section className="py-20 lg:py-28 overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left column: Text content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <SplitText
              text="The founder"
              as="h2"
              className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-foreground"
            />
            {/* Design dot from reference */}
            <div className="size-2 rounded-full bg-foreground my-5 sm:my-6" />

            <div className="space-y-5 text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
              <p className="text-foreground/90 font-medium">
                I&apos;m Fabian Albert, a visual designer based in Eastern Europe.
              </p>
              <p>
                I&apos;ve always been drawn to strong aesthetics, which naturally
                led me toward a more focused path in digital design. For the past
                14 years, I&apos;ve been exploring design in depth and working with
                startups and ventures to create meaningful results, stronger
                experiences, and better conversions.
              </p>
              <p>
                Attention to details plays a big role in my work which ultimately
                improves the end experience and creates natural &amp; organic
                engagement.
              </p>
            </div>
          </div>

          {/* Right column: Founder photo with clean gradient fades */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-[3/4]">
              {/* Image with CSS mask for smooth bottom/side fade */}
              <div className="relative w-full h-full overflow-hidden [mask-image:linear-gradient(to_bottom,black_50%,rgba(0,0,0,0.7)_70%,transparent_96%)] [-webkit-mask-image:linear-gradient(to_bottom,black_50%,rgba(0,0,0,0.7)_70%,transparent_96%)]">
                <Image
                  src="/images/founder.png"
                  alt="The founder"
                  fill
                  className="object-cover object-top select-none pointer-events-none"
                  priority
                />
              </div>

              {/* Bottom ambient gradient overlay to seamlessly blend into page background */}
              <div
                className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none"
                aria-hidden="true"
              />
              {/* Subtle edge blend on the left */}
              <div
                className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background via-transparent to-transparent pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
