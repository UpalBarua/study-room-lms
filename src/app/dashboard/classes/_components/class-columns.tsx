"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DeleteClass } from "./delete-class";
import { UpdateClass } from "./update-class";
import type { Class } from "@/types";

export const classColumns: ColumnDef<Class>[] = [
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
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          <UpdateClass currentClass={row.original} />
          <DeleteClass currentClass={row.original} />
        </div>
      );
    },
  },
];
