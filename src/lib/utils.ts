import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { access_token, api } from "@/data/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fetchFromAPI<T>(
  url: string,
  options: RequestInit & { timeout?: number } = {},
): Promise<{
  status: "success" | "error" | "warning";
  message: string;
  data: T | null;
}> {
  const { timeout = 10000, ...fetchOptions } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(id);

    const responseData = await response.json();

    if (
      !response.ok ||
      responseData.status === "error" ||
      responseData.status === "warning"
    ) {
      throw new Error(
        responseData.message || `HTTP error! Status: ${response.status}`,
      );
    }

    return responseData;
  } catch (error) {
    clearTimeout(id);

    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out");
    }

    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred",
    );
  }
}

export async function fetchData<T>(endpoint: string): Promise<T> {
  console.log(`${api}${endpoint}`);
  try {
    const response = await fetchFromAPI<T>(`${api}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response.data === null || response.data === undefined) {
      throw new Error(`No data found at ${endpoint}`);
    }

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch data from ${endpoint}:`, error);
    throw new Error(`Failed to fetch data from ${endpoint}`);
  }
}

export function objectToFormData(
  data: Record<string, any>,
  formData = new FormData(),
  parentKey = "",
): FormData {
  Object.entries(data).forEach(([key, value]) => {
    const newKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof File || value instanceof Blob) {
      formData.append(newKey, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        objectToFormData({ [index]: item }, formData, `${newKey}[${index}]`);
      });
    } else if (value && typeof value === "object") {
      objectToFormData(value, formData, newKey);
    } else {
      formData.append(newKey, value == null ? "" : String(value));
    }
  });
  return formData;
}

export function generateUniqueKey(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function decodeJsonFields(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(decodeJsonFields);
  } else if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (typeof value === "string") {
          try {
            return [key, JSON.parse(value)];
          } catch {
            return [key, decodeJsonFields(value)];
          }
        }
        return [key, decodeJsonFields(value)];
      }),
    );
  }
  return obj;
}
