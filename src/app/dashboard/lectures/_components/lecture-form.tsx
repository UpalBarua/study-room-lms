"use client";

import { LectureFormSchema, lectureFormSchema } from "@/schemas/lecture";
import type { Chapter, Course, Subject } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";
import { FormSelect } from "../../courses/_components/form-select";
import { UploadNote } from "./upload-note";
import { UploadVideo } from "./upload-video";

type InputObject = Record<string, { title: string }>;
type OutputObject = { id: string; name: string }[];

function transformToArray(input: InputObject): OutputObject {
  return Object.entries(input).map(([id, { title }]) => ({
    id,
    title,
  }));
}

const formSteps = [
  {
    label: "Basic Details",
    step: 1,
  },
  {
    label: "Course & Module",
    step: 2,
  },
  {
    label: "Content",
    step: 3,
  },
] as const;

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
  const [currentFormStep, setCurrentFormStep] = useState<number>(
    formSteps[0].step,
  );

  const [courseSubjects, setCourseSubjects] = useState<Array<Subject> | null>(
    null,
  );

  const [courseModules, setCourseModules] = useState(null);

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

  useEffect(() => {
    const selectedCourse = courses.find(
      ({ id }) => id.toLocaleString() === selectedCourseId,
    );

    if (selectedCourse) {
      const selectedCourseSubjectIds = JSON.parse(selectedCourse?.subjects);

      const selectedCourseModules = JSON.parse(selectedCourse?.modules);
      const selectedCourseModulesArray = transformToArray(
        selectedCourseModules,
      );

      const selectedCourseSubjects = subjects.filter(({ id }) =>
        selectedCourseSubjectIds.includes(id.toLocaleString()),
      );

      setCourseModules(selectedCourseModulesArray);
      setCourseSubjects(selectedCourseSubjects);
    }
  }, [selectedCourseId]);

  return (
    <div className="gap-6 rounded-2xl border bg-white/90 p-5 shadow">
      <div className="flex items-center gap-x-4 pb-8">
        {formSteps.map(({ label, step }) => (
          <button
            className={cn(
              "flex cursor-pointer items-center gap-x-3 rounded-lg px-3 py-2 text-start text-sm transition-colors duration-300 hover:bg-secondary",
              step === currentFormStep &&
              "bg-primary/20 shadow-sm hover:bg-primary/20",
            )}
            key={step}
            onClick={() => setCurrentFormStep(step)}
          >
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-md bg-secondary text-lg",
                step === currentFormStep && "bg-primary text-background",
              )}
            >
              {step}
            </span>
            <div className="flex flex-col">
              <span className="font-medium text-foreground">{label}</span>
              <span className="text-xs">Lorem, ipsum dolor.</span>
            </div>
          </button>
        ))}
        <div className="ms-auto space-x-2">
          <Button
            variant="secondary"
            disabled={currentFormStep <= 1}
            onClick={() => setCurrentFormStep((prev) => prev - 1)}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            disabled={currentFormStep >= formSteps.length}
            onClick={() => setCurrentFormStep((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-5"
        >
          {currentFormStep === 1 && (
            <Fragment>
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
                  <FormItem className="col-span-2">
                    <FormLabel>Lecture Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-[10rem] resize-none"
                        placeholder="Enter lecture description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Fragment>
          )}
          {currentFormStep === 2 && (
            <Fragment>
              <FormSelect
                control={form.control}
                name="course_id"
                items={courses}
                label="Course"
                renderLabel={(item) => `${item.title}`}
              />
              <FormSelect
                control={form.control}
                name="subject_id"
                items={courseSubjects}
                label="Subject"
                renderLabel={(item) => `${item.name} (${item.name_en})`}
              />
              <FormSelect
                control={form.control}
                name="chapter_id"
                items={chapters.filter(
                  ({ subject_id }) => subject_id === selectedSubjectId,
                )}
                label="Chapter"
                renderLabel={(item) => `${item.name} (${item.name_en})`}
              />
              <FormSelect
                control={form.control}
                name="module"
                items={courseModules}
                label="Module"
                renderLabel={(item) => `${item.title}`}
              />
            </Fragment>
          )}
          {currentFormStep === 3 && (
            <Fragment>
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
              <UploadNote
                form={form}
                label="Lecture Note (Bangla)"
                name="note_bn"
              />
              <UploadNote
                form={form}
                label="Lecture Note (English)"
                name="note_en"
              />
              <div className="col-span-2 flex justify-end gap-x-2 pt-4">
                <Button type="button" variant="secondary">
                  Clear
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </Fragment>
          )}
        </form>
      </Form>
    </div>
  );
}
