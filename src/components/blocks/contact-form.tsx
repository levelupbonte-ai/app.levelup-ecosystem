"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { motion } from "motion/react";
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
  const formAction = useAction(serverAction, {
    onSuccess: () => {
      // TODO: show success message
      form.reset();
    },
    onError: () => {
      // TODO: show error message
    },
  });
  const handleSubmit = form.handleSubmit(async (data: Schema) => {
    formAction.execute(data);
  });

  const { isExecuting, hasSucceeded, result } = formAction;
  const isWaitlisted = result.data?.isWaitlisted;
  const queuePosition = result.data?.queuePosition || 1;

  if (hasSucceeded) {
    return (
      <div className="w-full rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
          className="h-full space-y-4 text-center"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 500,
              damping: 15,
            }}
            className="mx-auto flex size-12 items-center justify-center rounded-xl border border-purple-500/40 bg-purple-500/10 text-purple-400"
          >
            <Check className="size-6" />
          </motion.div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              {isWaitlisted ? `Priority Queue Status (#${queuePosition})` : "Preview Track Confirmed"}
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {isWaitlisted ? "High Demand: Request Queued" : "We Received Your Request"}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
              {isWaitlisted
                ? `Immediate build capacity is currently filled (3 active client tracks). Your project is queued at position #${queuePosition}. Our team will review your requirements as soon as the next slot opens.`
                : "Our team has received your submission and is reviewing your project details. We will build and deliver your functional mobile preview within 24 to 48 hours."}
            </p>
          </div>

          <div className="pt-2">
            <p className="text-xs text-muted-foreground/80">
              A detailed confirmation has been sent to your email from{" "}
              <span className="font-mono text-foreground">contact@levelup-ecosystem.com</span>.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col gap-2 space-y-4 rounded-md"
      >
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
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(val);
                  }}
                  placeholder="me@company.com"
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
                <Select onValueChange={field.onChange} value={field.value}>
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
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I agree to the terms and conditions</FormLabel>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <div className="flex w-full items-center justify-end pt-3">
          <Button className="rounded-lg" size="sm">
            {isExecuting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
