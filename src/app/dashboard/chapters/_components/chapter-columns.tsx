"use client";

import type { Chapter } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteSubject } from "./delete-subject";
import { UpdateSubject } from "./update-subject";

export const chapterColumns: ColumnDef<Chapter>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "name_en",
    header: "Name (English)",
  },
  {
    accessorKey: "level_id",
    header: "Level",
    cell: ({ row }) => row.original.level.name,
  },
  {
    accessorKey: "class_id",
    header: "Class",
    cell: ({ row }) => row.original.class.name,
  },
  {
    accessorKey: "subject_id",
    header: "Subject",
    cell: ({ row }) => row.original.subject.name,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          <DeleteSubject currentSubject={row.original} />
          <UpdateSubject currentSubject={row.original} />
        </div>
      );
    },
  },
];
