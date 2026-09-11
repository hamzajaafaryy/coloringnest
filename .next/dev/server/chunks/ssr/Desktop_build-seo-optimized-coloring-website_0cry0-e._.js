module.exports = [
"[project]/Desktop/build-seo-optimized-coloring-website/src/lib/coloring/svgUtils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Utility to convert an SVG element or string into a high-res PNG Blob/DataURL and download it
__turbopack_context__.s([
    "downloadSvgAsPng",
    ()=>downloadSvgAsPng,
    "printColoringPage",
    ()=>printColoringPage
]);
async function downloadSvgAsPng(svgContainerElement, filename, pixelRatio = 2) {
    if (!svgContainerElement) return;
    const svgEl = svgContainerElement.querySelector("svg");
    if (!svgEl) return;
    // Clone SVG so we don't mutate DOM
    const clonedSvg = svgEl.cloneNode(true);
    // Get SVG dimensions
    const bbox = svgEl.getBoundingClientRect();
    const width = bbox.width || 600;
    const height = bbox.height || 600;
    clonedSvg.setAttribute("width", `${width * pixelRatio}`);
    clonedSvg.setAttribute("height", `${height * pixelRatio}`);
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([
        svgData
    ], {
        type: "image/svg+xml;charset=utf-8"
    });
    const url = URL.createObjectURL(svgBlob);
    return new Promise((resolve, reject)=>{
        const img = new Image();
        img.onload = ()=>{
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
        img.onerror = (err)=>{
            URL.revokeObjectURL(url);
            reject(err);
        };
        img.src = url;
    });
}
function printColoringPage(elementId) {
    const content = document.getElementById(elementId);
    if (!content) {
        window.print();
        return;
    }
    window.print();
}
}),
"[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ColoringEditor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paint$2d$bucket$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PaintBucket$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/paint-bucket.mjs [app-ssr] (ecmascript) <export default as PaintBucket>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brush$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Brush$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/brush.mjs [app-ssr] (ecmascript) <export default as Brush>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/eraser.mjs [app-ssr] (ecmascript) <export default as Eraser>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/undo-2.mjs [app-ssr] (ecmascript) <export default as Undo2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo2$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/redo-2.mjs [app-ssr] (ecmascript) <export default as Redo2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-ssr] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/download.mjs [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/printer.mjs [app-ssr] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/zoom-in.mjs [app-ssr] (ecmascript) <export default as ZoomIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/zoom-out.mjs [app-ssr] (ecmascript) <export default as ZoomOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs [app-ssr] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/save.mjs [app-ssr] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/check.mjs [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$src$2f$lib$2f$coloring$2f$svgUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/src/lib/coloring/svgUtils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const PRESET_COLORS = [
    "#111827",
    "#FFFFFF",
    "#EF4444",
    "#F97316",
    "#EAB308",
    "#10B981",
    "#06B6D4",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#8D4925",
    "#6B7280"
];
function ColoringEditor({ slug, title, svgContent }) {
    const [selectedColor, setSelectedColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("#EC4899");
    const [activeTool, setActiveTool] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("fill");
    const [brushSize, setBrushSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(12);
    const [zoomLevel, setZoomLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [savedSuccess, setSavedSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [history, setHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [historyIndex, setHistoryIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(-1);
    const svgWrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isDrawing, setIsDrawing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    /*
   * ============================================================
   * INITIALIZE SVG
   * ============================================================
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!svgWrapperRef.current) return;
        const storageKey = `coloringnest_saved_${slug}`;
        const savedState = localStorage.getItem(storageKey);
        svgWrapperRef.current.innerHTML = savedState || svgContent;
        const initialSvg = svgWrapperRef.current.innerHTML;
        setHistory([
            initialSvg
        ]);
        setHistoryIndex(0);
        // Make SVG responsive
        const svg = svgWrapperRef.current.querySelector("svg");
        if (svg) {
            svg.style.width = "100%";
            svg.style.height = "100%";
            svg.style.display = "block";
            svg.style.pointerEvents = "auto";
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }
    }, [
        slug,
        svgContent
    ]);
    /*
   * ============================================================
   * HISTORY
   * ============================================================
   */ const pushHistory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!svgWrapperRef.current) return;
        const currentSvg = svgWrapperRef.current.innerHTML;
        setHistory((previousHistory)=>{
            setHistoryIndex((previousIndex)=>{
                const updatedHistory = previousHistory.slice(0, previousIndex + 1);
                updatedHistory.push(currentSvg);
                return updatedHistory.length - 1;
            });
            const currentIndex = historyIndex;
            return [
                ...previousHistory.slice(0, currentIndex + 1),
                currentSvg
            ];
        });
    }, [
        historyIndex
    ]);
    /*
   * ============================================================
   * FILL BUCKET
   * ============================================================
   */ const handleSvgClick = (e)=>{
        if (activeTool !== "fill") return;
        const target = e.target;
        if (!target) return;
        const colorable = target.closest("path, polygon, circle, ellipse, rect");
        if (!colorable) return;
        // Never color the root SVG itself
        if (colorable.tagName.toLowerCase() === "svg") return;
        const element = colorable;
        element.setAttribute("fill", selectedColor);
        pushHistory();
    };
    /*
   * ============================================================
   * CANVAS RESOLUTION
   *
   * CSS size and internal canvas size are different.
   * We keep a high resolution internal canvas.
   * ============================================================
   */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        if (!canvas) return;
        const resizeCanvas = ()=>{
            const rect = canvas.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const dpr = Math.max(window.devicePixelRatio || 1, 1);
            const width = Math.round(rect.width * dpr);
            const height = Math.round(rect.height * dpr);
            if (canvas.width === width && canvas.height === height) {
                return;
            }
            /*
       * Preserve existing drawing when resizing.
       */ const oldCanvas = document.createElement("canvas");
            oldCanvas.width = canvas.width;
            oldCanvas.height = canvas.height;
            const oldCtx = oldCanvas.getContext("2d");
            if (oldCtx && canvas.width > 0 && canvas.height > 0) {
                oldCtx.drawImage(canvas, 0, 0);
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (oldCanvas.width > 0 && oldCanvas.height > 0) {
                ctx.drawImage(oldCanvas, 0, 0, oldCanvas.width / (window.devicePixelRatio || 1), oldCanvas.height / (window.devicePixelRatio || 1));
            }
        };
        resizeCanvas();
        const observer = new ResizeObserver(resizeCanvas);
        observer.observe(canvas);
        window.addEventListener("resize", resizeCanvas);
        return ()=>{
            observer.disconnect();
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);
    /*
   * ============================================================
   * GET EXACT CANVAS COORDINATES
   *
   * This is the important fix.
   *
   * client coordinates
   *       ↓
   * canvas bounding rect
   *       ↓
   * CSS pixels
   *       ↓
   * internal canvas coordinates
   * ============================================================
   */ const getCanvasCoordinates = (event)=>{
        const canvas = canvasRef.current;
        if (!canvas) {
            return {
                x: 0,
                y: 0
            };
        }
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width * canvas.width;
        const y = (event.clientY - rect.top) / rect.height * canvas.height;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: x / scaleX,
            y: y / scaleY
        };
    };
    /*
   * ============================================================
   * START DRAWING
   * ============================================================
   */ const startDrawing = (e)=>{
        if (activeTool === "fill") return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        e.preventDefault();
        canvas.setPointerCapture?.(e.pointerId);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const { x, y } = getCanvasCoordinates(e);
        setIsDrawing(true);
        ctx.beginPath();
        ctx.moveTo(x, y);
        /*
     * Draw a dot immediately.
     * This makes single taps work.
     */ ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        if (activeTool === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = "rgba(0,0,0,1)";
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = selectedColor;
        }
        ctx.fill();
    };
    /*
   * ============================================================
   * DRAW
   * ============================================================
   */ const draw = (e)=>{
        if (!isDrawing || activeTool === "fill") return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        e.preventDefault();
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const { x, y } = getCanvasCoordinates(e);
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        if (activeTool === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
        } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = selectedColor;
        }
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };
    /*
   * ============================================================
   * STOP DRAWING
   * ============================================================
   */ const stopDrawing = (e)=>{
        if (!isDrawing) return;
        if (e) {
            try {
                e.currentTarget.releasePointerCapture?.(e.pointerId);
            } catch  {}
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.closePath();
                ctx.globalCompositeOperation = "source-over";
            }
        }
        setIsDrawing(false);
    };
    /*
   * ============================================================
   * UNDO / REDO
   * ============================================================
   */ const handleUndo = ()=>{
        if (historyIndex <= 0) return;
        const previousIndex = historyIndex - 1;
        setHistoryIndex(previousIndex);
        if (svgWrapperRef.current) {
            svgWrapperRef.current.innerHTML = history[previousIndex];
        }
    };
    const handleRedo = ()=>{
        if (historyIndex >= history.length - 1) return;
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        if (svgWrapperRef.current) {
            svgWrapperRef.current.innerHTML = history[nextIndex];
        }
    };
    /*
   * ============================================================
   * RESET
   * ============================================================
   */ const handleReset = ()=>{
        if (svgWrapperRef.current) {
            svgWrapperRef.current.innerHTML = svgContent;
            const svg = svgWrapperRef.current.querySelector("svg");
            if (svg) {
                svg.style.width = "100%";
                svg.style.height = "100%";
                svg.style.display = "block";
                svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
            }
            pushHistory();
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        localStorage.removeItem(`coloringnest_saved_${slug}`);
    };
    /*
   * ============================================================
   * SAVE
   * ============================================================
   */ const handleSaveLocal = ()=>{
        if (!svgWrapperRef.current) return;
        const key = `coloringnest_saved_${slug}`;
        localStorage.setItem(key, svgWrapperRef.current.innerHTML);
        setSavedSuccess(true);
        setTimeout(()=>{
            setSavedSuccess(false);
        }, 2000);
    };
    /*
   * ============================================================
   * DOWNLOAD
   * ============================================================
   */ const handleDownload = async ()=>{
        if (!svgWrapperRef.current) return;
        const filename = `${slug}-colored.png`;
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$src$2f$lib$2f$coloring$2f$svgUtils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["downloadSvgAsPng"])(svgWrapperRef.current, filename);
    };
    /*
   * ============================================================
   * PRINT
   * ============================================================
   */ const handlePrint = ()=>{
        window.print();
    };
    /*
   * ============================================================
   * RENDER
   * ============================================================
   */ return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 text-white flex flex-col gap-6 max-w-5xl mx-auto my-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/60",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTool("fill"),
                                className: `flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${activeTool === "fill" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-300 hover:text-white hover:bg-slate-800"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paint$2d$bucket$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__PaintBucket$3e$__["PaintBucket"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                        lineNumber: 540,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Fill Bucket"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                        lineNumber: 542,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 532,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTool("brush"),
                                className: `flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${activeTool === "brush" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-300 hover:text-white hover:bg-slate-800"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brush$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Brush$3e$__["Brush"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                        lineNumber: 555,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Brush"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                        lineNumber: 557,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 547,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTool("eraser"),
                                className: `flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all ${activeTool === "eraser" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-300 hover:text-white hover:bg-slate-800"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eraser$3e$__["Eraser"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                        lineNumber: 570,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Eraser"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                        lineNumber: 572,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 562,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                        lineNumber: 530,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleUndo,
                                disabled: historyIndex <= 0,
                                className: "p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed",
                                title: "Undo",
                                "aria-label": "Undo action",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Undo2$3e$__["Undo2"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                    lineNumber: 589,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 582,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleRedo,
                                disabled: historyIndex >= history.length - 1,
                                className: "p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed",
                                title: "Redo",
                                "aria-label": "Redo action",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Redo2$3e$__["Redo2"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                    lineNumber: 599,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 592,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setZoomLevel((z)=>Math.min(z + 0.2, 2)),
                                className: "p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200",
                                title: "Zoom In",
                                "aria-label": "Zoom in",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__["ZoomIn"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                    lineNumber: 612,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 602,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setZoomLevel((z)=>Math.max(z - 0.2, 0.6)),
                                className: "p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200",
                                title: "Zoom Out",
                                "aria-label": "Zoom out",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__["ZoomOut"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                    lineNumber: 625,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 615,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setZoomLevel(1),
                                className: "p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200",
                                title: "Reset Zoom",
                                "aria-label": "Reset zoom",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                    lineNumber: 634,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 628,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleReset,
                                className: "p-2.5 rounded-xl bg-rose-900/50 text-rose-300 hover:bg-rose-900",
                                title: "Clear All",
                                "aria-label": "Clear all colors",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                    className: "w-4 h-4"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                    lineNumber: 643,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 637,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                        lineNumber: 580,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSaveLocal,
                                className: "flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs",
                                children: [
                                    savedSuccess ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                        className: "w-4 h-4 text-emerald-400"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                        lineNumber: 657,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                        lineNumber: 659,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden md:inline",
                                        children: savedSuccess ? "Saved!" : "Save"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                        lineNumber: 662,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 652,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleDownload,
                                className: "flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                        lineNumber: 671,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Download PNG"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                        lineNumber: 673,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 667,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handlePrint,
                                className: "flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                        lineNumber: 682,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: "Print"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                        lineNumber: 684,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 678,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                        lineNumber: 650,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                lineNumber: 526,
                columnNumber: 7
            }, this),
            (activeTool === "brush" || activeTool === "eraser") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 bg-slate-800/50 px-4 py-2 rounded-xl text-xs text-slate-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-semibold",
                        children: [
                            "Brush Size: ",
                            brushSize,
                            "px"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                        lineNumber: 700,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "range",
                        min: "4",
                        max: "40",
                        value: brushSize,
                        onChange: (e)=>setBrushSize(Number(e.target.value)),
                        className: "w-48 accent-indigo-500 cursor-pointer"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                        lineNumber: 704,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                lineNumber: 698,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: " relative w-full aspect-square max-h-[600px] bg-white rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-700/50 ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        transform: `scale(${zoomLevel})`,
                        transition: "transform 0.15s ease-out"
                    },
                    className: " relative w-full h-full flex items-center justify-center ",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: svgWrapperRef,
                            onClick: handleSvgClick,
                            className: " absolute inset-0 w-full h-full flex items-center justify-center select-none "
                        }, void 0, false, {
                            fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                            lineNumber: 760,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                            ref: canvasRef,
                            onPointerDown: startDrawing,
                            onPointerMove: draw,
                            onPointerUp: stopDrawing,
                            onPointerCancel: stopDrawing,
                            onPointerLeave: (e)=>{
                                if (e.buttons === 0) {
                                    stopDrawing(e);
                                }
                            },
                            className: `
              absolute
              inset-0
              w-full
              h-full
              touch-none
              select-none
              ${activeTool === "fill" ? "pointer-events-none" : "pointer-events-auto cursor-crosshair"}
            `
                        }, void 0, false, {
                            fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                            lineNumber: 783,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                    lineNumber: 742,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                lineNumber: 724,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                className: "w-4 h-4 text-amber-400"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 820,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs font-bold uppercase tracking-wider text-slate-300",
                                children: "Color Palette"
                            }, void 0, false, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 822,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                        lineNumber: 818,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap items-center gap-2",
                        children: [
                            PRESET_COLORS.map((color)=>{
                                const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedColor(color),
                                    style: {
                                        backgroundColor: color
                                    },
                                    className: `
                  w-8
                  h-8
                  rounded-full
                  border-2
                  transition-transform
                  ${isSelected ? "border-white scale-125 shadow-lg" : "border-slate-700 hover:scale-110"}
                `,
                                    title: color,
                                    "aria-label": `Select color ${color}`
                                }, color, false, {
                                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                    lineNumber: 837,
                                    columnNumber: 15
                                }, this);
                            }),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative inline-flex items-center ml-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "color",
                                    value: selectedColor,
                                    onChange: (e)=>setSelectedColor(e.target.value),
                                    className: " w-9 h-9 rounded-full border-2 border-slate-600 bg-transparent cursor-pointer p-0 overflow-hidden ",
                                    title: "Pick Custom Color"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                    lineNumber: 865,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                                lineNumber: 863,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                        lineNumber: 828,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
                lineNumber: 816,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/ColoringEditor.tsx",
        lineNumber: 520,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/paint-bucket.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>PaintBucket
]);
/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "paint-bucket",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M11 7 6 2",
                key: "1jwth8"
            }
        ],
        [
            "path",
            {
                d: "M18.992 12H2.041",
                key: "xw1gg"
            }
        ],
        [
            "path",
            {
                d: "M21.145 18.38A3.34 3.34 0 0 1 20 16.5a3.3 3.3 0 0 1-1.145 1.88c-.575.46-.855 1.02-.855 1.595A2 2 0 0 0 20 22a2 2 0 0 0 2-2.025c0-.58-.285-1.13-.855-1.595",
                key: "1nkol4"
            }
        ],
        [
            "path",
            {
                d: "m8.5 4.5 2.148-2.148a1.205 1.205 0 0 1 1.704 0l7.296 7.296a1.205 1.205 0 0 1 0 1.704l-7.592 7.592a3.615 3.615 0 0 1-5.112 0l-3.888-3.888a3.615 3.615 0 0 1 0-5.112L5.67 7.33",
                key: "1nk1rd"
            }
        ]
    ]
};
__iconData.node;
const PaintBucket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/paint-bucket.mjs [app-ssr] (ecmascript) <export default as PaintBucket>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PaintBucket",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paint$2d$bucket$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$paint$2d$bucket$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/paint-bucket.mjs [app-ssr] (ecmascript)");
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/brush.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Brush
]);
/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "brush",
    size: 24,
    node: [
        [
            "path",
            {
                d: "m11 10 3 3",
                key: "fzmg1i"
            }
        ],
        [
            "path",
            {
                d: "M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z",
                key: "p4q2r7"
            }
        ],
        [
            "path",
            {
                d: "M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031",
                key: "wy6l02"
            }
        ]
    ]
};
__iconData.node;
const Brush = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/brush.mjs [app-ssr] (ecmascript) <export default as Brush>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Brush",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brush$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$brush$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/brush.mjs [app-ssr] (ecmascript)");
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/eraser.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Eraser
]);
/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "eraser",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21",
                key: "g5wo59"
            }
        ],
        [
            "path",
            {
                d: "m5.082 11.09 8.828 8.828",
                key: "1wx5vj"
            }
        ]
    ]
};
__iconData.node;
const Eraser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/eraser.mjs [app-ssr] (ecmascript) <export default as Eraser>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Eraser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eraser$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/eraser.mjs [app-ssr] (ecmascript)");
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/undo-2.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Undo2
]);
/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "undo-2",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M9 14 4 9l5-5",
                key: "102s5s"
            }
        ],
        [
            "path",
            {
                d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11",
                key: "f3b9sd"
            }
        ]
    ]
};
__iconData.node;
const Undo2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/undo-2.mjs [app-ssr] (ecmascript) <export default as Undo2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Undo2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$undo$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/undo-2.mjs [app-ssr] (ecmascript)");
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/redo-2.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Redo2
]);
/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "redo-2",
    size: 24,
    node: [
        [
            "path",
            {
                d: "m15 14 5-5-5-5",
                key: "12vg1m"
            }
        ],
        [
            "path",
            {
                d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13",
                key: "6uklza"
            }
        ]
    ]
};
__iconData.node;
const Redo2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/redo-2.mjs [app-ssr] (ecmascript) <export default as Redo2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Redo2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$redo$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/redo-2.mjs [app-ssr] (ecmascript)");
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>RotateCcw
]);
/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "rotate-ccw",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
                key: "1357e3"
            }
        ],
        [
            "path",
            {
                d: "M3 3v5h5",
                key: "1xhq8a"
            }
        ]
    ]
};
__iconData.node;
const RotateCcw = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-ssr] (ecmascript) <export default as RotateCcw>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RotateCcw",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-ssr] (ecmascript)");
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/download.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Download
]);
/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "download",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M12 15V3",
                key: "m9g1x1"
            }
        ],
        [
            "path",
            {
                d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
                key: "ih7n3h"
            }
        ],
        [
            "path",
            {
                d: "m7 10 5 5 5-5",
                key: "brsn70"
            }
        ]
    ]
};
__iconData.node;
const Download = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/download.mjs [app-ssr] (ecmascript) <export default as Download>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Download",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/download.mjs [app-ssr] (ecmascript)");
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/zoom-in.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>ZoomIn
]);
/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "zoom-in",
    size: 24,
    node: [
        [
            "circle",
            {
                cx: "11",
                cy: "11",
                r: "8",
                key: "4ej97u"
            }
        ],
        [
            "line",
            {
                x1: "21",
                x2: "16.65",
                y1: "21",
                y2: "16.65",
                key: "13gj7c"
            }
        ],
        [
            "line",
            {
                x1: "11",
                x2: "11",
                y1: "8",
                y2: "14",
                key: "1vmskp"
            }
        ],
        [
            "line",
            {
                x1: "8",
                x2: "14",
                y1: "11",
                y2: "11",
                key: "durymu"
            }
        ]
    ]
};
__iconData.node;
const ZoomIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/zoom-in.mjs [app-ssr] (ecmascript) <export default as ZoomIn>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ZoomIn",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/zoom-in.mjs [app-ssr] (ecmascript)");
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/zoom-out.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>ZoomOut
]);
/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "zoom-out",
    size: 24,
    node: [
        [
            "circle",
            {
                cx: "11",
                cy: "11",
                r: "8",
                key: "4ej97u"
            }
        ],
        [
            "line",
            {
                x1: "21",
                x2: "16.65",
                y1: "21",
                y2: "16.65",
                key: "13gj7c"
            }
        ],
        [
            "line",
            {
                x1: "8",
                x2: "14",
                y1: "11",
                y2: "11",
                key: "durymu"
            }
        ]
    ]
};
__iconData.node;
const ZoomOut = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/zoom-out.mjs [app-ssr] (ecmascript) <export default as ZoomOut>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ZoomOut",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/zoom-out.mjs [app-ssr] (ecmascript)");
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Maximize2
]);
/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "maximize-2",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M15 3h6v6",
                key: "1q9fwt"
            }
        ],
        [
            "path",
            {
                d: "m21 3-7 7",
                key: "1l2asr"
            }
        ],
        [
            "path",
            {
                d: "m3 21 7-7",
                key: "tjx5ai"
            }
        ],
        [
            "path",
            {
                d: "M9 21H3v-6",
                key: "wtvkvv"
            }
        ]
    ]
};
__iconData.node;
const Maximize2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs [app-ssr] (ecmascript) <export default as Maximize2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Maximize2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs [app-ssr] (ecmascript)");
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/save.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Save
]);
/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "save",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
                key: "1c8476"
            }
        ],
        [
            "path",
            {
                d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
                key: "1ydtos"
            }
        ],
        [
            "path",
            {
                d: "M7 3v4a1 1 0 0 0 1 1h7",
                key: "t51u73"
            }
        ]
    ]
};
__iconData.node;
const Save = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/save.mjs [app-ssr] (ecmascript) <export default as Save>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Save",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/save.mjs [app-ssr] (ecmascript)");
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/check.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconData",
    ()=>__iconData,
    "default",
    ()=>Check
]);
/**
 * @license lucide-react v1.45.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-ssr] (ecmascript)");
;
const __iconData = {
    name: "check",
    size: 24,
    node: [
        [
            "path",
            {
                d: "M20 6 9 17l-5-5",
                key: "1gmf2c"
            }
        ]
    ]
};
__iconData.node;
const Check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(__iconData);
;
}),
"[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/check.mjs [app-ssr] (ecmascript) <export default as Check>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Check",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/check.mjs [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=Desktop_build-seo-optimized-coloring-website_0cry0-e._.js.map