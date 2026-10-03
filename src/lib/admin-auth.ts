import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "craftcoloring_admin";
const SESSION_DAYS = 7;

type AdminConfig = {
  username: string;
  password: string;
  secret: string;
};

function getConfig(): AdminConfig | null {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!username || !password || !secret) {
    return null;
  }

  return { username, password, secret };
}

function getRequiredConfig(): AdminConfig {
  const config = getConfig();

  if (!config) {
    throw new Error(
      "Admin authentication is not configured. Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET."
    );
  }

  return config;
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

function makeToken(username: string, secret: string) {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      exp: Date.now() + 1000 * 60 * 60 * 24 * SESSION_DAYS,
    })
  ).toString("base64url");

  return `${payload}.${sign(payload, secret)}`;
}

function verifyToken(token: string | undefined, secret: string) {
  if (!token) return false;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;

  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!payload || !signature) return false;

  const expected = sign(payload, secret);
  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(expected, "utf8");

  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));

    return (
      typeof data.username === "string" &&
      typeof data.exp === "number" &&
      data.exp > Date.now()
    );
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const config = getConfig();

  // Missing admin env vars should never crash a public-site build.
  // Treat the admin as logged out until credentials are configured.
  if (!config) {
    return false;
  }

  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(COOKIE_NAME)?.value, config.secret);
}

export async function loginAdmin(username: string, password: string) {
  const {
    username: configuredUsername,
    password: configuredPassword,
    secret,
  } = getRequiredConfig();

  if (username !== configuredUsername || password !== configuredPassword) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, makeToken(username, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
  });

  return true;
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
