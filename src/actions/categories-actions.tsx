"use server";

import { access_token, api } from "@/data/api";
import type { Category } from "@/types";
import { revalidatePath } from "next/cache";

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${api}/admin/course/category`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json.data;
}

export async function addCategoryAction(
  newCategory: Pick<Category, "name" | "name_en" | "icon">,
) {
  try {
    const formData = new FormData();

    formData.append("name", newCategory.name);
    formData.append("name_en", newCategory.name_en);
    formData.append("icon", newCategory.icon);

    const response = await fetch(`${api}/admin/course/category/store`, {
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

    revalidatePath("/dashboard/categories");
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

export async function updateCategoryAction(
  updatedCategory: Pick<Category, "name" | "name_en" | "icon" | "uuid">,
) {
  try {
    const formData = new FormData();

    formData.append("name", updatedCategory.name);
    formData.append("name_en", updatedCategory.name_en);
    if (updatedCategory.icon) formData.append("icon", updatedCategory.icon);
    formData.append("uuid", updatedCategory.uuid);

    const response = await fetch(`${api}/admin/course/category/update`, {
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

    revalidatePath("/dashboard/classes");
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

export async function deleteCategoryAction(
  deletedCategory: Pick<Category, "uuid">,
) {
  try {
    const response = await fetch(`${api}/admin/course/category/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(deletedCategory),
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    revalidatePath("/dashboard/classes");
    return await response.json();
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}
