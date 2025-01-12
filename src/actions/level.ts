import { access_token, api } from "@/data/api";
import { fetchFromAPI } from "@/lib/utils";
import { Level } from "@/types";

export async function getLevels(): Promise<Level[]> {
  try {
    const levels = await fetchFromAPI<Level[]>(`${api}/fetch/level`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return levels;
  } catch (error) {
    console.error("Failed to fetch levels:", error);
    throw error;
  }
}
