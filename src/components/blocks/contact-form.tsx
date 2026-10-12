"use client";

import { useRef } from "react";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Clock } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { serverAction } from "@/actions/server-action";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formSchema } from "@/lib/form-schema";

type Schema = z.infer<typeof formSchema>;

export function ContactForm() {
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      employees: "",
      message: "",
      agree: false,
    } as unknown as Schema,
  });

  // Anti-spam signals: when the form was displayed, and a honeypot field that
  // people never see (bots fill it in). Both are checked again on the server.
  const startedAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);

  const formAction = useAction(serverAction, {
    onSuccess: () => {
      form.reset();
      startedAt.current = Date.now();
    },
  });

  const handleSubmit = form.handleSubmit(async (data: Schema) => {
    formAction.execute({
      ...data,
      hp: honeypot.current?.value ?? "",
      startedAt: startedAt.current,
    });
  });

  const { isExecuting, hasSucceeded, hasErrored, result } = formAction;
  const errorMessage =
    typeof result.serverError === "string" && result.serverError
      ? result.serverError
      : "An error occurred while submitting your request. Please check your connection and try again.";
  const isWaitlisted = result.data?.isWaitlisted;

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="relative flex w-full flex-col gap-2 space-y-4 rounded-md"
      >
        {/* Honeypot: invisible to people, tempting to bots. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        >
          <label>
            Do not fill this field
            <input
              ref={honeypot}
              type="text"
              name="hp_url"
              tabIndex={-1}
              autoComplete="off"
              defaultValue=""
            />
          </label>
        </div>
        <FormField
          control={form.control}
          name="name"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Full name * </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                  }}
                  placeholder="First and last name"
                  disabled={isExecuting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email address * </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                  }}
                  placeholder="me@company.com"
                  disabled={isExecuting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          rules={{ required: false }}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Company name </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                  }}
                  placeholder="Company name"
                  disabled={isExecuting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          rules={{ required: false }}
          name="employees"
          render={({ field }) => {
            const options = [
              { value: "1", label: "1" },
              { value: "2-10", label: "2-10" },
              { value: "11-50", label: "11-50" },
              { value: "51-500", label: "51-500" },
            ];
            return (
              <FormItem className="w-full">
                <FormLabel>Number of employees </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isExecuting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="e.g. 11-50" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="message"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your message * </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Write your message"
                  className="resize-none"
                  disabled={isExecuting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          rules={{ required: true }}
          name="agree"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-1">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  required
                  disabled={isExecuting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" className="underline underline-offset-4" target="_blank">
                      Terms of Service
                    </Link>{" "}
                    and the{" "}
                    <Link href="/privacy" className="underline underline-offset-4" target="_blank">
                      Privacy Policy
                    </Link>
                  </span>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex w-full items-center justify-end pt-2">
          <Button className="rounded-lg font-semibold" size="sm" disabled={isExecuting}>
            {isExecuting ? "Submitting..." : "Submit request"}
          </Button>
        </div>

        {/* INLINE STATUS ALERT AT THE BOTTOM OF FORM */}
        {hasSucceeded && isWaitlisted && (
          <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-amber-500/25 bg-amber-500/10 p-3.5 text-xs text-amber-900 transition-all dark:text-amber-200/95">
            <Clock className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-800 dark:text-amber-300">Priority Waitlist Active</p>
              <p className="leading-relaxed">
                Immediate build capacity is currently full. Your request has been placed on our priority waitlist (estimated 3 to 5 business days turnaround). Our team will review your project details as soon as a development slot opens. A confirmation email has been sent to your inbox.
              </p>
            </div>
          </div>
        )}

        {hasSucceeded && !isWaitlisted && (
          <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-purple-500/25 bg-purple-500/10 p-3.5 text-xs text-purple-900 transition-all dark:text-purple-200/95">
            <Check className="mt-0.5 size-4 shrink-0 text-purple-700 dark:text-purple-400" />
            <div className="space-y-1">
              <p className="font-semibold text-purple-800 dark:text-purple-300">Preview Request Received</p>
              <p className="leading-relaxed">
                Thank you! Our team has received your submission. We will prepare your functional mobile preview within 24 to 48 hours. A confirmation email has been sent to your inbox.
              </p>
            </div>
          </div>
        )}

        {hasErrored && (
          <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span role="alert">{errorMessage}</span>
          </div>
        )}
      </form>
    </Form>
  );
}
