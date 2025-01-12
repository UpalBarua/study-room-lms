import { Input } from "@/components/ui/input";
import { ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  value: File | null;
  id: string;
}

export function IconInput({ onChange, value, id }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (value) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="relative size-11">
      <Input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        id={id}
      />
      <label
        htmlFor={id}
        className="flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-300 transition-colors hover:border-gray-400"
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-contain object-center"
          />
        ) : (
          <ImageIcon className="h-6 w-6 text-gray-400" />
        )}
      </label>
    </div>
  );
}
