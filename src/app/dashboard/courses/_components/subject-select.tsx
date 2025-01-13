"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Subject } from "@/types";
import { X } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";

interface TagSelectProps {
  options: Subject[];
  value: Subject[];
  onChange: (value: Subject[]) => void;
  placeholder?: string;
}

export function SubjectSelect({
  options,
  value,
  onChange,
  placeholder = "Search or select tags...",
}: TagSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(
    (option) =>
      !value.some((v) => v === option) &&
      option.name_en.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = useCallback(
    (tag: Subject) => {
      onChange([...value, tag]);
      setSearch("");
      inputRef.current?.focus();
    },
    [onChange, value],
  );

  const handleRemove = useCallback(
    (tagToRemove: Subject) => {
      onChange(value.filter((tag) => tag !== tagToRemove));
    },
    [onChange, value],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !search && value.length > 0) {
        handleRemove(value[value.length - 1]);
      }
    },
    [handleRemove, search, value],
  );

  return (
    <div className="relative">
      <div
        className="flex min-h-[40px] cursor-text flex-wrap items-center gap-2 rounded-md border p-2"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag.id}
            className="flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground"
          >
            {options[tag].name} ({options[tag].name_en})
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto p-0 hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(tag);
              }}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag.name}</span>
            </Button>
          </span>
        ))}
        <Input
          ref={inputRef}
          type="text"
          className="flex-1 border-none px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder={value.length === 0 ? placeholder : ""}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {isOpen && (
        <ScrollArea className="absolute z-10 mt-1 max-h-[200px] w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant="ghost"
                className="w-full justify-start font-normal"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(option.id);
                }}
              >
                {option.name} ({option.name_en})
              </Button>
            ))
          ) : (
            <div className="p-2 text-sm text-muted-foreground">
              No matching tags found
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
}
