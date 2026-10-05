/** Print an isolated copy, so navigation, ads and editor controls never print. */
export async function printArtwork(source: Element | null, title: string) {
  const artwork = source?.matches("svg,img,canvas")
    ? source : source?.querySelector("svg,img,canvas");
  if (!artwork) throw new Error("No artwork is available to print.");

  document.getElementById("craftcoloring-print-frame")?.remove();
  const frame = document.createElement("iframe");
  frame.id = "craftcoloring-print-frame";
  frame.title = "Print coloring sheet";
  frame.style.cssText = "position:fixed;left:-10000px;top:0;width:800px;height:1000px;border:0";
  document.body.appendChild(frame);

  try {
    const doc = frame.contentDocument;
    const win = frame.contentWindow;
    if (!doc || !win) throw new Error("Could not open the print preview.");
    doc.title = title;
    const style = doc.createElement("style");
    style.textContent = "@page{size:auto;margin:10mm}html,body{margin:0;background:white}body{display:flex;justify-content:center}svg,img{display:block;width:100%;height:auto;max-width:190mm;max-height:250mm;object-fit:contain;break-inside:avoid}";
    doc.head.appendChild(style);

    if (artwork instanceof HTMLCanvasElement || artwork instanceof HTMLImageElement) {
      const img = doc.createElement("img");
      img.alt = title;
      img.src = artwork instanceof HTMLCanvasElement ? artwork.toDataURL("image/png") : artwork.currentSrc || artwork.src;
      doc.body.appendChild(img);
      await img.decode();
    } else {
      doc.body.appendChild(artwork.cloneNode(true));
    }

    win.addEventListener("afterprint", () => frame.remove(), { once: true });
    win.focus();
    win.print();
  } catch (error) {
    frame.remove();
    throw error;
  }
}
