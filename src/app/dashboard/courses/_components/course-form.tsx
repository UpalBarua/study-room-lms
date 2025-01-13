"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { access_token, api } from "@/data/api";
import { cn } from "@/lib/utils";
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
import {
  IconCalendar,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { addDays, format } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { ClassSelect } from "./class-select";
import { DepartmentSelect } from "./department-select";
import { DynamicFields } from "./dynamic-fields";
import { LevelSelect } from "./level-select";
import { SubjectSelect } from "./subject-select";
import { UploadThumbnail } from "./upload-thumbnail";

const formSteps = [
  { value: "basic-details", label: "Basic Details" },
  { value: "category-and-subjects", label: "Category & Subjects" },
  { value: "pricing", label: "Pricing" },
  { value: "modules", label: "Modules" },
  { value: "course-content", label: "Content" },
  { value: "course-curriculum", label: "Curriculum" },
  { value: "course-details", label: "Details" },
  { value: "faq", label: "FAQ" },
] as const;

const appendToFormData = (formData: FormData, key: string, value: any) => {
  if (value instanceof File || value instanceof Blob) {
    formData.append(key, value);
  } else if (Array.isArray(value)) {
    value.forEach((item, index) => {
      appendToFormData(formData, `${key}[${index}]`, item);
    });
  } else if (typeof value === "object" && value !== null) {
    Object.entries(value).forEach(([nestedKey, nestedValue]) => {
      appendToFormData(formData, `${key}[${nestedKey}]`, nestedValue);
    });
  } else {
    formData.append(
      key,
      value === null || value === undefined ? "" : value.toString(),
    );
  }
};

const objectToFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) =>
    appendToFormData(formData, key, value),
  );
  return formData;
};

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

  async function onSubmit(values: CourseSchema) {
    const formattedValues = {
      ...values,
      live_course_data: {
        ...values.live_course_data,
        course_duration: `${values.live_course_data.course_duration?.from} to ${values.live_course_data.course_duration?.to}`,
      },
    };

    const formData = objectToFormData(formattedValues);

    const response = await fetch(`${api}/admin/course/store`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: formData,
    });

    const data = await response.json();
    console.log(data);
  }

  const courseType = form.watch("course_type");
  const selectedLevel = form.watch("level_id");
  const selectedCourseCategory = form.watch("course_category_id");
  const courseContentType = form.watch("content_type");
  const coursePurchaseType = form.watch("purchase_type");

  useEffect(() => {
    console.log(form.formState.errors);
  }, [form.formState.errors]);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  const [formStep, setFormStep] = useState(formSteps[0].value);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs
          defaultValue="basic-details"
          value={formStep}
          className="flex items-start gap-x-10"
          onValueChange={setFormStep}
        >
          <TabsList className="grid h-full w-max justify-start gap-y-3 bg-background">
            {formSteps.map(({ label, value }, i) => (
              <TabsTrigger
                className="justify-start gap-x-2.5 font-medium !shadow-none"
                key={value}
                value={value}
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md bg-secondary text-lg",
                    value === formStep && "bg-primary text-background",
                  )}
                >
                  {i + 1}
                </span>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex-1">
            <TabsContent
              className="grid grid-cols-2 gap-x-8 gap-y-4"
              value="basic-details"
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
                      <Input
                        placeholder="Enter course title in Bangla"
                        {...field}
                      />
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
                      <Input
                        placeholder="Enter course title in English"
                        {...field}
                      />
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
                    <FormLabel>Course Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-32"
                        placeholder="Write course description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent
              className="grid grid-cols-6 gap-x-8 gap-y-4"
              value="category-and-subjects"
            >
              <FormField
                control={form.control}
                name="course_type"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Course Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder="Select a course type" />
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
              <FormField
                control={form.control}
                name="course_category_id"
                render={({ field }) => (
                  <FormItem className="col-span-2">
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
              <FormField
                control={form.control}
                name="course_subcategory_id"
                render={({ field }) => (
                  <FormItem className="col-span-2">
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
                  <div className="col-span-2">
                    <LevelSelect control={form.control} />
                  </div>
                  <div className="col-span-2">
                    <ClassSelect
                      control={form.control}
                      classes={classes.filter(
                        ({ level_id }) => level_id === selectedLevel,
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <DepartmentSelect
                      departments={departments.filter(
                        ({ level_id }) => level_id === selectedLevel,
                      )}
                      control={form.control}
                    />
                  </div>
                </Fragment>
              )}
              <FormField
                control={form.control}
                name="instructor_id"
                render={({ field }) => (
                  <FormItem className="col-span-2">
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
                        {instructors?.map((instructor, i) => {
                          return (
                            <SelectItem
                              key={i}
                              className="capitalize"
                              value={instructor?.id}
                            >
                              {instructor?.id}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem className="col-span-4">
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
            </TabsContent>
            <TabsContent
              className="grid grid-cols-2 gap-x-8 gap-y-4"
              value="pricing"
            >
              <FormField
                control={form.control}
                name="purchase_type"
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
              {coursePurchaseType === "paid" && (
                <Fragment>
                  <FormField
                    control={form.control}
                    name="pricing.course_fee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Fees</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter course fees"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricing.discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter discount"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pricing.discount_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course discount type</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="capitalize">
                                <SelectValue placeholder="Select a course type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["fixed", "percentage"].map((type) => (
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Fragment>
              )}
            </TabsContent>
            <TabsContent value="modules">
              <DynamicFields
                control={form.control}
                name="modules"
                placeholder="Enter module title"
                label="Module"
              />
            </TabsContent>
            <TabsContent
              className="grid grid-cols-2 gap-x-8 gap-y-4"
              value="course-content"
            >
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
              {courseContentType === "live" && (
                <Fragment>
                  <FormField
                    control={form.control}
                    name="live_course_data.batch_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Batch No.</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter batch number"
                            type="number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="live_course_data.batch_schedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Schedule</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter schedule" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="live_course_data.seat_per_batch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Seat</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter course title in Bangla"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="live_course_data.enrollment_deadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Course Enrollment Deadline</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <IconCalendar className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="live_course_data.course_duration"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Course Duration</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="date"
                              variant={"outline"}
                              className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !date && "text-muted-foreground",
                              )}
                            >
                              <IconCalendar />
                              {date?.from ? (
                                date.to ? (
                                  <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(date.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={date?.from}
                              numberOfMonths={2}
                              selected={field.value}
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </Fragment>
              )}
            </TabsContent>
            <TabsContent value="course-curriculum">
              <DynamicFields
                control={form.control}
                name="course_curriculum"
                placeholder="Enter course curriculum"
                label="Course Curriculum"
              />
              <DynamicFields
                control={form.control}
                name="how_course_laid_out"
                placeholder="Enter how course laid out"
                label="How course laid out"
                hasIcon
                hasDescription
              />
            </TabsContent>
            <TabsContent value="course-content">
              <DynamicFields
                control={form.control}
                name="whats_in"
                placeholder="Enter whats in"
                label="Whats In"
                hasIcon
              />
            </TabsContent>
            <TabsContent value="course-details">
              <DynamicFields
                control={form.control}
                name="course_details"
                placeholder="Enter course details"
                label="Course Details"
                hasDescription
              />
            </TabsContent>
            <TabsContent value="faq">
              <DynamicFields
                control={form.control}
                name="faq"
                placeholder="Enter FAQ title"
                label="FAQ"
                hasDescription
              />
              <Button type="submit">Submit</Button>
            </TabsContent>
            <div className="flex items-center justify-end gap-x-2 pt-4">
              <Button variant="secondary">
                <IconChevronLeft />
                Previous
              </Button>
              <Button variant="secondary">
                Next <IconChevronRight />
              </Button>
            </div>
          </div>
        </Tabs>
      </form>
    </Form>
  );
}
