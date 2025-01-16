import { z } from "zod";

export const updateTitleSchema = z.object({
  title: z.string(),
});

export type UpdateTitleDto = z.infer<typeof updateTitleSchema>;
