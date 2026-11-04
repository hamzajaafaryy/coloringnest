import test from "node:test";
import assert from "node:assert/strict";
import { normalizeApprovedPin,pinterestErrorStatus } from "../src/lib/pinterest-publishing-validation.ts";
const input={pageId:12,sheetId:"cover",template:"editorial",headline:"Cute Ghost Coloring Page",title:"Cute Ghost Coloring Page | Free Printable",description:"Cute ghost reading a book.",altText:"Outline ghost reading book.",boardId:"12345678912",destination:"https://www.craftcoloring.com/coloring-pages/halloween/ghost?utm_source=pinterest",scheduledAt:"2026-11-05T09:00:00.000Z"};
test("approved Pins must identify a valid board, page and canonical link",()=>{
 assert.equal(normalizeApprovedPin(input,new Date("2026-11-04T10:00:00Z")).boardId,input.boardId);
 for(const update of [{boardId:"Halloween"},{destination:"https://evil.test/coloring-pages/ghost"},{headline:""},{scheduledAt:"2025-01-01T00:00:00Z"},{scheduledAt:"2028-11-05T09:00:00Z"}])
  assert.throws(()=>normalizeApprovedPin({...input,...update},new Date("2026-11-04T10:00:00Z")));
 assert.match(pinterestErrorStatus(401),/Reconnect/);
});
