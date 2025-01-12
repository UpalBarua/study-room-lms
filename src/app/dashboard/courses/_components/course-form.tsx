"use client";

import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { courseSchema, type CourseSchema } from "@/schemas/course";
import type {
  Category,
  Class,
  Department,
  Instructor,
  Subcategory,
  Subject,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClassSelect } from "./class-select";
import { DepartmentSelect } from "./department-select";
import { DynamicFields } from "./dynamic-fields";
import { LevelSelect } from "./level-select";
import { SubjectSelect } from "./subject-select";
import { UploadThumbnail } from "./upload-thumbnail";

type CourseFormProps = {
  departments: Department[];
  classes: Class[];
  subjects: Subject[];
  categories: Category[];
  subcategories: Subcategory[];
  instructors: Instructor[];
};

export function CourseForm({
  departments,
  classes,
  subjects,
  categories,
  subcategories,
  instructors,
}: CourseFormProps) {
  const form = useForm<CourseSchema>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      thumbnail: {
        type: "image",
      },
      subjects: [],
      modules: [{ title: "" }],
      whats_in: [{ title: "" }],
      course_details: [{ title: "" }],
      course_layout: [{ title: "" }],
      course_curriculum: [{ title: "" }],
      faq: [{ title: "" }],
    },
  });

  function onSubmit(values: CourseSchema) {
    console.log(values);
  }

  const courseType = form.watch("course_type");
  const selectedLevel = form.watch("level_id");
  const selectedCourseCategory = form.watch("course_category_id");

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-x-8 gap-y-4"
      >
        <div className="row-span-2">
          <UploadThumbnail form={form} />
        </div>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter course title in Bangla" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title_en"
          render={({ field }) => (
            <FormItem className="col-start-2">
              <FormLabel>Course Title (English)</FormLabel>
              <FormControl>
                <Input placeholder="Enter course title in English" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="course_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select a course type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["academic", "skill"].map((type) => (
                    <SelectItem className="capitalize" key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="course_category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={`${field.value}`}
              >
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select a course category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(({ name, name_en, id }) => (
                    <SelectItem className="capitalize" key={id} value={`${id}`}>
                      {name} ({name_en})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="course_subcategory_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Subcategory</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={`${field.value}`}
              >
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select a course subcategory" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subcategories
                    .filter(
                      ({ course_category_id }) =>
                        course_category_id === selectedCourseCategory,
                    )
                    .map(({ name, name_en, id }) => (
                      <SelectItem
                        className="capitalize"
                        key={id}
                        value={`${id}`}
                      >
                        {name} ({name_en})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {courseType === "academic" && (
          <Fragment>
            <DepartmentSelect
              departments={departments.filter(
                ({ level_id }) => level_id === selectedLevel,
              )}
              control={form.control}
            />
            <LevelSelect control={form.control} />
            <ClassSelect
              control={form.control}
              classes={classes.filter(
                ({ level_id }) => level_id === selectedLevel,
              )}
            />
            <FormField
              control={form.control}
              name="class_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={`${field.value}`}
                  >
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["academic", "skill"].map((type) => (
                        <SelectItem
                          className="capitalize"
                          key={type}
                          value={type}
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Fragment>
        )}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Write course description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DynamicFields
          control={form.control}
          name="modules"
          placeholder="Enter module title"
          label="Module"
        />
        <DynamicFields
          control={form.control}
          name="whats_in"
          placeholder="Enter whats in"
          label="Whats In"
          hasIcon
        />
        <DynamicFields
          control={form.control}
          name="course_details"
          placeholder="Enter course details"
          label="Course Details"
          hasDescription
        />
        <DynamicFields
          control={form.control}
          name="how_course_laid_out"
          placeholder="Enter how course laid out"
          label="How course laid out"
          hasIcon
          hasDescription
        />
        <DynamicFields
          control={form.control}
          name="course_curriculum"
          placeholder="Enter course curriculum"
          label="Course Curriculum"
        />
        <DynamicFields
          control={form.control}
          name="faq"
          placeholder="Enter FAQ title"
          label="FAQ"
        />
        <FormField
          control={form.control}
          name="subjects"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subjects</FormLabel>
              <FormControl>
                <SubjectSelect
                  options={subjects}
                  placeholder="Search or select technologies..."
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={`${field.value}`}
              >
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["live", "recorded"].map((type) => (
                    <SelectItem className="capitalize" key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={`${field.value}`}
              >
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select purchase type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {["free", "paid"].map((type) => (
                    <SelectItem className="capitalize" key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instructor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructor</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={`${field.value}`}
              >
                <FormControl>
                  <SelectTrigger className="capitalize">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {instructors?.map((instructor) => {
                    return (
                      <SelectItem
                        className="capitalize"
                        key={instructor?.user?.name}
                        value={instructor?.user?.name}
                      >
                        {instructor?.user?.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
