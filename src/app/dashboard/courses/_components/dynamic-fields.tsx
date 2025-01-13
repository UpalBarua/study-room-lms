"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { Control, useFieldArray } from "react-hook-form";
import { IconInput } from "./icon-input";
import type { CourseSchema } from "@/schemas/course";

type DynamicFieldsProps = {
  name: keyof CourseSchema;
  control: Control<CourseSchema>;
  label?: string;
  placeholder?: string;
  hasIcon?: boolean;
  hasDescription?: boolean;
};

export function DynamicFields({
  name,
  control,
  label = "Field",
  placeholder = "Enter value",
  hasIcon,
  hasDescription,
}: DynamicFieldsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium">{label}</label>}
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2 pb-4">
          <div className="flex items-center space-x-2">
            {hasIcon && (
              <FormField
                name={`${name}.${index}.icon`}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <IconInput
                    onChange={onChange}
                    value={value}
                    id={`icon-${name}-${index}`}
                  />
                )}
              />
            )}
            <FormField
              control={control}
              name={`${name}.${index}.title`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input placeholder={placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(index)}
              className="size-11 flex-shrink-0"
              aria-label={`Remove ${label}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {hasDescription && (
            <FormField
              control={control}
              name={`${name}.${index}.description`}
              render={({ field }) => (
                <FormItem className="">
                  <FormControl>
                    <Textarea placeholder={placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      ))}
      <div className="flex justify-end pt-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => append({ value: "" })}
        >
          <Plus />
          Add More
        </Button>
      </div>
    </div>
  );
}
