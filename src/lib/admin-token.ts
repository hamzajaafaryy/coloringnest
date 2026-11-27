import { createHmac, timingSafeEqual } from "node:crypto";

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createAdminSessionToken(
  username: string,
  password: string,
  secret: string,
  expiresAt: number
) {
  const payload = Buffer.from(
    JSON.stringify({
      username,
      credentialVersion: sign(`${username}: ${password}`, secret),
      exp: expiresAt,
    })
  ).toString("base64url");

  return `${payload}.${sign(payload, secret)}`;
}

export function verifyAdminSessionToken(
  token: string | undefined,
  expectedUsername: string,
  expectedPassword: string,
  secret: string,
  now = Date.now()
) {
  if (!token) return false;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;

  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!payload || !signature) return false;

  const expectedSignature = sign(payload, secret);
  const actual = Buffer.from(signature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return false;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const expectedCredentialVersion = sign(`${expectedUsername}: ${expectedPassword}`, secret);
    const actualCredentialVersion = Buffer.from(String(data.credentialVersion || ""), "utf8");
    const expectedVersion = Buffer.from(expectedCredentialVersion, "utf8");

    return (
      data.username === expectedUsername &&
      actualCredentialVersion.length === expectedVersion.length &&
      timingSafeEqual(actualCredentialVersion, expectedVersion) &&
      typeof data.exp === "number" &&
      Number.isFinite(data.exp) &&
      data.exp > now
    );
  } catch {
    return false;
  }
}
