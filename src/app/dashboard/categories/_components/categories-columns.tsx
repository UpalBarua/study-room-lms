"use client";

import { photos } from "@/data/api";
import type { Category } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { DeleteCategory } from "./delete-category";
import { UpdateCategory } from "./update-category";

export const categorieColumns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const iconUrl = row.original.icon;

      return (
        <div className="flex items-center gap-x-3">
          {iconUrl ? (
            <Image src={`${photos}/${iconUrl}`} alt="" height={25} width={25} />
          ) : (
            <Image
              src="/icons/icon-category-default.svg"
              alt=""
              height={25}
              width={25}
            />
          )}
          <span>{row.original.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "name_en",
    header: "Name (English)",
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          <UpdateCategory currentCategory={row.original} />
          <DeleteCategory currentCategory={row.original} />
        </div>
      );
    },
  },
];
