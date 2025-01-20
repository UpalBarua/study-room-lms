import { IconMovie, IconNotes } from "@tabler/icons-react";
import axios from "axios";
import { Fragment, useState, useTransition } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { access_token, api } from "@/data/api";
import { LectureFormSchema } from "@/schemas/lecture";

type UploadVideoProps = {
  form: UseFormReturn<LectureFormSchema>;
  name: string;
  label: string;
};

export function UploadNote({ form, name, label }: Readonly<UploadVideoProps>) {
  const [isUploading, startTransition] = useTransition();
  const [uploadProgress, setUploadProgress] = useState(0);

  async function handleNotUpload(data: File) {
    const formData = new FormData();

    formData.append("file", data);
    formData.append("upload_dir", "course/lecture/note");

    const response = await axios.post(`${api}/upload-file`, formData, {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const precentage = Math.floor((loaded * 100) / total!);
        setUploadProgress(precentage);
      },
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${access_token}`,
      },
    });

    form.setValue(name, response.data.data);
    // setVideoUrl(response.data.data);
  }

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem>
          <FormLabel className="flex items-center justify-between">
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative rounded-lg border-2 border-dashed p-6">
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // onChange(file);
                    startTransition(() => handleNotUpload(file));
                  }
                }}
                accept="application/pdf"
                className="absolute inset-0 cursor-pointer opacity-0"
                {...field}
              />
              <div className="flex flex-col items-center justify-center">
                {isUploading ? (
                  <Fragment>
                    <p className="mb-5 text-sm text-muted-foreground">
                      Uploading Note. Please wait.
                    </p>
                    <Progress value={uploadProgress} />
                  </Fragment>
                ) : (
                  <Fragment>
                    <IconNotes className="mx-auto size-16 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag and drop an file here, or click to select a file
                    </p>
                  </Fragment>
                )}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
