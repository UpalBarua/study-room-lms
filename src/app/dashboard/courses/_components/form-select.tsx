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
import { Control, Path } from "react-hook-form";

type SelectableItem = {
  id: string | number;
  [key: string]: any;
};

type FormSelectProps<
  TFormValues extends Record<string, any>,
  TItem extends SelectableItem,
> = {
  control: Control<TFormValues>;
  name: Path<TFormValues>;
  placeholder?: string;
  label: string;
  items: TItem[];
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
  renderLabel?: (item: TItem) => string;
};

export function FormSelect<
  TFormValues extends Record<string, any>,
  TItem extends SelectableItem,
>({
  control,
  items,
  name,
  label,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  renderLabel = (item) => `${item.id}`,
}: Readonly<FormSelectProps<TFormValues, TItem>>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={`${field.value}`}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items?.map((item) => (
                <SelectItem
                  className="capitalize"
                  key={item.id}
                  value={`${item.id}`}
                >
                  {renderLabel(item)}
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
