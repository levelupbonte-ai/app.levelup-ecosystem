"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Calendar,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  ExternalLink,
  Code2,
  Activity,
  HardDrive,
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "projects" | "bookings" | "security">("overview");

  return (
    <div className="min-h-screen pt-28 pb-20 lg:pt-36">
      <div className="container max-w-6xl space-y-8">
        {/* Top Breadcrumb & Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">LevelUp</Link>
              <span>/</span>
              <span className="text-foreground font-semibold">Client Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Real-time telemetry, active build status, automated booking analytics, and security health.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/start-project">
              <Button size="sm" className="gap-2 font-semibold rounded-lg">
                <Plus className="size-4" /> Start New Project
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="sm" variant="outline" className="gap-2 rounded-lg">
                <Headphones className="size-4" /> Support Desk
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards (shadcn dashboard style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium font-mono">Active Builds</span>
              <Globe className="size-4 text-foreground/80" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold font-mono text-foreground">1 Active</div>
              <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Production Live (99.98% SLA)
              </p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium font-mono">Online Bookings</span>
              <Calendar className="size-4 text-foreground/80" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold font-mono text-foreground">128 Bookings</div>
              <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                <ArrowUpRight className="size-3.5" /> +28.4% this month
              </p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium font-mono">Mobile Speed Score</span>
              <Zap className="size-4 text-foreground/80" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold font-mono text-foreground">99 / 100</div>
              <p className="text-xs text-muted-foreground font-mono">
                1.1s Core Web Vitals
              </p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium font-mono">Cybersecurity Rating</span>
              <ShieldCheck className="size-4 text-emerald-500" />
            </div>
            <div className="space-y-0.5">
              <div className="text-2xl font-bold font-mono text-foreground">A+ Hardened</div>
              <p className="text-xs text-emerald-500 font-medium">
                0 Vulnerabilities • SSL Strict
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex items-center gap-2 border-b border-border/70 pb-2 overflow-x-auto text-sm">
          {[
            { id: "overview", label: "Overview" },
            { id: "projects", label: "Active Projects" },
            { id: "bookings", label: "Bookings & Inquiries" },
            { id: "security", label: "Security & Audits" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-all cursor-pointer",
                activeTab === tab.id
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Active Project Card (8 Cols) */}
            <div className="lg:col-span-8 bg-card border border-border/80 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold">LevelUp Production Build #1</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      Live &amp; Deployed
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Next.js 15 App Architecture • 24/7 Booking Engine • San Diego &amp; Global CDN
                  </p>
                </div>
                <Link href="/projects" className="text-xs font-semibold text-foreground hover:underline inline-flex items-center gap-1">
                  View Demo <ExternalLink className="size-3" />
                </Link>
              </div>

              {/* Engineering Milestones */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">Delivery Milestone Completion</span>
                  <span className="font-mono text-muted-foreground">100% Complete</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-foreground rounded-full w-full" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                  <div className="flex items-center gap-1.5 text-foreground font-medium">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" /> Wireframe &amp; UX
                  </div>
                  <div className="flex items-center gap-1.5 text-foreground font-medium">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" /> Full-Stack Build
                  </div>
                  <div className="flex items-center gap-1.5 text-foreground font-medium">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" /> Security Audit
                  </div>
                  <div className="flex items-center gap-1.5 text-foreground font-medium">
                    <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" /> Production Launch
                  </div>
                </div>
              </div>

              {/* Architecture Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <Code2 className="size-3.5" /> Source Code
                  </div>
                  <p className="text-xs font-semibold text-foreground">100% Owned by Client</p>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <HardDrive className="size-3.5" /> Hosting &amp; Edge
                  </div>
                  <p className="text-xs font-semibold text-foreground">Global CDN &bull; SSL Active</p>
                </div>
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <Activity className="size-3.5" /> Response Time
                  </div>
                  <p className="text-xs font-semibold text-foreground">42ms Edge TTFB</p>
                </div>
              </div>
            </div>

            {/* Quick Actions & Contact Sidebar (4 Cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-card border border-border/80 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold tracking-tight">Need Website Edits?</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Have content updates, new services, or calendar changes? Our engineering team responds within 24 hours.
                </p>
                <div className="space-y-2 pt-1">
                  <Link href="/contact" className="w-full block">
                    <Button variant="outline" size="sm" className="w-full font-medium rounded-lg text-xs">
                      Submit Update Request
                    </Button>
                  </Link>
                  <Link href="/pricing" className="w-full block">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground">
                      Review Care Plan ($99/mo)
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-foreground/5 border border-border/70 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-foreground">
                  <ShieldCheck className="size-4 text-emerald-500" /> Security Guarantee
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your code has been audited against OWASP Top 10 vulnerabilities, equipped with Strict-Transport-Security headers, and spam honeypot filters.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS */}
        {activeTab === "projects" && (
          <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Client Projects &amp; Archives</h2>
              <Link href="/start-project">
                <Button size="sm" className="gap-1.5 rounded-lg text-xs">
                  <Plus className="size-3.5" /> New Project Brief
                </Button>
              </Link>
            </div>
            <div className="divide-y divide-border/60">
              <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">24/7 Appointment Booking Platform</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                      Live
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    Plan: Secure Engine ($1,500) • Google Calendar Sync • Automated Email Receipts
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/projects">
                    <Button variant="outline" size="sm" className="text-xs rounded-lg">
                      View Live Site
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS & INQUIRIES */}
        {activeTab === "bookings" && (
          <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold">Recent Customer Bookings &amp; Inquiries</h2>
            <p className="text-xs text-muted-foreground">
              Syncs in real-time with Google Calendar, Square Appointments, and LevelUp Booking Engine.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Date &amp; Time</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  <tr>
                    <td className="py-3 font-semibold text-foreground">Marcus Vance</td>
                    <td className="py-3 text-muted-foreground">Consultation &amp; Discovery</td>
                    <td className="py-3 text-muted-foreground">Tomorrow, 10:00 AM</td>
                    <td className="py-3"><span className="text-emerald-500 font-semibold">Confirmed</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-foreground">Elena Rostova</td>
                    <td className="py-3 text-muted-foreground">Bespoke Design Review</td>
                    <td className="py-3 text-muted-foreground">Thursday, 2:30 PM</td>
                    <td className="py-3"><span className="text-emerald-500 font-semibold">Confirmed</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-foreground">David Chen</td>
                    <td className="py-3 text-muted-foreground">Security Audit Handover</td>
                    <td className="py-3 text-muted-foreground">Friday, 11:15 AM</td>
                    <td className="py-3"><span className="text-muted-foreground">Completed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & AUDITS */}
        {activeTab === "security" && (
          <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold">Cybersecurity &amp; Infrastructure Audit</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Every line of shipped code is verified against international cybersecurity benchmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border/70 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500" /> SSL / TLS Strict Encryption
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  256-bit automated encryption with HSTS preload to prevent man-in-the-middle attacks.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/70 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500" /> Anti-Spam Honeypots
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Bot filtering on all contact and booking forms without irritating CAPTCHAs for legitimate clients.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/70 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500" /> Database Rule Hardening
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Restricted read/write privileges with principle of least privilege (PoLP) on all user data.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/70 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="size-4 text-emerald-500" /> Core Web Vitals Hardening
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Zero render-blocking scripts, lightweight modern fonts, and sub-2-second load times worldwide.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
