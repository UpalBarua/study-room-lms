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
import { cn, generateUniqueKey, objectToFormData } from "@/lib/utils";
import { courseFormSchema, type CourseFormSchema } from "@/schemas/course";
import type {
  Category,
  Class,
  Department,
  Instructor,
  Level,
  Subcategory,
  Subject,
} from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendar } from "@tabler/icons-react";
import { format } from "date-fns";
import { Fragment, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { DynamicFields } from "./dynamic-fields";
import { FormSelect } from "./form-select";
import { SubjectSelect } from "./subject-select";
import { UploadThumbnail } from "./upload-thumbnail";

const courseFormSteps = [
  {
    value: "basic-details",
    label: "Basic Details",
    description: "Course title and instructor.",
  },
  {
    value: "category-and-subjects",
    label: "Category & Subjects",
    description: "Category and subjects.",
  },
  { value: "pricing", label: "Pricing", description: "Course price." },
  { value: "modules", label: "Modules", description: "Course modules." },
  {
    value: "course-content",
    label: "Content",
    description: "Upload materials.",
  },
  {
    value: "course-curriculum",
    label: "Curriculum",
    description: "Topics and lessons.",
  },
  {
    value: "course-details",
    label: "Details",
    description: "Prerequisites and outcomes.",
  },
  { value: "faq", label: "FAQ", description: "Common questions." },
] as const;

type CourseFormSteps = (typeof courseFormSteps)[number]["value"];

const courseFormDefaultValues: CourseFormSchema = {
  thumbnail: {
    type: "image",
    file: null,
  },
  title: "",
  title_en: "",
  description: "",
  course_type: "academic",
  course_category_id: "",
  course_subcategory_id: NaN,
  level_id: NaN,
  class_id: NaN,
  department_id: NaN,
  instructor_id: NaN,
  content_type: "live",
  purchase_type: "paid",
  pricing: {
    discount_type: "percentage",
    is_discount: "yes",
    course_fee: NaN,
    discount: NaN,
  },
  modules: [{ title: "" }],
  subjects: [""],
  whats_in: [{ title: "" }],
  live_course_data: {
    batch_no: NaN,
    batch_schedule: "",
    course_duration: {
      from: undefined,
      to: undefined,
    },
    enrollment_deadline: new Date(),
    seat_per_batch: NaN,
  },
  how_course_laid_out: [
    {
      title: "",
      description: "",
      icon: new File([], "empty.jpg", { type: "image/jpeg" }),
    },
  ],
  course_curriculum: [{ title: "" }],
  course_details: [{ title: "", description: "" }],
  faq: [{ title: "", description: "" }],
};

type CourseFormProps = {
  departments: Array<Department>;
  classes: Array<Class>;
  subjects: Array<Subject>;
  categories: Array<Category>;
  subcategories: Array<Subcategory>;
  instructors: Array<Instructor>;
  levels: Array<Level>;
  courseDetails?: CourseFormProps;
};

export function CourseForm({
  departments,
  classes,
  subjects,
  categories,
  subcategories,
  instructors,
  levels,
  courseDetails,
}: Readonly<CourseFormProps>) {
  const form = useForm<CourseFormSchema>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: courseFormDefaultValues,
  });

  async function onSubmit(values: CourseFormSchema) {
    const { instructor_id, ...formattedValues } = {
      ...values,
      instructors: [values.instructor_id],
      live_course_data: {
        ...values.live_course_data,
        course_duration: `${format(values.live_course_data.course_duration?.from, "yyyy-mm-dd")} to ${format(values.live_course_data.course_duration?.to, "yyyy-mm-dd")}`,
        enrollment_deadline: format(
          values.live_course_data.enrollment_deadline,
          "yyyy-mm-dd",
        ),
      },
      modules: Object.fromEntries(
        values.modules.map((item) => [generateUniqueKey(), { ...item }]),
      ),
      whats_in: Object.fromEntries(
        values.whats_in.map((item) => [generateUniqueKey(), { ...item }]),
      ),
      how_course_laid_out: Object.fromEntries(
        values.how_course_laid_out.map((item) => [
          generateUniqueKey(),
          { ...item },
        ]),
      ),
      course_curriculum: Object.fromEntries(
        values.course_curriculum.map((item) => [
          generateUniqueKey(),
          { ...item },
        ]),
      ),
      course_details: Object.fromEntries(
        values.course_details.map((item) => [generateUniqueKey(), { ...item }]),
      ),
      faq: Object.fromEntries(
        values.faq.map((item) => [generateUniqueKey(), { ...item }]),
      ),
      subjects: values.subjects.map(
        (subject) => subjects.find(({ name_en }) => name_en === subject)?.id,
      ),
    };

    console.log(formattedValues);

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

  const [
    courseType,
    selectedLevel,
    selectedCourseCategory,
    courseContentType,
    coursePurchaseType,
  ] = useWatch({
    control: form.control,
    name: [
      "course_type",
      "level_id",
      "course_category_id",
      "content_type",
      "purchase_type",
    ],
  });

  console.log(form.formState.errors);

  useEffect(() => {
    form.reset({ ...courseDetails });
  }, [courseDetails]);

  const [formStep, setFormStep] = useState<CourseFormSteps>(
    courseFormSteps[0].value,
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-2xl border bg-white/90 p-5 shadow"
      >
        <Tabs
          className="flex items-start gap-x-10"
          defaultValue={courseFormSteps[0].value}
          value={formStep}
          onValueChange={(val) => setFormStep(val as CourseFormSteps)}
        >
          <TabsList className="grid h-full w-max justify-start gap-y-2 bg-background">
            {courseFormSteps.map(({ label, value, description }, i) => (
              <TabsTrigger
                className="group items-center justify-start gap-x-3 rounded-lg py-2 text-start transition-colors duration-300 hover:bg-secondary data-[state=active]:bg-primary/20 data-[state=active]:shadow-sm"
                key={value}
                value={value}
              >
                <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-lg group-data-[state=active]:bg-primary group-data-[state=active]:text-background">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-xs">{description}</p>
                </div>
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
              <FormSelect
                control={form.control}
                name="course_category_id"
                items={categories}
                label="Course Category"
                className="col-span-2"
                renderLabel={(item) => `${item.name} (${item.name_en})`}
              />
              <FormSelect
                control={form.control}
                name="course_subcategory_id"
                items={subcategories}
                label="Course Subcategory"
                className="col-span-2"
                disabled={!selectedCourseCategory}
                placeholder={
                  !selectedCourseCategory
                    ? "Select a course category first"
                    : ""
                }
                renderLabel={(item) => `${item.name} (${item.name_en})`}
              />
              {courseType === "academic" && (
                <Fragment>
                  <FormSelect
                    control={form.control}
                    name="level_id"
                    items={levels}
                    label="Course Level"
                    className="col-span-2"
                    renderLabel={(item) => `${item.name} (${item.name_en})`}
                  />
                  <FormSelect
                    control={form.control}
                    name="class_id"
                    items={classes.filter(
                      ({ level_id }) => level_id === selectedLevel,
                    )}
                    label="Class"
                    className="col-span-2"
                    disabled={!selectedLevel}
                    renderLabel={(item) => `${item.name} (${item.name_en})`}
                  />
                  <FormSelect
                    control={form.control}
                    name="department_id"
                    items={departments.filter(
                      ({ level_id }) => level_id === selectedLevel,
                    )}
                    label="Department"
                    className="col-span-2"
                    disabled={!selectedLevel}
                    renderLabel={(item) => `${item.name} (${item.name_en})`}
                  />
                </Fragment>
              )}
              <FormField
                control={form.control}
                name="instructor_id"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Instructors</FormLabel>
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
                              value={`${instructor?.id}`}
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
              <div className="col-span-4">
                <SubjectSelect control={form.control} subjects={subjects} />
              </div>
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
                              disabled={{ before: new Date() }}
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
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <IconCalendar />
                              {field.value?.from ? (
                                field.value.to ? (
                                  <>
                                    {format(field.value.from, "LLL dd, y")} -{" "}
                                    {format(field.value.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(field.value.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="range"
                              numberOfMonths={1}
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={{ before: new Date() }}
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
            {/* <div className="flex items-center justify-end gap-x-2 pt-4"> */}
            {/*   <Button variant="secondary"> */}
            {/*     <IconChevronLeft /> */}
            {/*     Previous */}
            {/*   </Button> */}
            {/*   <Button variant="secondary"> */}
            {/*     Next <IconChevronRight /> */}
            {/*   </Button> */}
            {/* </div> */}
          </div>
        </Tabs>
      </form>
    </Form>
  );
}
