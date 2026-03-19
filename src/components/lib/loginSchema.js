import * as z from "zod";

export const loginSchema = z.object({
  email: z.email("email is required"),
  password: z
    .string()
    .nonempty("Password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
      "Password must be atleast 6 characters",
    ),
});
