import { IconMovie, IconPhoto } from "@tabler/icons-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";

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
import type { CourseFormSchema } from "@/schemas/course";

type UploadThumbnailProps = {
  form: UseFormReturn<CourseFormSchema>;
};

export function UploadThumbnail({ form }: Readonly<UploadThumbnailProps>) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePreview = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const thumbnailType = useWatch({ name: "thumbnail.type" });

  useEffect(() => {
    const file = form.getValues("thumbnail.file");
    if (file) {
      handlePreview(file);
    }
  }, []);

  return (
    <FormField
      control={form.control}
      name="thumbnail.file"
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem>
          <FormLabel className="flex items-center justify-between">
            <div>
              Thumbnail <span className="text-lg text-destructive">*</span>
            </div>
            <FormField
              control={form.control}
              name="thumbnail.type"
              render={({ field }) => (
                <FormItem className="min-w-[6rem]">
                  <Select
                    onValueChange={(val) => {
                      setPreview(null);
                      field.onChange(val);
                    }}
                    defaultValue={`${field.value}`}
                  >
                    <FormControl>
                      <SelectTrigger className="h-auto">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent defaultValue={"image"}>
                      {["image", "video"].map((type) => (
                        <SelectItem key={type} value={type}>
                          <span className="capitalize">{type}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormLabel>
          <FormControl>
            <div className="relative rounded-lg border-2 border-dashed p-6">
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange(file);
                    handlePreview(file);
                  }
                }}
                accept={`${thumbnailType}/*`}
                className="absolute inset-0 cursor-pointer opacity-0"
                {...field}
                ref={fileInputRef}
              />
              {preview ? (
                <Fragment>
                  {thumbnailType === "image" && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-[10rem] w-full rounded-lg object-contain"
                    />
                  )}
                  {thumbnailType === "video" && (
                    <video
                      controls
                      className="max-h-[10rem] w-full rounded-lg object-contain"
                      autoPlay
                    >
                      <source src={preview} type="video/mp4" />
                    </video>
                  )}
                </Fragment>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  {thumbnailType === "image" && (
                    <IconPhoto className="mx-auto size-16 text-muted-foreground" />
                  )}
                  {thumbnailType === "video" && (
                    <IconMovie className="mx-auto size-16 text-muted-foreground" />
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag and drop an file here, or click to select a file
                  </p>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
