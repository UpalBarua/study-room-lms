import { access_token, api } from "@/data/api";
import { fetchFromAPI } from "@/lib/utils";
import { Department } from "@/types";

export async function getDepartments(): Promise<Department[]> {
  try {
    const departments = await fetchFromAPI<Department[]>(
      `${api}/fetch/department`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    return departments;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    throw error;
  }
}
