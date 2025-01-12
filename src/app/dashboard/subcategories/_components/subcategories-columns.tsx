"use client";

import { photos } from "@/data/api";
import type { Subcategory } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { DeleteSubcategory } from "./delete-subcategory";
import { UpdateSubcategory } from "./update-subcategory";

export const subcategorieColumns: ColumnDef<Subcategory>[] = [
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
    accessorKey: "course_category_id",
    header: "Course",
    cell: ({ row }) => row.original.course_category.name,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-x-2">
          {<UpdateSubcategory currentSubcategory={row.original} />}
          {<DeleteSubcategory currentSubcategory={row.original} />}
        </div>
      );
    },
  },
];
