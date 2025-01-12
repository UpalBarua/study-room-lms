"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus } from "@tabler/icons-react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addSubjectAction } from "@/actions/subject-actions";
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
  FormDescription,
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
import { Level } from "@/types";

const subjectFormSchema = z.object({
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
  class_id: z.coerce
    .number()
    .int({ message: "Class ID must be an integer." })
    .positive({ message: "Class ID must be a positive number." }),
});

type SubjectFormSchema = z.infer<typeof subjectFormSchema>;

type AddSubjectProps = {
  levels: Level[];
};

export function AddSubject({ levels }: Readonly<AddSubjectProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const [classes, setClasses] = useState([]);

  const form = useForm<SubjectFormSchema>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      level_id: 0,
      name: "",
      name_en: "",
      class_id: 0,
    },
  });

  const selectedLevelId = form.watch("level_id");

  useEffect(() => {
    async function getClasses() {
      if (!selectedLevelId) return;

      const response = await fetch(`${api}/fetch/class`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level_id: selectedLevelId,
        }),
      });
      const json = await response.json();
      setClasses(json.data);
    }

    startTransition(() => getClasses());
  }, [selectedLevelId]);

  function onSubmit(data: SubjectFormSchema) {
    startTransition(async () => {
      const response = await addSubjectAction(data);
      console.log(response);

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
      <Button onClick={() => setIsOpen(true)}>
        <IconPlus />
        Add Subject
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subject</DialogTitle>
          <DialogDescription>
            Add new subject here. Click add when you're done.
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
                  <FormLabel>
                    Name <span className="text-lg text-destructive">*</span>
                  </FormLabel>
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
                  <FormLabel>
                    Name (English){" "}
                    <span className="text-lg text-destructive">*</span>
                  </FormLabel>
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
            <FormField
              control={form.control}
              name="class_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Class <span className="text-lg text-destructive">*</span>
                  </FormLabel>
                  <Select
                    disabled={!selectedLevelId}
                    onValueChange={field.onChange}
                    defaultValue={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes.map(({ name, id }) => (
                        <SelectItem key={id} value={id.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                  {!selectedLevelId && (
                    <FormDescription>Select a level first</FormDescription>
                  )}
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
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
