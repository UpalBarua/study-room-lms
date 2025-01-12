import { useEffect, useState } from "react";

import { getLevels } from "@/actions/level";
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
import { Level } from "@/types";
import { Control } from "react-hook-form";

type LevelSelectProps = {
  control: Control<CourseSchema>;
};

export function LevelSelect({ control }: Readonly<LevelSelectProps>) {
  const [levels, setLevels] = useState<Level[] | []>([]);

  useEffect(() => {
    (async () => {
      const levels = await getLevels();
      setLevels(levels?.data);
    })();
  }, []);

  return (
    <FormField
      control={control}
      name="level_id"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Level</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={`${field.value}`}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a level" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {levels.map(({ id, name, name_en }) => (
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
