import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "craftcoloring_admin";

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

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function makeToken(username: string, secret: string) {
  const payload = Buffer.from(
    JSON.stringify({ username, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })
  ).toString("base64url");

  return `${payload}.${sign(payload, secret)}`;
}

function verifyToken(token: string | undefined, secret: string) {
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);

  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const { secret } = getConfig();
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(COOKIE_NAME)?.value, secret);
}

export async function loginAdmin(username: string, password: string) {
  const {
    username: configuredUsername,
    password: configuredPassword,
    secret,
  } = getConfig();

  if (username !== configuredUsername || password !== configuredPassword) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, makeToken(username, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return true;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
