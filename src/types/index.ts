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

type Chapter = {
  id: number;
  uuid: string;
  name: string;
  name_en: string;
  topics: unknown;
  level_id: number;
  class_id: number;
  subject_id: number;
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
