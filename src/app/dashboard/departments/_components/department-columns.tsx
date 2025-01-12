"use client";

import type { Class } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteDepartment } from "./delete-department";
import { UpdateDepartment } from "./update-department";

export const departmentColumns: ColumnDef<Class>[] = [
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
          <UpdateDepartment currentDepartment={row.original} />
          <DeleteDepartment currentDepartment={row.original} />
        </div>
      );
    },
  },
];
