import z, { string } from "zod";

export const createPostSchema = z.object({
  title: z.string().optional(),
  text: z.string().optional(),
  link: z.string().optional(),
  photo: z.string().optional(),
  video: z.string().optional(),
});
