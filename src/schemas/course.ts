import { z } from "zod";

import { descriptionSchema, imageFileSchema, titleSchema } from ".";

const thumbnailSchema = z
  .object({
    type: z.enum(["image", "video"]).default("image"),
    file: z.instanceof(File, { message: "Thumbnail must be a valid file" }),
  })
  .superRefine((data, ctx) => {
    const { type, file } = data;

    if (file && file.size > 10 * 1024 * 1024) {
      ctx.addIssue({
        code: "custom",
        path: ["file"],
        message: "File size must be less than or equal to 10 MB",
      });
    }

    if (type === "image" && file && !file.type.startsWith("image/")) {
      ctx.addIssue({
        code: "custom",
        path: ["file"],
        message: "File must be a valid image",
      });
    }

    if (type === "video" && file && !file.type.startsWith("video/")) {
      ctx.addIssue({
        code: "custom",
        path: ["file"],
        message: "File must be a valid video",
      });
    }
  });

const modulesSchema = z.array(
  z.object({
    title: titleSchema,
  }),
);

const whatsInSchema = z.array(
  z.object({
    title: titleSchema,
  }),
);

const courseCurriculumSchema = z.array(
  z.object({
    title: titleSchema,
  }),
);

const howCourseLaidOutSchema = z.array(
  z.object({
    title: titleSchema,
    description: descriptionSchema,
    icon: imageFileSchema,
  }),
);

const courseDetailsSchema = z.array(
  z.object({
    title: titleSchema,
    description: descriptionSchema,
  }),
);

const faqSchema = z.array(
  z.object({
    title: titleSchema,
    description: descriptionSchema,
  }),
);

export const liveCourseDataSchema = z
  .object({
    course_duration: z.object({
      from: z.date(),
      to: z.date(),
    }),
    batch_no: z.coerce.number().refine((val) => val > 0, {
      message: "Batch number must be a positive number",
    }),
    batch_schedule: z
      .string()
      .trim()
      .min(1, "Batch schedule cannot be empty")
      .max(255, "Batch schedule must be at most 255 characters")
      .regex(/\S/, "Batch schedule cannot be just whitespace"),
    seat_per_batch: z.coerce.number().refine((val) => val > 0, {
      message: "Seat per batch must be a positive number",
    }),
    enrollment_deadline: z.date(),
  })
  .superRefine((data, ctx: z.RefinementCtx) => {
    if (data.course_duration.from < new Date()) {
      ctx.addIssue({
        code: "custom",
        message: "Start date cannot be in the past",
        path: ["course_duration", "from"],
      });
    }
    if (data.course_duration.to < data.course_duration.from) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be after the start date",
        path: ["course_duration", "to"],
      });
    }
    if (data.enrollment_deadline < new Date()) {
      ctx.addIssue({
        code: "custom",
        message: "Enrollment deadline cannot be in the past",
        path: ["enrollment_deadline"],
      });
    }
  });

export const pricingSchema = z
  .object({
    discount_type: z.enum(["fixed", "percentage"]).default("percentage"),
    is_discount: z.enum(["yes", "no"]).default("yes"),
    course_fee: z.coerce
      .number()
      .refine((val) => val >= 0, {
        message: "Course fee must be a positive number",
      })
      .refine((val) => !isNaN(val), {
        message: "Course fee must be a valid number",
      }),
    discount: z.coerce
      .number()
      .refine((val) => val >= 0, {
        message: "Discount must be a positive number",
      })
      .refine((val) => !isNaN(val), {
        message: "Discount must be a valid number",
      }),
  })
  .superRefine((data, ctx) => {
    const { course_fee, discount } = data;
    if (discount > course_fee) {
      ctx.addIssue({
        code: "custom",
        path: ["discount"],
        message: "Discount cannot be greater than the course fee",
      });
    }
  });

export const courseFormSchema = z.object({
  thumbnail: thumbnailSchema,
  title: titleSchema,
  title_en: titleSchema,
  description: z
    .string()
    .trim()
    .min(1, "Description cannot be empty")
    .regex(/\S/, "Description cannot be just whitespace"),
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
  subjects: z.array(z.string()).nonempty("Subjects are required"),
  whats_in: whatsInSchema,
  live_course_data: liveCourseDataSchema,
  how_course_laid_out: howCourseLaidOutSchema,
  course_curriculum: courseCurriculumSchema,
  course_details: courseDetailsSchema,
  faq: faqSchema,
});

export type CourseFormSchema = z.infer<typeof courseFormSchema>;
