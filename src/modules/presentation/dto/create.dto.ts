import z from "zod";

export const createPresentationSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  author: z.string(),
});

export type CreatePresentationDto = z.infer<typeof createPresentationSchema>;
