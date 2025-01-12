"use server";

import { access_token, api } from "@/data/api";
import type { Subcategory } from "@/types";
import { revalidatePath } from "next/cache";

export async function getSubcategories(): Promise<Subcategory[]> {
  const response = await fetch(`${api}/admin/course/subcategory`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json.data;
}

export async function addSubcategoryAction(
  newSubcategory: Pick<
    Subcategory,
    "name" | "name_en" | "icon" | "course_category_id"
  >,
) {
  try {
    const formData = new FormData();

    formData.append("name", newSubcategory.name);
    formData.append("name_en", newSubcategory.name_en);
    if (newSubcategory.icon) formData.append("icon", newSubcategory.icon);
    formData.append("course_category_id", newSubcategory.course_category_id);

    const response = await fetch(`${api}/admin/course/subcategory/store`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => null);
      const errorMessage = errorDetails?.message || "Something went wrong";
      throw new Error(errorMessage);
    }

    revalidatePath("/dashboard/subcategories");
    return await response.json();
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
}

export async function updateSubcategoryAction(
  updatedSubcategory: Pick<
    Subcategory,
    "name" | "name_en" | "icon" | "course_category_id" | "uuid"
  >,
) {
  try {
    const formData = new FormData();

    formData.append("name", updatedSubcategory.name);
    formData.append("name_en", updatedSubcategory.name_en);
    formData.append("uuid", updatedSubcategory.uuid);
    if (updatedSubcategory.icon)
      formData.append("icon", updatedSubcategory.icon);
    formData.append(
      "course_category_id",
      updatedSubcategory.course_category_id,
    );

    const response = await fetch(`${api}/admin/course/subcategory/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => null);
      const errorMessage = errorDetails?.message || "Something went wrong";
      throw new Error(errorMessage);
    }

    revalidatePath("/dashboard/subcategory");
    return await response.json();
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
}

export async function deleteSubcategoryAction(
  deletedSubcategory: Pick<Subcategory, "uuid">,
) {
  try {
    const response = await fetch(`${api}/admin/course/subcategory/delete`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deletedSubcategory),
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    revalidatePath("/dashboard/subcategory");
    return await response.json();
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}
