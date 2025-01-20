import * as z from "zod";

import { titleSchema } from ".";

const videoFile = z
  .instanceof(File)
  .refine((file) => file.size <= 1024 * 1024 * 1024, {
    message: "File size must be less than or equal to 1GB",
  })
  .refine(
    (file) => ["video/mp4", "video/mkv", "video/webm"].includes(file.type),
    {
      message: "Invalid file type. Only MP4, MKV, and WebM videos are allowed",
    },
  );

export const lectureFormSchema = z.object({
  title: titleSchema,
  description: z
    .string()
    .trim()
    .min(1, "Description cannot be empty")
    .regex(/\S/, "Description cannot be just whitespace"),
  lecture_type: z.union([
    z.enum(["video", "note", "quiz"]),
    z
      .literal("")
      .refine(() => false, { message: "Please select a lecture type" }),
  ]),
  subject_id: z
    .string()
    .nonempty("Subject ID is required")
    .regex(/^\d+$/, "Subject ID must be a numeric string"),
  chapter_id: z
    .string()
    .nonempty("Chapter ID is required")
    .regex(/^\d+$/, "Chapter ID must be a numeric string"),
  course_id: z
    .string()
    .nonempty("Course ID is required")
    .regex(/^\d+$/, "Course ID must be a numeric string"),
  video_bn: z.string().nonempty(),
  video_en: z.string().nonempty(),
  note_bn: z.string().nonempty(),
  note_en: z.string().nonempty(),
});

export type LectureFormSchema = z.infer<typeof lectureFormSchema>;
