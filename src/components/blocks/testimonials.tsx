import Image from "next/image";
import Link from "next/link";

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

export const Testimonials = ({
  className,
  dashedLineClassName,
  items: itemsProp,
}: {
  className?: string;
  dashedLineClassName?: string;
  items?: TestimonialItem[];
}) => {
  // Only real, published client reviews from the database are ever shown;
  // there is no built-in list, so none published (or no database) hides the
  // section.
  if (!itemsProp || itemsProp.length === 0) return null;
  // The carousel loops: short lists are shown twice.
  const items = itemsProp.length < 8 ? [...itemsProp, ...itemsProp] : itemsProp;

  return (
    <>
      <section className={cn("overflow-hidden py-28 lg:py-32", className)}>
        <div className="container">
          <ScrollReveal yOffset={24} duration={0.7}>
            <div className="space-y-4">
              <h2 className="text-2xl tracking-tight md:text-4xl lg:text-5xl">
                What our clients say
              </h2>
              <p className="text-muted-foreground max-w-md leading-snug">
                Reviews from LevelUp clients, published with their permission.
              </p>
              <Button asChild variant="outline" className="shadow-md">
                <Link href="/projects">
                  See our work <ArrowRight className="size-4" />
                </Link>
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
