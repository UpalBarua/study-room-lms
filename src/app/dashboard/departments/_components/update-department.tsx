"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { updateDepartmentAction } from "@/actions/department-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Spinner } from "@/components/ui/spinner";
import { access_token, api } from "@/data/api";
import type { Class } from "@/types";

const departmentFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required." })
    .max(150, { message: "Name must not exceed 100 characters." }),
  name_en: z
    .string()
    .trim()
    .min(1, { message: "English name is required." })
    .max(150, { message: "English name must not exceed 100 characters." }),
  level_id: z.coerce
    .number()
    .int({ message: "Level ID must be an integer." })
    .positive({ message: "Level ID must be a positive number." }),
});

type DepartmentFormSchema = z.infer<typeof departmentFormSchema>;

type UpdateDepartmentProps = {
  currentDepartment: Class;
};

export function UpdateDepartment({
  currentDepartment: currentClass,
}: Readonly<UpdateDepartmentProps>) {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    async function getLevels() {
      const response = await fetch(`${api}/fetch/level`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      setLevels(json.data);
    }

    getLevels();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();

  const form = useForm<DepartmentFormSchema>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: {
      level_id: 0,
      name: "",
      name_en: "",
    },
  });

  useEffect(() => {
    form.reset(currentClass);
  }, [currentClass, form]);

  function onSubmit(data: DepartmentFormSchema) {
    startTransition(async () => {
      const response = await updateDepartmentAction({
        ...data,
        uuid: currentClass.uuid,
      });

      if (response.error) {
        toast.error(response.error);
        return;
      }

      form.reset();
      setIsOpen(false);
      toast.success(response.message);
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button size="icon" variant="outline" onClick={() => setIsOpen(true)}>
        <IconEdit />
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Deparment</DialogTitle>
          <DialogDescription>
            Update department here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            id="class-form"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name in bangla" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name (English)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name in english" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Level <span className="text-lg text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {levels.map(({ name, id }) => (
                        <SelectItem key={id} value={id.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" form="class-form">
            Save changes
          </Button>
        </DialogFooter>
        {isLoading && (
          <div className="absolute inset-0 z-[99] flex items-center justify-center rounded-[inherit] bg-background/50">
            <Spinner className="size-12" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
