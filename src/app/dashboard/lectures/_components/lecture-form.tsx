"use client";

import { LectureFormSchema, lectureFormSchema } from "@/schemas/lecture";
import type { Chapter, Course, Subject } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSelect } from "../../courses/_components/form-select";
import { UploadVideo } from "./upload-video";
import { UploadNote } from "./upload-note";

const lectureType = [
  {
    id: "video",
    label: "Video",
  },
  {
    id: "note",
    label: "Note",
  },
  {
    id: "quiz",
    label: "Quiz",
  },
];

const lectureFormDefaultValues: LectureFormSchema = {
  title: "",
  description: "",
  lecture_type: "",
  chapter_id: "",
  subject_id: "",
  course_id: "",
  video_en: "",
  video_bn: "",
  note_bn: "",
  note_en: "",
};

type LectureFormProps = {
  courses: Array<Course>;
  subjects: Array<Subject>;
  chapters: Array<Chapter>;
};

export function LectureForm({
  subjects,
  chapters,
  courses,
}: Readonly<LectureFormProps>) {
  const form = useForm<LectureFormSchema>({
    resolver: zodResolver(lectureFormSchema),
    defaultValues: lectureFormDefaultValues,
  });

  const [selectedCourseId, selectedSubjectId] = useWatch({
    control: form.control,
    name: ["course_id", "subject_id"],
  });

  function onSubmit(values: LectureFormSchema) {
    console.log(values);
  }

  const selectedCourseSubjects = courses.find(
    ({ id }) => id.toLocaleString() === selectedCourseId,
  )?.subjects;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-6 rounded-2xl border bg-white/90 p-5 shadow"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Lecture Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter lecture title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-start-1 row-span-2">
              <FormLabel>Lecture Description</FormLabel>
              <FormControl>
                <Textarea
                  className="h-full"
                  placeholder="Enter lecture description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSelect
          control={form.control}
          name="course_id"
          items={courses}
          label="Course"
          renderLabel={(item) => `${item.title}`}
          className="col-start-2"
        />
        <FormSelect
          control={form.control}
          name="subject_id"
          items={subjects.filter(({ id }) =>
            selectedCourseSubjects?.includes(id.toLocaleString()),
          )}
          label="Subject"
          renderLabel={(item) => `${item.name} (${item.name_en})`}
          className="col-start-2"
        />
        <FormSelect
          control={form.control}
          name="chapter_id"
          items={chapters.filter(
            ({ subject_id }) => subject_id === selectedSubjectId,
          )}
          label="Chapter"
          renderLabel={(item) => `${item.name} (${item.name_en})`}
          className="col-start-2"
        />
        <UploadVideo
          form={form}
          label="Lecture Video (Bangla)"
          name="video_bn"
        />
        <UploadVideo
          form={form}
          label="Lecture Video (English)"
          name="video_en"
        />
        <UploadNote form={form} label="Lecture Note (Bangla)" name="note_bn" />
        <UploadNote form={form} label="Lecture Note (English)" name="note_en" />
        <div className="col-span-2 flex justify-end gap-x-2 pt-4">
          <Button type="clear" variant="secondary">
            Clear
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
