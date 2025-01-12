import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchFromAPI<T>(
  url: string,
  options: RequestInit,
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.message || `HTTP error! Status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data: T = await response.json();
    return data;
  } catch (error) {
    console.error("API call failed:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong while fetching data.");
  }
}
