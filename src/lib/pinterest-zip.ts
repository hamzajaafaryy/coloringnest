/** Browser-safe ZIP (STORE) writer. No paid SDK / npm dependency needed. */
const encoder = new TextEncoder();

function crc32(buffer: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let k = 0; k < 8; k++) crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function join(parts: Uint8Array[]): Uint8Array {
  const size = parts.reduce((sum,p) => sum + p.byteLength, 0);
  const output = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) { output.set(part,offset); offset += part.byteLength; }
  return output;
}

export function makePinZip(entries: { name: string; data: Uint8Array }[]): Uint8Array {
  if (!entries.length || entries.length > 24) throw new Error("Export at most 24 files");
  const local: Uint8Array[] = [], central: Uint8Array[] = [];
  let offset = 0;
  for (const entry of entries) {
    const filename = entry.name.replace(/\\/g, "/").split("/").pop() || "file";
    const name = encoder.encode(filename);
    if (name.byteLength > 200 || entry.data.byteLength > 32_000_000) throw new Error("Invalid ZIP file");
    const checksum = crc32(entry.data);
    const l = new Uint8Array(30 + name.length);
    const lview = new DataView(l.buffer);
    lview.setUint32(0,0x04034b50,true);
    lview.setUint16(4,20,true);
    lview.setUint16(6,0x0800,true);
    lview.setUint16(8,0,true);
    lview.setUint32(14,checksum,true);
    lview.setUint32(18,entry.data.length,true);
    lview.setUint32(22,entry.data.length,true);
    lview.setUint16(26,name.length,true);
    l.set(name,30);
    local.push(l,entry.data);

    const c = new Uint8Array(46 + name.length);
    const cview = new DataView(c.buffer);
    cview.setUint32(0,0x02014b50,true);
    cview.setUint16(4,20,true);
    cview.setUint16(6,20,true);
    cview.setUint16(8,0x0800,true);
    cview.setUint16(10,0,true);
    cview.setUint32(16,checksum,true);
    cview.setUint32(20,entry.data.length,true);
    cview.setUint32(24,entry.data.length,true);
    cview.setUint16(28,name.length,true);
    cview.setUint32(42,offset,true);
    c.set(name,46);
    central.push(c);
    offset += l.byteLength + entry.data.byteLength;
  }
  const center = join(central);
  const end = new Uint8Array(22);
  const view = new DataView(end.buffer);
  view.setUint32(0,0x06054b50,true);
  view.setUint16(8,entries.length,true);
  view.setUint16(10,entries.length,true);
  view.setUint32(12,center.length,true);
  view.setUint32(16,offset,true);
  return join([...local,center,end]);
}

export function seoCsvRow(values: string[]): string {
  return values.map(value => {
    const v = String(value || "").replace(/^[=+@\-]/, "'$&");
    return '"' + v.replace(/"/g, '""') + '"';
  }).join(",");
}
