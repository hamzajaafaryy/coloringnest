import { describe,it,expect } from "vitest";
import { canTransition } from "./types";
import { csvSafe } from "./format";
describe("shipment workflow", () => {
  it("allows valid transitions",()=> expect(canTransition("out_for_delivery","delivered")).toBe(true));
  it("blocks delivering cancelled parcels",()=> expect(canTransition("cancelled","delivered")).toBe(false));
  it("blocks modifying completed parcels",()=> expect(canTransition("delivered","refused")).toBe(false));
});
describe("CSV formula safety",()=>{
  it("escapes spreadsheet injections",()=>expect(csvSafe("=SUM(1+1)")).toBe("\"'=SUM(1+1)\""));
  it("quotes embedded double quotes",()=>expect(csvSafe('test"hi')).toBe('"test""hi"'));
});
