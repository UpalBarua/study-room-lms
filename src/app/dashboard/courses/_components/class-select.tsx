import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CourseFormSchema } from "@/schemas/course";
import type { Class } from "@/types";
import { Control } from "react-hook-form";

type ClassSelectProps = {
  control: Control<CourseFormSchema>;
  classes: Class[];
};

export function ClassSelect({ control, classes }: Readonly<ClassSelectProps>) {
  return (
    <FormField
      control={control}
      name="class_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Class</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={`${field.value}`}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a department" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {classes?.map(({ id, name, name_en }) => (
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
  );
}
