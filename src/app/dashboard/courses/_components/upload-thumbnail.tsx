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
import { IconMovie, IconPhoto } from "@tabler/icons-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";

type UploadThumbnailProps = {
  form: UseFormReturn;
};

export function UploadThumbnail({ form }: Readonly<UploadThumbnailProps>) {
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

  const thumbnailType = form.watch("thumbnail.type");

  useEffect(() => {
    setPreview(null);
  }, [thumbnailType]);

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
                    onValueChange={field.onChange}
                    defaultValue={`${field.value}`}
                  >
                    <FormControl>
                      <SelectTrigger>
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
            <div
              className="cursor-pointer rounded-md border-2 border-dashed p-6"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleClick}
              tabIndex={0}
              role="button"
              aria-label="Upload thumbnail"
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
                accept={`${thumbnailType}/*`}
                className="hidden"
                aria-hidden="true"
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
                <div className="text-center text-secondary-foreground">
                  {thumbnailType === "image" && (
                    <IconPhoto className="mx-auto size-16" />
                  )}
                  {thumbnailType === "video" && (
                    <IconMovie className="mx-auto size-16" />
                  )}
                  <p className="mt-2 text-sm">
                    Drag and drop an image here, or click to select a file
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
