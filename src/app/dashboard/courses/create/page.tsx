import { fetchData } from "@/lib/utils";
import type {
  Category,
  Class,
  Department,
  Instructor,
  Subcategory,
  Subject,
  Level,
} from "@/types";
import { CourseForm } from "../_components/course-form";

export default async function CreateCoursePage() {
  const [
    departments,
    classes,
    subjects,
    categories,
    subcategories,
    instructors,
    levels,
  ] = await Promise.all([
    fetchData<Department[]>("/admin/department"),
    fetchData<Class[]>("/admin/class"),
    fetchData<Subject[]>("/admin/subject"),
    fetchData<Category[]>("/admin/course/category"),
    fetchData<Subcategory[]>("/admin/course/subcategory"),
    fetchData<Instructor[]>("/admin/employee/instructor"),
    fetchData<Level[]>("/admin/level"),
  ]);

  return (
    <section className="mt-8">
      <h1 className="pb-5 text-2xl font-semibold capitalize">Create course</h1>
      <CourseForm
        departments={departments}
        classes={classes}
        subjects={subjects}
        categories={categories}
        subcategories={subcategories}
        instructors={instructors}
        levels={levels}
      />
    </section>
  );
}
