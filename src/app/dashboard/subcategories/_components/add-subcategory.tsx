"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconUpload } from "@tabler/icons-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addSubcategoryAction } from "@/actions/subcategories-actions";
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

const subcategoryFormSchema = z.object({
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
  icon: z
    .instanceof(File)
    .refine(
      (file) =>
        [
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/svg+xml",
          "image/gif",
        ].includes(file.type),
      { message: "Invalid image file type" },
    )
    .refine((file) => file.size <= 100 * 1024, {
      message: "File size should not exceed 100 KB",
    }),
  course_category_id: z.coerce
    .number()
    .int({ message: "Category ID must be an integer." })
    .positive({ message: "Category ID must be a positive number." }),
});

type SubcategoryFormSchema = z.infer<typeof subcategoryFormSchema>;

export function AddSubcategories() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const [categories, setCategoris] = useState([]);

  const form = useForm<SubcategoryFormSchema>({
    resolver: zodResolver(subcategoryFormSchema),
    defaultValues: {
      name: "",
      name_en: "",
      icon: undefined,
    },
  });

  function onSubmit(data: SubcategoryFormSchema) {
    startTransition(async () => {
      const response = await addSubcategoryAction(data);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      form.reset();
      setIsOpen(false);
      toast.success(response.message);
    });
  }

  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      form.setValue("icon", e.dataTransfer.files[0]);
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    async function getCategories() {
      const response = await fetch(`${api}/admin/course/category`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const json = await response.json();
      setCategoris(json.data);
    }

    startTransition(() => getCategories());
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button onClick={() => setIsOpen(true)}>
        <IconPlus />
        Add Subcategory
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Subcategory</DialogTitle>
          <DialogDescription>
            Add new subcategory here. Click add when you're done.
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
              name="icon"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>
                    Icon <span className="text-lg text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <div
                      className="cursor-pointer rounded-md border-2 border-dashed p-6"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={handleClick}
                      tabIndex={0}
                      role="button"
                      aria-label="Upload image"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleClick();
                        }
                      }}
                    >
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                            handleFile(file);
                          }
                        }}
                        accept="image/*"
                        className="hidden"
                        aria-hidden="true"
                        {...field}
                        ref={fileInputRef}
                      />
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-h-[10rem] w-full rounded-lg object-contain"
                        />
                      ) : (
                        <div className="text-center text-secondary-foreground">
                          <IconUpload className="mx-auto size-12" />
                          <p className="mt-2 text-sm">
                            Drag and drop an image here, or click to select a
                            file
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="course_category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-lg text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value as string}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(({ name, id }) => (
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
