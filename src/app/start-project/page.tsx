"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Globe,
  Calendar,
  Shield,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Send,
  Building,
  Mail,
  User,
  Phone,
  MessageSquare,
  Layers,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Project Types
const PROJECT_TYPES = [
  {
    id: "booking-engine",
    title: "24/7 Automated Booking Engine",
    subtitle: "Self-service client scheduling, calendar sync & SMS/email alerts",
    badge: "Most Popular",
    basePrice: 1500,
    icon: Calendar,
  },
  {
    id: "web-app",
    title: "Full-Stack Custom Web App",
    subtitle: "Next.js, secure database, user authentication & custom API",
    badge: "High Performance",
    basePrice: 2400,
    icon: Globe,
  },
  {
    id: "brand-platform",
    title: "Brand Showcase & Conversion Site",
    subtitle: "Fast landing page engineered for high Google search visibility",
    badge: "Fast Turnaround",
    basePrice: 850,
    icon: Zap,
  },
  {
    id: "digital-invitation",
    title: "Bespoke Digital Invitation & RSVP",
    subtitle: "Luxury interactive wedding or event website with guest manager",
    badge: "Unique Experience",
    basePrice: 450,
    icon: Sparkles,
  },
  {
    id: "business-portal",
    title: "Client Portal & SaaS Dashboard",
    subtitle: "Authenticated workspace for customers, contracts & invoicing",
    badge: "Enterprise",
    basePrice: 3200,
    icon: Layers,
  },
];

// Architecture Modules
const FEATURE_MODULES = [
  {
    id: "booking-sync",
    name: "2-Way Calendar Integration",
    desc: "Google Calendar, Apple, Outlook & Calendly live sync",
    includedIn: ["booking-engine", "business-portal"],
    cost: 350,
  },
  {
    id: "cyber-hardening",
    name: "Cybersecurity Audit & Web Hardening",
    desc: "OWASP protection, security headers, SSL and spam filtering",
    includedIn: ["booking-engine", "web-app", "business-portal"],
    cost: 400,
  },
  {
    id: "stripe-checkout",
    name: "Stripe Payment Gateway",
    desc: "Instant card checkout, deposits, subscriptions & receipts",
    includedIn: ["business-portal"],
    cost: 300,
  },
  {
    id: "seo-architecture",
    name: "Advanced Local & Nationwide SEO",
    desc: "Schema.org markup, Google Search Console & speed tuning",
    includedIn: ["booking-engine", "brand-platform"],
    cost: 250,
  },
  {
    id: "mobile-preview",
    name: "Free 24-48h Mobile Prototype",
    desc: "Functional interactive prototype tested directly on your phone",
    includedIn: ["booking-engine", "web-app", "brand-platform", "digital-invitation", "business-portal"],
    cost: 0,
  },
  {
    id: "care-support",
    name: "Managed Cloud Care ($99/mo)",
    desc: "Continuous hosting, offsite daily backups & priority edits",
    includedIn: [],
    cost: 99,
  },
];

// Budget Tiers
const BUDGET_TIERS = [
  { id: "starter", name: "Starter Tier", range: "$850 - $1,200", timeline: "3 - 5 days" },
  { id: "secure", name: "Secure Engine", range: "$1,500 - $2,500", timeline: "5 - 7 days", isPopular: true },
  { id: "custom", name: "Custom Architecture", range: "$3,000+", timeline: "2 - 3 weeks" },
  { id: "urgent", name: "Urgent Express Delivery", range: "Rush Priority", timeline: "48 hours" },
];

