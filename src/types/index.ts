export type Level = {
  id: number;
  uuid: string;
  name: string;
  name_en: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
};

export type Class = {
  id: number;
  uuid: string;
  name: string;
  name_en: string;
  level_id: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  level: Level;
  subjects: Subject[];
  courses: unknown[];
};

export type Department = {
  id: number;
  uuid: string;
  name: string;
  name_en: string;
  level_id: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  level: Level;
  subjects: unknown[];
  courses: unknown[];
};

export type Subject = {
  id: number;
  uuid: string;
  name: string;
  name_en: string;
  level_id: number;
  class_id: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  level: Level;
  class: Class;
  chapters: Chapter[];
  lectures: unknown[];
};

export type Chapter = {
  id: number;
  uuid: string;
  name: string;
  name_en: string;
  topics: unknown;
  level_id: number;
  class_id: number;
  subject_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  level: Level;
  class: Class;
  subject: Subject;
  lectures: unknown[];
};

export type Category = {
  id: number;
  uuid: string;
  name: string;
  name_en: string;
  icon: string | File | undefined;
  status: string;
  created_at: string;
  updated_at: string;
  course_subcategories: Subcategory[];
  courses: unknown[];
};

export type Subcategory = {
  id: number;
  uuid: string;
  name: string;
  name_en: string;
  icon: string | File | undefined;
  course_category_id: number;
  status: string;
  course_category: Category;
};

export type Instructor = {
  id: number;
  uuid: string;
  user_id: string;
  experiences: Record<string, string>;
  skills: Record<string, string>;
  status: "approved" | "pending" | "rejected";
  created_at: string;
  updated_at: string;
};

export type Course = {
  id: number;
  uuid: string;
  slug: string;
  title: string;
  title_en: string;
  description: string;
  course_category_id: string;
  course_subcategory_id: string;
  level_id: string;
  class_id: string;
  department_id: string;
  uploaded_by: string;
  course_type: string;
  content_type: string;
  purchase_type: string;
  pricing: {
    course_fee: string;
    is_discount: string;
    discount_type: string;
    discount: string;
  };
  modules: Record<string, { title: string }>;
  instructors: string[];
  subjects: string[];
  thumbnail: {
    type: string | null;
    file: string | null;
  };
  whats_in: Record<string, { title: string }>;
  live_course_data: {
    course_duration: string;
    batch_no: string;
    batch_schedule: string;
    seat_per_batch: string;
    enrollment_deadline: string;
  } | null;
  recorded_course_data: null;
  how_course_laid_out: Record<string, { title: string; description: string }>;
  course_curriculum: Record<string, { title: string }>;
  course_details: Record<string, { title: string; description: string }>;
  faq: Record<string, { title: string; description: string }>;
  status: string;
  created_at: string;
  updated_at: string;
  uploader: {
    id: number;
    uuid: string;
    reg_id: string;
    employee_id: string;
    name: string;
    email: string;
    phone: string | null;
    photo: string | null;
    is_approved: string;
  };
  course_category: {
    id: number;
    uuid: string;
    name: string;
    name_en: string;
    status: string;
  };
  course_subcategory: {
    id: number;
    uuid: string;
    name: string;
    name_en: string;
    course_category_id: string;
    status: string;
  };
  level: {
    id: number;
    uuid: string;
    name: string;
    name_en: string;
    status: string;
  };
  class: {
    id: number;
    uuid: string;
    name: string;
    name_en: string;
    level_id: string;
    status: string;
  };
  lectures: {
    id: number;
    uuid: string;
    title: string;
    course_id: string;
    subject_id: string;
    chapter_id: string;
    uploaded_by: string;
    lecture_type: string;
    module: {
      uuid: string;
      title: string;
    };
    status: string;
  }[];
};
