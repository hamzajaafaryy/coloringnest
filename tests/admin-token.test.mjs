import test from "node:test";
import assert from "node:assert/strict";
import {
  createAdminSessionToken,
  verifyAdminSessionToken,
} from "../src/lib/admin-token.ts";

const username = "craft-admin";
const password = "a-long-password";
const secret = "test-only-session-secret";
const expiresAt = 2_000_000_000_000;

test("admin session accepts only the configured username and credentials", () => {
  const token = createAdminSessionToken(username, password, secret, expiresAt);
  assert.equal(verifyAdminSessionToken(token, username, password, secret, 1_900_000_000_000), true);
  assert.equal(verifyAdminSessionToken(token, "another-admin", password, secret, 1_900_000_000_000), false);
  assert.equal(verifyAdminSessionToken(token, username, "changed-password", secret, 1_900_000_000_000), false);
});

test("admin session rejects expired, tampered and malformed tokens", () => {
  const token = createAdminSessionToken(username, password, secret, 1_800_000_000_000);
  assert.equal(verifyAdminSessionToken(token, username, password, secret, 1_900_000_000_000), false);
  assert.equal(verifyAdminSessionToken(token + "x", username, password, secret, 1_700_000_000_000), false);
  assert.equal(verifyAdminSessionToken("not-a-token", username, password, secret), false);
  assert.equal(verifyAdminSessionToken(undefined, username, password, secret), false);
});
