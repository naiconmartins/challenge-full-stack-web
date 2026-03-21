import z from "zod";

export const deleteStudentParamSchema = z.object({
  id: z.uuid({ error: "Id must be a valid UUID" }),
});
