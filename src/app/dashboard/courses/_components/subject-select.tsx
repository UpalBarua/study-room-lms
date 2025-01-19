"use client";

import type { Control } from "react-hook-form";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CourseFormSchema } from "@/schemas/course";
import { Subject } from "@/types";
import { IconX } from "@tabler/icons-react";

type SubjectSelectProps = {
  control: Control<CourseFormSchema>;
  subjects: Array<Subject>;
};

export function SubjectSelect({
  control,
  subjects,
}: Readonly<SubjectSelectProps>) {
  return (
    <FormField
      control={control}
      name="subjects"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Subjects</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <div className="flex min-h-11 w-full flex-wrap gap-2 rounded-md border border-input bg-transparent px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                  {field.value.map((subject) => (
                    <span
                      key={subject}
                      className="flex items-center gap-2 rounded-md bg-primary/25 px-3 py-2 text-sm text-primary"
                    >
                      {
                        subjects.find(({ name_en }) => name_en === subject)
                          ?.name
                      }{" "}
                      ({subject})
                      <button
                        type="button"
                        className="text-destructive hover:opacity-80"
                        onClick={(e) => {
                          e.stopPropagation();
                          field.onChange(
                            field.value.filter((val) => val !== subject),
                          );
                        }}
                      >
                        <IconX className="size-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full" side="bottom">
              <Command>
                <CommandInput placeholder="Search subject..." />
                <CommandList>
                  <CommandEmpty>No subjects found.</CommandEmpty>
                  <CommandGroup>
                    {subjects
                      .filter(({ name_en }) => !field.value.includes(name_en))
                      .map(({ id, name, name_en }) => (
                        <CommandItem
                          key={id}
                          value={`${name_en}`}
                          onSelect={(val) =>
                            field.onChange([...field.value, val])
                          }
                        >
                          {name}({name_en})
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
