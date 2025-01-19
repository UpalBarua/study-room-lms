import { access_token, api } from "@/data/api";
import { fetchFromAPI } from "@/lib/utils";
import { Department } from "@/types";

export async function getDepartments(): Promise<Department[]> {
  try {
    const departmentsResponse = await fetchFromAPI<Department[]>(
      `${api}/fetch/department`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    if (departmentsResponse.status === "success" && departmentsResponse.data) {
      return departmentsResponse.data;
    } else {
      console.warn(
        "Unexpected response while fetching departments:",
        departmentsResponse.message,
      );
      return [];
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`APIError while fetching departments: ${error.message}`);
    } else {
      console.error("Unexpected error while fetching departments:", error);
    }

    return [];
  }
}
