import { cookies } from "next/headers";
import {
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "@/lib/admin-token";

const COOKIE_NAME = "craftcoloring_admin";
const SESSION_DAYS = 7;

function getConfig() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!username || !password || !secret) {
    throw new Error(
      "Admin authentication is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET."
    );
  }

  return { username, password, secret };
}

export async function isAdminAuthenticated() {
  // Preview deployments can intentionally omit admin credentials.
  // An unconfigured admin is locked out, not a build-time crash.
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return false;
  }

  const { username, password, secret } = getConfig();
  const cookieStore = await cookies();
  return verifyAdminSessionToken(
    cookieStore.get(COOKIE_NAME)?.value,
    username,
    password,
    secret
  );
}

export async function loginAdmin(username: string, password: string) {
  const { username: configuredUsername, password: configuredPassword, secret } = getConfig();

  if (username !== configuredUsername || password !== configuredPassword) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(
    COOKIE_NAME,
    createAdminSessionToken(username, password, secret, Date.now() + 1000 * 60 * 60 * 24 * SESSION_DAYS),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * SESSION_DAYS,
    }
  );

  return true;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
