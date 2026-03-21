import z from "zod";

export const getStudentParamSchema = z.object({
  id: z.string({ error: "Id is required" }),
});
