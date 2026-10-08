import React from "react";

import Link from "next/link";

import { Mail, MapPin, Sparkles } from "lucide-react";

import { ContactForm } from "@/components/blocks/contact-form";
import { DashedLine } from "@/components/dashed-line";
import { contactCopy } from "@/data/site-copy";
import { getSectionCopy } from "@/lib/levelup-site";

const EMAIL = /^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i;

export default async function Contact() {
  const copy = await getSectionCopy("contact", "intro", contactCopy);
  const email = EMAIL.test(copy.email) ? copy.email : contactCopy.email;
  const contactInfo = [
    {
      icon: MapPin,
      title: "Studio Location",
      content: (
        <div className="text-muted-foreground mt-2 text-sm leading-relaxed">
          <p className="font-semibold text-foreground">{copy.location}</p>
          <p>{copy.location_note}</p>
        </div>
      ),
    },
    {
      icon: Mail,
      title: "Direct Studio Email",
      content: (
        <div className="mt-2 text-sm">
          <Link
            href={`mailto:${email}`}
            className="font-medium text-foreground hover:underline"
          >
            {email}
          </Link>
          <p className="text-muted-foreground text-xs mt-1">{copy.email_note}</p>
        </div>
      ),
    },
    {
      icon: Sparkles,
      title: copy.preview_title,
      content: (
        <div className="text-muted-foreground mt-2 text-sm leading-relaxed">
          <p>{copy.preview_text}</p>
        </div>
      ),
    },
  ];

  return (
    <section className="py-28 lg:py-32 lg:pt-44">
      <div className="container max-w-3xl">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-muted-foreground">
            {copy.eyebrow}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            {copy.title}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed text-sm md:text-base">
            {copy.subtitle}
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
            <h2 className="text-xl font-bold tracking-tight">{copy.form_title}</h2>
            <p className="text-xs text-muted-foreground">
              {copy.form_subtitle}
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
