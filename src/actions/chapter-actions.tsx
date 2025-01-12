"use server";

import { access_token, api } from "@/data/api";
import { Chapter } from "@/types";
import { revalidatePath } from "next/cache";

export async function addChapterAction(
  newChapter: Pick<
    Chapter,
    "name" | "name_en" | "level_id" | "class_id" | "subject_id"
  >,
) {
  try {
    const response = await fetch(`${api}/admin/chapter/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(newChapter),
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    revalidatePath("/dashboard/chapters");
    return await response.json();
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}

export async function updateChapterAction(
  updatedChapter: Pick<Chapter, "name" | "name_en" | "level_id" | "uuid">,
) {
  try {
    const response = await fetch(`${api}/admin/chapter/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(updatedChapter),
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    revalidatePath("/dashboard/chapters");
    return await response.json();
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}

export async function deleteChapterAction(
  deletedChapter: Pick<Chapter, "uuid">,
) {
  try {
    const response = await fetch(`${api}/admin/chapter/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(deletedChapter),
    });

    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    revalidatePath("/dashboard/chapters");
    return await response.json();
  } catch (error) {
    return {
      error: "Something went wrong",
    };
  }
}
