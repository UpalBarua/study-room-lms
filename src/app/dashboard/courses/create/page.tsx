import { getClasses } from "@/actions/class-actions";
import { getDepartments } from "@/actions/department";
import { getSubjects } from "@/actions/subject-actions";
import { CourseForm } from "../_components/course-form";
import { getCategories } from "@/actions/categories-actions";
import { getSubcategories } from "@/actions/subcategories-actions";
import { getInstructors } from "@/actions/instructor";

export default async function CreateCoursePage() {
  const departments = await getDepartments();
  const classes = await getClasses();
  const subjects = await getSubjects();
  const categories = await getCategories();
  const subcategories = await getSubcategories();
  const instructors = await getInstructors();

  console.log(instructors);

  return (
    <section className="mt-6 rounded border bg-background px-6 py-4 shadow-md">
      <h1 className="font-meidum pb-2 text-xl">Create course</h1>
      <CourseForm
        departments={departments?.data}
        classes={classes}
        subjects={subjects}
        categories={categories}
        subcategories={subcategories}
        instructors={instructors}
      />
    </section>
  );
}
