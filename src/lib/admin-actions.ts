"use server";

import { loginAdmin as authenticateAdmin, logoutAdmin } from "@/lib/admin-auth";

export async function loginAdmin(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { success: false, error: "Enter your username and password." };
  }

  try {
    const success = await authenticateAdmin(username, password);

    if (!success) {
      return { success: false, error: "Invalid username or password." };
    }

    return { success: true, error: "" };
  } catch {
    return {
      success: false,
      error: "Admin authentication is not configured yet.",
    };
  }
}

export async function logoutAdmin() {
  await logoutAdmin();
}
