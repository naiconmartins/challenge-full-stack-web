import z from "zod";

export const createStudentBodySchema = z.object({
  ra: z.string({ error: "RA is required" }).trim().min(1, "RA is required"),
  name: z
    .string({ error: "Name is required" })
    .trim()
    .max(100, "Name must be at most 100 characters")
    .refine(value => value.split(/\s+/).length >= 2, {
      message: "Full name is required",
    })
    .transform(value =>
      value
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" "),
    ),
  email: z.email({ error: "Invalid email" }).trim(),
  cpf: z.string({ error: "CPF is required" }).trim().refine(isValidCpf, {
    message: "Invalid CPF",
  }),
});

function isValidCpf(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cpf[10]);
}
