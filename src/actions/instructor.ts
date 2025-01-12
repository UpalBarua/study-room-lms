import { access_token, api } from "@/data/api";
import { fetchFromAPI } from "@/lib/utils";
import type { Instructor } from "@/types";

export async function getInstructors(): Promise<Instructor[]> {
  try {
    const instructors = await fetchFromAPI<Instructor[]>(
      `${api}/admin/employee/instructor`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return instructors.data;
  } catch (error) {
    console.error("Failed to fetch instructors:", error);
    throw error;
  }
}
