import { z } from "zod";

const thumbnailSchema = z
  .object({
    type: z.enum(["image", "video"]).default("image"),
    file: z.instanceof(File).nullable(),
  })
  .superRefine((data, ctx) => {
    const { type, file } = data;

    if (type === "image") {
      if (
        file &&
        !["image/png", "image/jpeg", "image/jpg"].includes(file.type)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["file"],
          message: "File must be a valid image (png, jpeg, jpg)",
        });
      }
    } else if (type === "video") {
      if (
        file &&
        !["video/mp4", "video/avi", "video/mkv"].includes(file.type)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["file"],
          message: "File must be a valid video (mp4, avi, mkv)",
        });
      }
    }
  });

const modulesSchema = z.record(
  z.string(),
  z.object({
    title: z.string().nonempty("Module title cannot be empty"),
  }),
);

const whatsInSchema = z.record(
  z.string(),
  z.object({
    title: z.string().nonempty("What's In title cannot be empty"),
  }),
);

const liveCourseDataSchema = z.object({
  course_duration: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2} to \d{4}-\d{2}-\d{2}$/,
      "Course duration must be in the format 'YYYY-MM-DD to YYYY-MM-DD'",
    ),
  batch_no: z.string().nonempty("Batch number cannot be empty"),
  batch_schedule: z.string().nonempty("Batch schedule cannot be empty"),
  seat_per_batch: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Seat per batch must be a positive number",
    }),
  enrollment_deadline: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Enrollment deadline must be in 'YYYY-MM-DD' format",
    ),
});

const howCourseLaidOutSchema = z.record(
  z.string(),
  z.object({
    title: z.string().nonempty("Course layout title cannot be empty"),
    description: z.string().optional(),
  }),
);

const courseCurriculumSchema = z.record(
  z.string(),
  z.object({
    title: z.string().nonempty("Curriculum title cannot be empty"),
  }),
);

const courseDetailsSchema = z.record(
  z.string(),
  z.object({
    title: z.string().nonempty("Course detail title cannot be empty"),
    description: z
      .string()
      .nonempty("Course detail description cannot be empty"),
  }),
);

const faqSchema = z.record(
  z.string(),
  z.object({
    title: z.string().nonempty("FAQ title cannot be empty"),
    description: z.string().nonempty("FAQ description cannot be empty"),
  }),
);

export const courseSchema = z.object({
  thumbnail: thumbnailSchema,
  title: z.string().nonempty("Title cannot be empty"),
  title_en: z.string().nonempty("English title cannot be empty"),
  description: z.string().nonempty("Description cannot be empty"),
  course_type: z.enum(["academic", "skill"]).default("academic"),
  course_category_id: z.coerce.number(),
  course_subcategory_id: z.coerce.number(),
  level_id: z.coerce.number(),
  class_id: z.coerce.number(),
  department_id: z.coerce.number(),
  instructor_id: z.coerce.number(),
  content_type: z.enum(["live", "recorded"]).default("live"),
  purchase_type: z.enum(["paid", "free"]).default("paid"),
  pricing: z.number().nullable(),
  modules: modulesSchema,
  subjects: z.array(z.number()),
  whats_in: whatsInSchema,
  live_course_data: liveCourseDataSchema,
  recorded_course_data: z.any().nullable(),
  how_course_laid_out: howCourseLaidOutSchema,
  course_curriculum: courseCurriculumSchema,
  course_details: courseDetailsSchema,
  faq: faqSchema,
});

export type CourseSchema = z.infer<typeof courseSchema>;
