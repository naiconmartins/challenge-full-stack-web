import z from "zod";

export const querySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  per_page: z.coerce.number().int().min(1).optional(),
  sort: z.enum(["name", "created_at"]).optional(),
  sort_dir: z.enum(["asc", "desc"]).optional(),
  filter: z.string().optional(),
});
