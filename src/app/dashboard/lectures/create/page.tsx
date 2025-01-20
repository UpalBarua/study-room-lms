import { fetchData } from "@/lib/utils";
import type { Subject, Chapter, Course } from "@/types";
import { LectureForm } from "../_components/lecture-form";

export default async function LectureCreatePage() {
  const [courses, subjects, chapters] = await Promise.all([
    fetchData<Course[]>("/admin/course"),
    fetchData<Subject[]>("/admin/subject"),
    fetchData<Chapter[]>("/admin/chapter"),
  ]);

  return (
    <section className="mt-8">
      <h1 className="pb-5 text-2xl font-semibold capitalize">Create Lecture</h1>
      <LectureForm courses={courses} subjects={subjects} chapters={chapters} />
    </section>
  );
}
