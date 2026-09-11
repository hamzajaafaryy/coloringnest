// Utility to convert an SVG element or string into a high-res PNG Blob/DataURL and download it
export async function downloadSvgAsPng(
  svgContainerElement: HTMLElement | null,
  filename: string,
  pixelRatio = 2
): Promise<void> {
  if (!svgContainerElement) return;

  const svgEl = svgContainerElement.querySelector("svg");
  if (!svgEl) return;

  // Clone SVG so we don't mutate DOM
  const clonedSvg = svgEl.cloneNode(true) as SVGElement;
  
  // Get SVG dimensions
  const bbox = svgEl.getBoundingClientRect();
  const width = bbox.width || 600;
  const height = bbox.height || 600;

  clonedSvg.setAttribute("width", `${width * pixelRatio}`);
  clonedSvg.setAttribute("height", `${height * pixelRatio}`);

  const svgData = new XMLSerializer().serializeToString(clonedSvg);
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not get canvas context"));
        return;
      }

      // Draw white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw SVG image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      // Trigger download
      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
      link.href = pngUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve();
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

// Print trigger utility
export function printColoringPage(elementId: string): void {
  const content = document.getElementById(elementId);
  if (!content) {
    window.print();
    return;
  }
  
  window.print();
}
