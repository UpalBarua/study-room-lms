"use server";

import { access_token, api } from "@/data/api";
import type { Subject } from "@/types";
import { revalidatePath } from "next/cache";

export async function getSubjects(): Promise<Subject[]> {
  const response = await fetch(`${api}/admin/subject`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json.data;
}

export async function addSubjectAction(
  newSubject: Pick<Subject, "name" | "name_en" | "level_id" | "class_id">,
) {
  try {
    const response = await fetch(`${api}/admin/subject/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(newSubject),
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

export async function updateSubjectAction(
  updatedSubject: Pick<Subject, "name" | "name_en" | "level_id" | "uuid">,
) {
  try {
    const response = await fetch(`${api}/admin/subject/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(updatedSubject),
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    revalidatePath("/dashboard/subjects");
    return await response.json();
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}

export async function deleteSubjectAction(
  deletedSubject: Pick<Subject, "uuid">,
) {
  try {
    const response = await fetch(`${api}/admin/subject/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(deletedSubject),
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    revalidatePath("/dashboard/subjects");
    return await response.json();
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}
