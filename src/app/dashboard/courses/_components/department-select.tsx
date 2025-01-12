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
import { CourseSchema } from "@/schemas/course";
import type { Department } from "@/types";
import { Control } from "react-hook-form";

type DepartmentSelectProps = {
  control: Control<CourseSchema>;
  departments: Department[];
};

export function DepartmentSelect({
  control,
  departments,
}: Readonly<DepartmentSelectProps>) {
  return (
    <FormField
      control={control}
      name="department_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Department</FormLabel>
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
              {departments?.map(({ id, name, name_en }) => (
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
