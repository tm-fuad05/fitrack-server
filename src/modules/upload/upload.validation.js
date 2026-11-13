import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const REQUIRED_FILE_TYPE = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
];

export const fileSchema = z.object({
  file: z.object(
    {
      size: z.number().max(MAX_FILE_SIZE, { error: "Max file size is 5 MB" }),
      mimetype: z.enum(REQUIRED_FILE_TYPE, {
        error: "Only .jpg, .jpeg, .png and .webp formats are supported.",
      }),
    },
    { error: "Image is required" },
  ),
});
