import { artwork } from "./artwork";
import { CHAPTERS, narration, type Quest } from "./story";

function wrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  let line = "";
  const words = text.split(/\s+/).flatMap((word) => {
    if (ctx.measureText(word).width <= maxWidth) return [word];
    const chunks: string[] = [];
    let chunk = "";
    for (const character of Array.from(word)) {
      if (chunk && ctx.measureText(chunk + character).width > maxWidth) {
        chunks.push(chunk);
        chunk = "";
      }
      chunk += character;
    }
    if (chunk) chunks.push(chunk);
    return chunks;
  });
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      line = word;
    } else line = next;
  }
  if (line) ctx.fillText(line, x, y);
  return y + lineHeight;
}
async function drawArt(ctx: CanvasRenderingContext2D, svg: string, y: number) {
  const url = URL.createObjectURL(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
  );
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    ctx.drawImage(image, 80, y, 1080, 810);
  } finally {
    URL.revokeObjectURL(url);
  }
}
export async function downloadBook(quest: Quest) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const artist = quest.artist.trim() || "Young Artist";
  const dragon = quest.dragon.trim() || "Sunny";
  // Rasterizing the text with browser fonts preserves names in any script.
  for (let page = 0; page < 5; page++) {
    const canvas = document.createElement("canvas");
    canvas.width = 1240;
    canvas.height = 1754;
    const ctx = canvas.getContext("2d");
    if (!ctx)
      throw new Error(
        "Your browser could not create the book. Try Print instead.",
      );
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1240, 1754);
    ctx.fillStyle = "#7c3aed";
    ctx.fillRect(80, 80, 1080, 8);
    ctx.font = "bold 25px sans-serif";
    ctx.fillText("CRAFTCOLORING · COLORQUEST", 80, 140);
    ctx.fillStyle = "#172033";
    if (page === 0) {
      ctx.font = "bold 58px sans-serif";
      let y = wrappedText(
        ctx,
        `${dragon} and the Lost Rainbow`,
        80,
        245,
        1080,
        76,
      );
      ctx.font = "32px sans-serif";
      y = wrappedText(
        ctx,
        `Colored and created by ${artist}`,
        80,
        y + 20,
        1080,
        48,
      );
      await drawArt(
        ctx,
        artwork(0, quest.friend, quest.paintings[0]),
        Math.max(460, y + 35),
      );
      ctx.font = "32px sans-serif";
      wrappedText(
        ctx,
        "Four little chapters. One big imagination.",
        80,
        1480,
        1080,
        48,
      );
    } else {
      ctx.font = "bold 49px sans-serif";
      wrappedText(
        ctx,
        `${page}. ${CHAPTERS[page - 1].title}`,
        80,
        245,
        1080,
        62,
      );
      await drawArt(
        ctx,
        artwork(page - 1, quest.friend, quest.paintings[page - 1]),
        355,
      );
      ctx.font = "32px sans-serif";
      wrappedText(ctx, narration(quest, page - 1), 80, 1250, 1080, 48);
    }
    ctx.fillStyle = "#64748b";
    ctx.font = "23px sans-serif";
    ctx.fillText(
      `CraftColoring.com · ${page === 0 ? "My coloring adventure" : `Chapter ${page} of 4`}`,
      80,
      1665,
    );
    if (page) pdf.addPage();
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.94), "JPEG", 0, 0, 210, 297);
  }
  pdf.setProperties({
    title: `${dragon} and the Lost Rainbow`,
    author: artist,
    subject: "A personalized ColorQuest coloring storybook",
  });
  pdf.save("my-colorquest-storybook.pdf");
}
