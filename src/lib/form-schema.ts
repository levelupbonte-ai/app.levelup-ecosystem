import * as z from "zod";

export interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: T;
}
export const formSchema = z.object({
  name: z.string({ message: "This field is required" }).trim().min(1).max(100),
  email: z
    .string({ message: "This field is required" })
    .trim()
    .toLowerCase()
    .max(150)
    .pipe(z.email({ message: "Please enter a valid email" })),
  company: z.string().trim().max(120).optional(),
  employees: z.string().min(1, "Please select an item").max(50).optional(),
  message: z.string({ message: "This field is required" }).trim().min(1).max(3000),
  agree: z.literal(true, { message: "This field is required" }),
});