export default function StartProjectPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string>("booking-engine");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    "booking-sync",
    "cyber-hardening",
    "seo-architecture",
    "mobile-preview",
  ]);
  const [selectedBudget, setSelectedBudget] = useState<string>("secure");

  // Client Details Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    projectNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Toggle Feature
  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((id) => id !== featureId)
        : [...prev, featureId]
    );
  };

  // Calculate estimated total
  const currentProjectType = PROJECT_TYPES.find((t) => t.id === selectedType);
  const baseCost = currentProjectType ? currentProjectType.basePrice : 1500;
  const extraFeaturesCost = selectedFeatures.reduce((acc, featId) => {
    const feat = FEATURE_MODULES.find((m) => m.id === featId);
    if (!feat) return acc;
    // If it's already included in the base project type, don't charge extra
    if (feat.includedIn.includes(selectedType)) return acc;
    return acc + feat.cost;
  }, 0);
  const totalEstimate = baseCost + extraFeaturesCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setSubmitError("Please fill in your name and email address.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Send submission to API or save payload
      const payload = {
        type: selectedType,
        features: selectedFeatures,
        budgetTier: selectedBudget,
        client: formData,
        estimatedTotal: totalEstimate,
        timestamp: new Date().toISOString(),
      };

      // Direct asynchronous intake
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.businessName || "Start Project Inquiry",
          message: `[PROJECT BUILDER INTAKE]\nType: ${selectedType}\nBudget: ${selectedBudget}\nFeatures: ${selectedFeatures.join(", ")}\nEstimate: $${totalEstimate}\nNotes: ${formData.projectNotes}\nPhone: ${formData.phone}`,
        }),
      }).catch(() => {
        // Fallback gracefully
      });

      // Save to localStorage for instant client dashboard recall
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("levelup_last_project_brief", JSON.stringify(payload));
        } catch {
          // ignore
        }
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError("An error occurred while saving your project. Please try again or email contact@levelup-ecosystem.com.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 lg:pt-36">
      <div className="container max-w-5xl">
        {/* Header Introduction */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 border border-border/70 text-xs font-mono font-medium text-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Interactive Project Builder • Free 24-48h Prototype
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Start Your Project
          </h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Configure your technical requirements, preview instant estimates, and get a functional mobile prototype on your phone within 24 to 48 hours.
          </p>
        </div>

        {/* Progress Stepper */}
        {!isSubmitted && (
          <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
            {[
              { num: 1, label: "Platform" },
              { num: 2, label: "Architecture" },
              { num: 3, label: "Timeline" },
              { num: 4, label: "Brief & Launch" },
            ].map((s) => {
              const isPassed = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} className="relative z-10 flex flex-col items-center gap-1.5 bg-background px-2">
                  <button
                    type="button"
                    onClick={() => s.num < currentStep && setCurrentStep(s.num)}
                    disabled={s.num > currentStep}
                    className={cn(
                      "size-8 md:size-9 rounded-full flex items-center justify-center text-xs md:text-sm font-semibold transition-all cursor-pointer",
                      isPassed
                        ? "bg-foreground text-background"
                        : isCurrent
                          ? "bg-foreground text-background ring-4 ring-foreground/20"
                          : "bg-muted text-muted-foreground border border-border"
                    )}
                  >
                    {isPassed ? <Check className="size-4" /> : s.num}
                  </button>
                  <span className={cn(
                    "text-[11px] font-medium hidden sm:block",
                    isCurrent ? "text-foreground font-semibold" : "text-muted-foreground"
                  )}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Main Grid: Form Steps + Live Dynamic Summary Sidebar */}
        {!isSubmitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Step Content (Left 7 Cols) */}
            <div className="lg:col-span-8 bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm">
              {/* STEP 1: PROJECT TYPE */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">1. What are you building?</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose the platform architecture that best describes your project.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {PROJECT_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedType === type.id;
                      return (
                        <div
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={cn(
                            "relative p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left",
                            isSelected
                              ? "border-foreground bg-foreground/5 shadow-xs ring-1 ring-foreground/50"
                              : "border-border/80 hover:border-border hover:bg-muted/30"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="p-2 rounded-lg bg-foreground/10 text-foreground">
                              <Icon className="size-5" />
                            </div>
                            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {type.badge}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-semibold text-sm leading-snug">{type.title}</h3>
                            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {type.subtitle}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-mono">
                            <span className="text-muted-foreground">From</span>
                            <span className="font-semibold text-foreground">${type.basePrice.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setCurrentStep(2)} className="gap-2 rounded-lg font-semibold">
                      Continue to Architecture <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 2: ARCHITECTURE & MODULES */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">2. Select Modules &amp; Capabilities</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pick the technical modules your platform requires. We will configure each system securely.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {FEATURE_MODULES.map((module) => {
                      const isSelected = selectedFeatures.includes(module.id);
                      const isIncludedInBase = module.includedIn.includes(selectedType);

                      return (
                        <div
                          key={module.id}
                          onClick={() => toggleFeature(module.id)}
                          className={cn(
                            "flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer select-none",
                            isSelected
                              ? "border-foreground bg-foreground/5 shadow-xs"
                              : "border-border/80 hover:bg-muted/30"
                          )}
                        >
                          <div className={cn(
                            "size-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-all",
                            isSelected
                              ? "bg-foreground border-foreground text-background"
                              : "border-muted-foreground/40 bg-background"
                          )}>
                            {isSelected && <Check className="size-3.5 stroke-[3]" />}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold leading-snug">{module.name}</h3>
                              {isIncludedInBase && (
                                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                                  Included in base
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                              {module.desc}
                            </p>
                          </div>

                          <div className="text-xs font-mono font-medium text-right shrink-0">
                            {isIncludedInBase ? (
                              <span className="text-muted-foreground">Included</span>
                            ) : module.cost === 0 ? (
                              <span className="text-emerald-500 font-bold">Free</span>
                            ) : (
                              <span>+${module.cost}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Button variant="outline" onClick={() => setCurrentStep(1)} className="gap-2 rounded-lg">
                      <ArrowLeft className="size-4" /> Back
                    </Button>
                    <Button onClick={() => setCurrentStep(3)} className="gap-2 rounded-lg font-semibold">
                      Continue to Timeline <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 3: TIMELINE & BUDGET TIER */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">3. Budget Range &amp; Target Delivery</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose your preferred speed and investment range. No hidden subscription fees.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {BUDGET_TIERS.map((tier) => {
                      const isSelected = selectedBudget === tier.id;
                      return (
                        <div
                          key={tier.id}
                          onClick={() => setSelectedBudget(tier.id)}
                          className={cn(
                            "p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 text-left",
                            isSelected
                              ? "border-foreground bg-foreground/5 shadow-xs ring-1 ring-foreground/50"
                              : "border-border/80 hover:bg-muted/30"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">{tier.name}</span>
                            {tier.isPopular && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-foreground text-background font-semibold">
                                Recommended
                              </span>
                            )}
                          </div>

                          <div>
                            <p className="text-lg font-bold font-mono text-foreground">{tier.range}</p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                              <Clock className="size-3.5" />
                              <span>Estimated turnaround: {tier.timeline}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <Button variant="outline" onClick={() => setCurrentStep(2)} className="gap-2 rounded-lg">
                      <ArrowLeft className="size-4" /> Back
                    </Button>
                    <Button onClick={() => setCurrentStep(4)} className="gap-2 rounded-lg font-semibold">
                      Continue to Brief <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* STEP 4: CONTACT & BRIEF */}
              {currentStep === 4 && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">4. Project Brief &amp; Contact</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tell us about your brand. We will prepare your functional mobile prototype in 24-48 hours.
                    </p>
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500">
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="client-name" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <User className="size-3.5 text-muted-foreground" /> Your Full Name *
                      </label>
                      <Input
                        id="client-name"
                        type="text"
                        required
                        placeholder="Richelieu Bonte"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="client-email" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Mail className="size-3.5 text-muted-foreground" /> Email Address *
                      </label>
                      <Input
                        id="client-email"
                        type="email"
                        required
                        placeholder="contact@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="client-company" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Building className="size-3.5 text-muted-foreground" /> Company / Brand Name
                      </label>
                      <Input
                        id="client-company"
                        type="text"
                        placeholder="LevelUp Studio"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="client-phone" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                        <Phone className="size-3.5 text-muted-foreground" /> Phone / WhatsApp (Optional)
                      </label>
                      <Input
                        id="client-phone"
                        type="tel"
                        placeholder="+1 (619) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="client-notes" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <MessageSquare className="size-3.5 text-muted-foreground" /> Tell Us About Your Goals &amp; Timeline
                    </label>
                    <Textarea
                      id="client-notes"
                      rows={4}
                      placeholder="What is your business? Do you have an existing website or domain? Any specific integrations or reference sites you like?"
                      value={formData.projectNotes}
                      onChange={(e) => setFormData({ ...formData, projectNotes: e.target.value })}
                      className="rounded-lg resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <Button type="button" variant="outline" onClick={() => setCurrentStep(3)} className="gap-2 rounded-lg">
                      <ArrowLeft className="size-4" /> Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="gap-2 rounded-lg font-semibold px-6">
                      {isSubmitting ? (
                        <>Submitting Brief...</>
                      ) : (
                        <>
                          Submit Project Brief <Send className="size-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Live Summary Sidebar (Right 4 Cols) */}
            <div className="lg:col-span-4 bg-muted/40 border border-border/80 rounded-2xl p-6 space-y-5 sticky top-28">
              <div className="flex items-center justify-between border-b border-border/70 pb-3">
                <span className="text-xs font-mono uppercase font-semibold text-muted-foreground">
                  Project Estimate
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                  Zero Lock-in
                </span>
              </div>

              {/* Selected Type */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-mono">Platform Type</p>
                <p className="font-semibold text-sm leading-snug">{currentProjectType?.title}</p>
                <p className="text-xs font-mono text-muted-foreground">Base: ${baseCost.toLocaleString()}</p>
              </div>

              {/* Selected Modules */}
              <div className="space-y-1.5 border-t border-border/60 pt-3">
                <p className="text-xs text-muted-foreground font-mono">Active Modules ({selectedFeatures.length})</p>
                <ul className="space-y-1 text-xs">
                  {selectedFeatures.map((id) => {
                    const f = FEATURE_MODULES.find((m) => m.id === id);
                    if (!f) return null;
                    return (
                      <li key={id} className="flex items-center justify-between text-muted-foreground">
                        <span className="flex items-center gap-1.5 truncate">
                          <Check className="size-3 text-emerald-500 shrink-0" /> {f.name}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Estimated Total */}
              <div className="border-t border-border/70 pt-4 space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold">Estimated Total</span>
                  <span className="text-2xl font-bold font-mono text-foreground">
                    ${totalEstimate.toLocaleString()}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Includes 100% full source code ownership, free 24-48h functional preview, and direct human engineering.
                </p>
              </div>

              {/* Security Seal */}
              <div className="p-3 rounded-xl bg-background border border-border/70 flex items-start gap-2.5 text-xs text-muted-foreground">
                <Shield className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  Audited &amp; hardened code. No recurring builder subscription traps.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* SUBMITTED SUCCESS CELEBRATION CARD */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-card border border-border/80 rounded-2xl p-8 sm:p-10 shadow-xl text-center space-y-6"
          >
            <div className="size-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/20">
              <CheckCircle2 className="size-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Project Brief Received!
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Thank you, <span className="font-semibold text-foreground">{formData.name}</span>. Our engineering team has received your technical specifications.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/70 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-mono">Platform</span>
                <span className="font-semibold text-foreground">{currentProjectType?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-mono">Estimated Investment</span>
                <span className="font-mono font-semibold text-foreground">${totalEstimate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-mono">Next Step</span>
                <span className="font-semibold text-emerald-500">24-48h Functional Mobile Prototype</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard/overview" className="w-full sm:w-auto">
                <Button className="w-full font-semibold rounded-lg gap-2">
                  Open Client Workspace <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full rounded-lg">
                  Return to Home
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
