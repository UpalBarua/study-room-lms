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

const modulesSchema = z.array(
  z.object({
    title: z.string().nonempty("Module title cannot be empty"),
  }),
);

const pricingSchema = z.object({
  discount_type: z.enum(["fixed", "percentage"]).default("percentage"),
  course_fee: z.coerce.number(),
  discount: z.coerce.number(),
  is_discount: z.enum(["yes", "no"]).default("yes"),
});

const whatsInSchema = z.array(
  z.object({
    title: z.string().nonempty("What's In title cannot be empty"),
  }),
);

const liveCourseDataSchema = z.object({
  course_duration: z.any().transform((val) => val.length),
  batch_no: z.string().nonempty("Batch number cannot be empty"),
  batch_schedule: z.string().nonempty("Batch schedule cannot be empty"),
  seat_per_batch: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Seat per batch must be a positive number",
    }),
  enrollment_deadline: z.any().transform((val) => val + ""),
});

const howCourseLaidOutSchema = z.array(
  z.object({
    title: z.string().nonempty("Course layout title cannot be empty"),
    description: z.string().optional(),
    icon: z.instanceof(File).nullable(),
  }),
);

const courseCurriculumSchema = z.array(
  z.object({
    title: z.string().nonempty("Curriculum title cannot be empty"),
  }),
);

const courseDetailsSchema = z.array(
  z.object({
    title: z.string().nonempty("Course detail title cannot be empty"),
    description: z
      .string()
      .nonempty("Course detail description cannot be empty"),
  }),
);

const faqSchema = z.array(
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
  pricing: pricingSchema,
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
