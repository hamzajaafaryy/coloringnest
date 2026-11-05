import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pinterestApiFailure } from "../src/lib/pinterest-api-diagnostics.ts";

test("Pinterest code 29 provides the proper actionable Trial Access explanation",()=>{
 const message=pinterestApiFailure(403,"/pins",{
   code:29,message:"Apps with Trial access may not create Pins in production",
 });
 assert.match(message,/Trial Access.*Production API/);
 assert.match(message,/Sandbox/);
 assert.match(message,/Standard Access/);
});
test("Pinterest API environments use different hosts and never reuse each other's tokens",async()=>{
 const source=await readFile("src/lib/pinterest-publishing.ts","utf8");
 assert.match(source,/https:\/\/api-sandbox\.pinterest\.com\/v5/);
 assert.match(source,/https:\/\/api\.pinterest\.com\/v5/);
 assert.match(source,/api_environment=\$1 LIMIT 1/);
 assert.match(source,/api_environment=\$2 RETURNING/);
 assert.match(source,/pinterestPublishingAllowed\(\)/);
 assert.match(source,/pinterestEnvironment\(\)/);
 assert.match(source,/createPinterestSandboxBoard/);
});
test("User interface never calls Trial API Production Pins published",async()=>{
 const ui=await readFile("src/components/admin/PinterestPublisher.tsx","utf8");
 assert.match(ui,/SANDBOX TEST MODE/);
 assert.match(ui,/creator-visible only/);
 assert.match(ui,/Test selected Pin in Sandbox/);
 assert.match(ui,/publishingAllowed/);
 assert.match(ui,/Create or find Sandbox test Board/);
});
