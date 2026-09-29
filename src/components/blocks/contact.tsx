import React from "react";

import Link from "next/link";

import { Mail, MapPin, Sparkles } from "lucide-react";

import { ContactForm } from "@/components/blocks/contact-form";
import { DashedLine } from "@/components/dashed-line";

const contactInfo = [
  {
    icon: MapPin,
    title: "Studio Location",
    content: (
      <div className="text-muted-foreground mt-2 text-sm leading-relaxed">
        <p className="font-semibold text-foreground">San Diego, California</p>
        <p>Serving Downtown, North Park, Pacific Beach, La Jolla, Chula Vista, and clients nationwide.</p>
      </div>
    ),
  },
  {
    icon: Mail,
    title: "Direct Studio Email",
    content: (
      <div className="mt-2 text-sm">
        <Link
          href="mailto:hello@levelup-ecosystem.com"
          className="font-medium text-foreground hover:underline"
        >
          hello@levelup-ecosystem.com
        </Link>
        <p className="text-muted-foreground text-xs mt-1">
          Support &amp; client inquiries
        </p>
      </div>
    ),
  },
  {
    icon: Sparkles,
    title: "Free 24-48h Preview",
    content: (
      <div className="text-muted-foreground mt-2 text-sm leading-relaxed">
        <p>Send your business details. We build a functional mobile prototype on your phone before any payment.</p>
      </div>
    ),
  },
];

export default function Contact() {
  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container max-w-3xl">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground">
            Get In Touch With LevelUp Ecosystem
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Let&apos;s Build Your Website
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-sm md:text-base">
            Request your free interactive mobile preview, ask questions about 24/7 online booking, or request a non-destructive website security check.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div key={index} className="p-5 rounded-2xl border border-border/80 bg-card/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-foreground" />
                  <h2 className="font-semibold text-sm text-foreground">{info.title}</h2>
                </div>
                {info.content}
              </div>
            );
          })}
        </div>

        <DashedLine className="my-12" />

        {/* Inquiry Form */}
        <div className="mx-auto max-w-xl">
          <div className="mb-6 space-y-1 text-center md:text-left">
            <h2 className="text-xl font-bold tracking-tight">Request a Preview or Consultation</h2>
            <p className="text-xs text-muted-foreground">
              Tell us about your business, current website or goals. We reply within 24 business hours.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
