import z from "zod";

export const getStudentParamSchema = z.object({
  id: z.uuid({ error: "Id must be a valid UUID" }),
});
