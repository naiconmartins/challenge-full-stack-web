import z from "zod";

export const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).optional(),
  sort: z.string().optional(),
  sort_dir: z.string().optional(),
  filter: z.string().optional(),
});
