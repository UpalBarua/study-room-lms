import { z } from "zod";

export const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.type.startsWith("image/"), {
    message: "File must be a valid image",
  })
  .refine((file) => file.size <= 100 * 1024, {
    message: "File size must be less than or equal to 100 KB",
  });

const videoFileSchema = z
  .instanceof(File)
  .refine((file) => file.type.startsWith("video/"), {
    message: "File must be a valid video",
  })
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "Video file size must be less than or equal to 10 MB",
  });

export const titleSchema = z
  .string()
  .trim()
  .min(1, "Title cannot be empty")
  .max(255, "Title must be at most 255 characters")
  .regex(/\S/, "Title cannot be just whitespace");

export const descriptionSchema = z
  .string()
  .trim()
  .min(1, "Description cannot be empty")
  .max(1000, "Description must be at most 1000 characters")
  .regex(/\S/, "Description cannot be just whitespace");
