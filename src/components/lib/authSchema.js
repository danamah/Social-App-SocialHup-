import * as z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty("Name is Required")
      .min(2, "Name must be at least 2 characters")
      .max(20, "Name must not exceed 10 characters"),
    email: z.email("Email is Required"),
    password: z
      .string()
      .nonempty("password is required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        "Password should be at least 6 characters",
      ),
    rePassword: z.string().nonempty("rePassword is required"),
    dateOfBirth: z
      .string()
      .nonempty("date Of Birth is required")
      .refine(
        (date) => {
          const currentYear = new Date().getFullYear();
          const birthYear = new Date(date).getFullYear();
          const age = currentYear - birthYear;
          return age > 18;
        },
        {
          error: "You must be more than 18 years to register",
        },
      ),
    gender: z
      .string()
      .nonempty("Gender is required")
      .transform((gender) => (gender == "m" ? "male" : "female")),
  })
  .refine(
    (data) => data.password == data.rePassword,
    { path: ["rePassword"] },
    { error: "password must be match" },
  );
