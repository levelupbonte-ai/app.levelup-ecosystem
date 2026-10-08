import Image from "next/image";

import { ArrowRight } from "lucide-react";

import { DashedLine } from "@/components/dashed-line";
import { ScrollReveal } from "@/components/scroll/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  image: string;
}

// Built-in fallback; the live list comes from the LevelUp database (reviews).
const defaultItems: TestimonialItem[] = [
  {
    quote: "We're misusing LevelUp as a CRM and it still works!",
    author: "Amy Chase",
    role: "PM",
    company: "Mercury Finance",
    image: "/testimonials/amy-chase.webp",
  },
  {
    quote: "I was able to replace 80% of my team with LevelUp bots.",
    author: "Jonas Kotara",
    role: "Lead Engineer",
    company: "Mercury Finance",
    image: "/testimonials/jonas-kotara.webp",
  },
  {
    quote: "Founder Mode is hard enough without having a really nice PM app.",
    author: "Kevin Yam",
    role: "Founder",
    company: "Mercury Finance",
    image: "/testimonials/kevin-yam.webp",
  },
  {
    quote: "I can use the tool as a substitute from my PM.",
    author: "Kundo Marta",
    role: "Founder",
    company: "Mercury Finance",
    image: "/testimonials/kundo-marta.webp",
  },
  {
    quote: "We're misusing LevelUp as a CRM and it still works!",
    author: "Amy Chase",
    role: "PM",
    company: "Mercury Finance",
    image: "/testimonials/amy-chase.webp",
  },
  {
    quote: "I was able to replace 80% of my team with LevelUp bots.",
    author: "Jonas Kotara",
    role: "Lead Engineer",
    company: "Mercury Finance",
    image: "/testimonials/jonas-kotara.webp",
  },
  {
    quote: "Founder Mode is hard enough without having a really nice PM app.",
    author: "Kevin Yam",
    role: "Founder",
    company: "Mercury Finance",
    image: "/testimonials/kevin-yam.webp",
  },
  {
    quote: "I can use the tool as a substitute from my PM.",
    author: "Kundo Marta",
    role: "Founder",
    company: "Mercury Finance",
    image: "/testimonials/kundo-marta.webp",
  },
];

export const Testimonials = ({
  className,
  dashedLineClassName,
  items: itemsProp,
}: {
  className?: string;
  dashedLineClassName?: string;
  items?: TestimonialItem[];
}) => {
  // Published reviews from the database; none published → no section.
  if (itemsProp && itemsProp.length === 0) return null;
  // The carousel loops: short lists are shown twice, like the built-in list.
  const items =
    itemsProp && itemsProp.length > 0
      ? itemsProp.length < 8
        ? [...itemsProp, ...itemsProp]
        : itemsProp
      : defaultItems;

  return (
    <>
      <section className={cn("overflow-hidden py-28 lg:py-32", className)}>
        <div className="container">
          <ScrollReveal yOffset={24} duration={0.7}>
            <div className="space-y-4">
              <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
                Trusted by product builders
              </h2>
              <p className="text-muted-foreground max-w-md leading-snug">
                LevelUp is built on the habits that make the best product teams
                successful: staying focused, moving quickly, and always aiming for
                high-quality work.
              </p>
              <Button variant="outline" className="shadow-md">
                Read our Customer Stories <ArrowRight className="size-4" />
              </Button>
            </div>
          </ScrollReveal>

          <ScrollReveal yOffset={32} duration={0.8} delay={0.15}>
            <div className="relative mt-8 -mr-[max(3rem,calc((100vw-80rem)/2+3rem))] md:mt-12 lg:mt-20">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="">
                {items.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className="xl:basis-1/3.5 grow basis-4/5 sm:basis-3/5 md:basis-2/5 lg:basis-[28%] 2xl:basis-[24%]"
                  >
                    <Card className="bg-muted h-full overflow-hidden border-none">
                      <CardContent className="flex h-full flex-col p-0">
                        <div className="relative h-[288px] lg:h-[328px]">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.author}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between gap-10 p-6">
                          <blockquote className="font-display text-lg leading-none! font-medium md:text-xl lg:text-2xl">
                            {testimonial.quote}
                          </blockquote>
                          <div className="space-y-0.5">
                            <div className="text-foreground font-semibold">
                              {testimonial.author}
                            {testimonial.role ? `, ${testimonial.role}` : ""}
                            </div>
                            <div className="text-muted-foreground text-sm">
                              {testimonial.company}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-8 flex gap-3">
                <CarouselPrevious className="bg-muted hover:bg-muted/80 static size-14.5 translate-x-0 translate-y-0 transition-colors [&>svg]:size-6 lg:[&>svg]:size-8" />
                <CarouselNext className="bg-muted hover:bg-muted/80 static size-14.5 translate-x-0 translate-y-0 transition-colors [&>svg]:size-6 lg:[&>svg]:size-8" />
              </div>
            </Carousel>
          </div>
          </ScrollReveal>
        </div>
      </section>
      <DashedLine
        orientation="horizontal"
        className={cn("mx-auto max-w-[80%]", dashedLineClassName)}
      />
    </>
  );
};
