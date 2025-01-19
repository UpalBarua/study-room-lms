import { decodeJsonFields, fetchData } from "@/lib/utils";
import { api, access_token } from "@/data/api";
import type {
  Category,
  Class,
  Department,
  Instructor,
  Subcategory,
  Subject,
} from "@/types";
import { CourseForm } from "../_components/course-form";
import { CourseFormSchema } from "@/schemas/course";

async function getCourseDetails() {
  try {
    const formData = new FormData();
    formData.append(
      "slug",
      "শব্দ-গুলো-দেখে-সকলেই-অবাক-হয়েছে-এটা-বলা-বাহুল্যশব্দ-গুলো-শব্দ-গুলো-দেখে-সকলেই-অবাক-হয়েছে-এটা-বলা-বাহুল্যশব্দ-গুলো-দেখে-সকলেই",
    );

    const response = await fetch(`${api}/fetch/course`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: formData,
    });

    const json = await response.json();
    return json.data[0];
  } catch (error) {
    console.log(error);
    return { message: "Failed to fetch course details" };
  }
}

export default async function UpdateCoursePage() {
  const [
    departments,
    subjects,
    classes,
    categories,
    subcategories,
    instructors,
  ] = await Promise.all([
    fetchData<Department[]>("/admin/department"),
    fetchData<Class[]>("/admin/class"),
    fetchData<Subject[]>("/admin/subject"),
    fetchData<Category[]>("/admin/course/category"),
    fetchData<Subcategory[]>("/admin/course/subcategory"),
    fetchData<Instructor[]>("/admin/employee/instructor"),
  ]);

  const courseDetails = await getCourseDetails();
  const parsedCourseDetials = await decodeJsonFields(courseDetails);

  return (
    <section className="mt-6 rounded border bg-background px-6 py-4 shadow-md">
      <h1 className="font-meidum pb-2 text-xl">Create course</h1>
      <CourseForm
        departments={departments}
        classes={classes}
        subjects={subjects}
        categories={categories}
        subcategories={subcategories}
        instructors={instructors}
        courseDetails={parsedCourseDetials}
      />
    </section>
  );
}
