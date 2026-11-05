import test from "node:test";
import assert from "node:assert/strict";
import { grantedPinterestScopes, pinterestApiFailure } from "../src/lib/pinterest-api-diagnostics.ts";

test("scopes are exact, normalized and never invented", () => {
  assert.deepEqual(grantedPinterestScopes("boards:read,pins:read pins:write"), ["boards:read", "pins:read", "pins:write"]);
  assert.deepEqual(grantedPinterestScopes("unknown"), []);
  assert.deepEqual(grantedPinterestScopes("boards:read"), ["boards:read"]);
});
test("HTTP 401 is a provider rejection, not proof of token expiry", () => {
  const message = pinterestApiFailure(401, "/pins", { code: 2, message: "Authentication failed" });
  assert.match(message, /HTTP 401.*creating the Pin/);
  assert.match(message, /code 2/);
  assert.match(message, /does not prove/);
});
test("never expose an OAuth token in third-party error descriptions", () => {
  const message = pinterestApiFailure(403, "/pins", {message:"Invalid pina_supersecret123 and Bearer pinr_shouldnotleak"});
  assert.doesNotMatch(message, /supersecret|shouldnotleak/);
  assert.match(message, /redacted/);
});

test("OAuth requests all four documented scopes for creating a Pin on a Board", async () => {
  const { PINTEREST_SCOPES } = await import("../src/lib/pinterest-publishing-validation.ts");
  const granted = new Set(PINTEREST_SCOPES.split(","));
  assert.deepEqual(granted, new Set(["boards:read","boards:write","pins:read","pins:write"]));
});
