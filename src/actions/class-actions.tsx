"use server";

import { access_token, api } from "@/data/api";
import type { Class } from "@/types";
import { revalidatePath } from "next/cache";

export async function getClasses(): Promise<Class[]> {
  const response = await fetch(`${api}/admin/class`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json.data;
}

export async function addClassAction(
  newClass: Pick<Class, "name" | "name_en" | "level_id">,
) {
  try {
    const response = await fetch(`${api}/admin/class/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(newClass),
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

export async function updateClassAction(
  updatedClass: Pick<Class, "name" | "name_en" | "level_id" | "uuid">,
) {
  try {
    const response = await fetch(`${api}/admin/class/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(updatedClass),
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

export async function deleteClassAction(deletedClass: Pick<Class, "uuid">) {
  try {
    const response = await fetch(`${api}/admin/class/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(deletedClass),
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
