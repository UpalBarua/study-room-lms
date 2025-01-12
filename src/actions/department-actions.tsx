"use server";

import { access_token, api } from "@/data/api";
import type { Department } from "@/types";
import { revalidatePath } from "next/cache";

export async function addDeaprtmentAction(
  newDepartment: Pick<Department, "name" | "name_en" | "level_id">,
) {
  try {
    const response = await fetch(`${api}/admin/department/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(newDepartment),
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    revalidatePath("/dashboard/departments");
    return await response.json();
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}

export async function updateDepartmentAction(
  updatedDepartment: Pick<Department, "name" | "name_en" | "level_id" | "uuid">,
) {
  try {
    const response = await fetch(`${api}/admin/department/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(updatedDepartment),
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

export async function deleteDepartmentAction(
  deletedDepartment: Pick<Department, "uuid">,
) {
  try {
    const response = await fetch(`${api}/admin/department/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(deletedDepartment),
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
