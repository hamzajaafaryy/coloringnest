module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/Desktop/build-seo-optimized-coloring-website/src/lib/data/coloringPages.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COLORING_PAGES",
    ()=>COLORING_PAGES,
    "getPageBySlug",
    ()=>getPageBySlug,
    "getPagesByCategory",
    ()=>getPagesByCategory,
    "getRelatedPages",
    ()=>getRelatedPages
]);
// SVG Builder helper for clean colorable SVG paths
const createSvg = (paths)=>`
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" class="coloring-svg w-full h-full select-none" style="background:#ffffff;">
  <g class="coloring-layer">
    ${paths}
  </g>
</svg>
`.trim();
const COLORING_PAGES = [
    // UNICORN CATEGORY
    {
        id: "page-unicorn-01",
        slug: "unicorn-rainbow-coloring-page",
        title: "Unicorn Rainbow Coloring Page",
        categorySlug: "unicorn",
        description: "Enjoy this free unicorn rainbow coloring page! Featuring a cute magical unicorn sitting happily under a starry rainbow and soft fluffy clouds.",
        instructions: "Pick your favorite pastel colors from the palette. Click or tap inside the unicorn's mane, horn, and rainbow arches to fill them with color. Use the brush tool for detailed shading!",
        svgContent: createSvg(`
      <!-- Background Stars -->
      <polygon points="100,80 105,95 120,95 108,105 112,120 100,110 88,120 92,105 80,95 95,95" fill="#ffffff" stroke="#111827" stroke-width="3" stroke-linejoin="round"/>
      <polygon points="500,100 504,112 516,112 506,120 510,132 500,124 490,132 494,120 484,112 496,112" fill="#ffffff" stroke="#111827" stroke-width="3" stroke-linejoin="round"/>
      <polygon points="450,220 453,230 463,230 455,236 458,246 450,240 442,246 445,236 437,230 447,230" fill="#ffffff" stroke="#111827" stroke-width="3" stroke-linejoin="round"/>
      
      <!-- Rainbow Arches -->
      <path d="M 50,450 A 250,250 0 0,1 550,450" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <path d="M 80,450 A 220,220 0 0,1 520,450" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <path d="M 110,450 A 190,190 0 0,1 490,450" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <path d="M 140,450 A 160,160 0 0,1 460,450" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Left Cloud -->
      <path d="M 40,480 Q 20,440 60,420 Q 90,380 140,410 Q 180,390 200,430 Q 230,460 190,490 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Right Cloud -->
      <path d="M 410,480 Q 380,440 420,410 Q 450,380 490,410 Q 530,420 540,460 Q 560,490 510,500 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Unicorn Body -->
      <path d="M 230,340 C 210,380 200,450 220,500 L 380,500 C 400,450 390,380 370,340 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      
      <!-- Unicorn Legs/Hooves -->
      <path d="M 230,440 L 230,500 L 270,500 L 270,440 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 330,440 L 330,500 L 370,500 L 370,440 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Unicorn Head -->
      <path d="M 240,250 C 220,280 230,340 300,340 C 370,340 380,280 360,250 C 350,200 250,200 240,250 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Muzzle & Mouth -->
      <ellipse cx="300" cy="300" rx="35" ry="25" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="288" cy="295" r="3" fill="#111827"/>
      <circle cx="312" cy="295" r="3" fill="#111827"/>
      <path d="M 292,310 Q 300,320 308,310" fill="none" stroke="#111827" stroke-width="3" stroke-linecap="round"/>

      <!-- Eyes -->
      <ellipse cx="270" cy="255" rx="8" ry="12" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="270" cy="255" r="4" fill="#111827"/>
      <ellipse cx="330" cy="255" rx="8" ry="12" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="330" cy="255" r="4" fill="#111827"/>

      <!-- Ears -->
      <path d="M 235,210 Q 210,160 245,190 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 365,210 Q 390,160 355,190 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Magical Horn -->
      <path d="M 285,200 L 300,90 L 315,200 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <line x1="289" y1="170" x2="311" y2="170" stroke="#111827" stroke-width="3"/>
      <line x1="293" y1="140" x2="307" y2="140" stroke="#111827" stroke-width="3"/>
      <line x1="296" y1="115" x2="304" y2="115" stroke="#111827" stroke-width="3"/>

      <!-- Mane / Hair -->
      <path d="M 250,200 Q 200,230 220,270 Q 240,300 230,340" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <path d="M 350,200 Q 400,230 380,270 Q 360,300 370,340" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <path d="M 300,200 C 270,160 330,160 300,200" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    `),
        altText: "Unicorn rainbow coloring page for kids and preschoolers",
        seoTitle: "Unicorn Rainbow Coloring Page | Free Printable & Online",
        seoDescription: "Free printable unicorn rainbow coloring page for kids. Color online with interactive flood-fill or download and print at home.",
        tags: [
            "unicorn",
            "rainbow",
            "stars",
            "cute",
            "fantasy",
            "preschool"
        ],
        ageRange: "Preschool (3-5)",
        difficulty: "Easy",
        featured: true,
        popular: true,
        publishedDate: "2026-01-10",
        faqs: [
            {
                question: "How do I color this unicorn page online?",
                answer: "Click the 'Color Online' button to open the editor. Select any color from the palette, then click on the rainbow, mane, or horn to fill!"
            }
        ]
    },
    {
        id: "page-unicorn-02",
        slug: "cute-baby-unicorn-coloring-page",
        title: "Cute Baby Unicorn Coloring Page",
        categorySlug: "unicorn",
        description: "An adorable baby unicorn sitting in a heart flower garden. Easy outline design perfect for toddlers and kindergarten children.",
        instructions: "Choose bright colors for the heart and garden flowers. Use soft pink, purple, and blue for the baby unicorn's mane.",
        svgContent: createSvg(`
      <!-- Hearts in Background -->
      <path d="M 120,120 C 120,90 90,80 80,100 C 70,80 40,90 40,120 C 40,150 80,180 80,180 C 80,180 120,150 120,120 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 540,140 C 540,110 510,100 500,120 C 490,100 460,110 460,140 C 460,170 500,200 500,200 C 500,200 540,170 540,140 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Ground/Grass Line -->
      <path d="M 50,480 Q 150,460 300,480 Q 450,500 550,480" fill="none" stroke="#111827" stroke-width="4"/>

      <!-- Flowers -->
      <circle cx="100" cy="460" r="15" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="100" cy="460" r="6" fill="#ffffff" stroke="#111827" stroke-width="2"/>
      <circle cx="500" cy="460" r="15" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="500" cy="460" r="6" fill="#ffffff" stroke="#111827" stroke-width="2"/>

      <!-- Baby Unicorn Head -->
      <ellipse cx="300" cy="260" rx="90" ry="75" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      
      <!-- Big Cute Eyes -->
      <circle cx="260" cy="250" r="22" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="260" cy="250" r="14" fill="#111827"/>
      <circle cx="255" cy="245" r="5" fill="#ffffff"/>
      <circle cx="340" cy="250" r="22" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="340" cy="250" r="14" fill="#111827"/>
      <circle cx="335" cy="245" r="5" fill="#ffffff"/>

      <!-- Cheeks -->
      <ellipse cx="230" cy="280" rx="12" ry="8" fill="#ffffff" stroke="#111827" stroke-width="2"/>
      <ellipse cx="370" cy="280" rx="12" ry="8" fill="#ffffff" stroke="#111827" stroke-width="2"/>

      <!-- Muzzle -->
      <ellipse cx="300" cy="290" rx="30" ry="20" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 292,295 Q 300,305 308,295" fill="none" stroke="#111827" stroke-width="3" stroke-linecap="round"/>

      <!-- Horn -->
      <polygon points="285,190 300,90 315,190" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <line x1="290" y1="160" x2="310" y2="160" stroke="#111827" stroke-width="3"/>
      <line x1="294" y1="125" x2="306" y2="125" stroke="#111827" stroke-width="3"/>

      <!-- Ears -->
      <path d="M 220,200 Q 180,140 225,170 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 380,200 Q 420,140 375,170 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Body -->
      <path d="M 240,330 Q 200,420 250,470 L 350,470 Q 400,420 360,330 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      
      <!-- Paws -->
      <ellipse cx="270" cy="450" rx="20" ry="15" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <ellipse cx="330" cy="450" rx="20" ry="15" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    `),
        altText: "Cute baby unicorn coloring page with hearts and flowers",
        seoTitle: "Cute Baby Unicorn Coloring Page | Free Printable & Online",
        seoDescription: "Color this cute baby unicorn online or print out the free black-and-white coloring sheet for toddlers and kindergarten kids.",
        tags: [
            "unicorn",
            "baby",
            "cute",
            "hearts",
            "flowers",
            "toddler"
        ],
        ageRange: "Toddlers (2-4)",
        difficulty: "Easy",
        featured: true,
        popular: true,
        publishedDate: "2026-01-12"
    },
    // DINOSAUR CATEGORY
    {
        id: "page-dino-01",
        slug: "t-rex-dinosaur-coloring-page",
        title: "T-Rex Dinosaur Coloring Page",
        categorySlug: "dinosaurs",
        description: "Roar into action with a mighty Tyrannosaurus Rex standing in a prehistoric jungle with volcanoes and palm trees.",
        instructions: "Fill the T-Rex with greens, browns, or fun fantasy colors. Don't forget to color the background volcano and palm trees!",
        svgContent: createSvg(`
      <!-- Volcano in Background -->
      <polygon points="120,380 220,200 280,200 380,380" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <path d="M 220,200 Q 250,220 280,200" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 230,180 Q 210,140 190,120 M 250,180 L 250,110 M 270,180 Q 290,140 310,120" stroke="#111827" stroke-width="4" stroke-linecap="round"/>

      <!-- Sun/Clouds -->
      <circle cx="100" cy="120" r="40" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- T-Rex Body -->
      <path d="M 260,260 C 230,220 270,140 370,150 C 420,150 450,190 410,230 C 460,250 480,320 440,400 C 490,420 540,450 560,500 L 480,480 C 420,440 380,440 340,480 L 300,480 C 280,400 240,320 260,260 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Eye & Snout -->
      <circle cx="350" cy="180" r="10" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="350" cy="180" r="5" fill="#111827"/>
      <path d="M 370,210 L 440,210" fill="none" stroke="#111827" stroke-width="3"/>
      
      <!-- Teeth -->
      <polygon points="380,210 385,225 390,210" fill="#ffffff" stroke="#111827" stroke-width="2"/>
      <polygon points="400,210 405,225 410,210" fill="#ffffff" stroke="#111827" stroke-width="2"/>
      <polygon points="420,210 425,225 430,210" fill="#ffffff" stroke="#111827" stroke-width="2"/>

      <!-- Tiny Arms -->
      <path d="M 340,280 Q 370,290 360,310 L 350,305" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Big Feet -->
      <path d="M 310,440 L 310,530 L 260,530 L 280,440 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <path d="M 390,440 L 390,530 L 340,530 L 360,440 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Claws -->
      <polygon points="260,530 250,545 270,530" fill="#ffffff" stroke="#111827" stroke-width="2"/>
      <polygon points="340,530 330,545 350,530" fill="#ffffff" stroke="#111827" stroke-width="2"/>
    `),
        altText: "T-Rex dinosaur coloring page with volcano and jungle landscape",
        seoTitle: "T-Rex Dinosaur Coloring Page | Free Printable & Online",
        seoDescription: "Free printable T-Rex dinosaur coloring sheet for kids. Color online or download high-resolution PNG for printing.",
        tags: [
            "dinosaur",
            "t-rex",
            "prehistoric",
            "volcano",
            "kids"
        ],
        ageRange: "Kids (6-10)",
        difficulty: "Medium",
        featured: true,
        popular: true,
        publishedDate: "2026-01-08"
    },
    {
        id: "page-dino-02",
        slug: "cute-baby-triceratops-coloring-page",
        title: "Cute Baby Triceratops Coloring Page",
        categorySlug: "dinosaurs",
        description: "A friendly baby Triceratops with three horns standing in a field of prehistoric ferns and big leaves.",
        instructions: "Color the frill around Triceratops' head with decorative patterns and bright colors.",
        svgContent: createSvg(`
      <!-- Prehistoric Leaves -->
      <path d="M 60,350 Q 120,300 100,450 Q 40,400 60,350 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 500,350 Q 560,300 540,450 Q 480,400 500,350 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Head Frill -->
      <path d="M 180,240 C 150,150 450,150 420,240 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <circle cx="210" cy="180" r="12" fill="#ffffff" stroke="#111827" stroke-width="2"/>
      <circle cx="260" cy="155" r="12" fill="#ffffff" stroke="#111827" stroke-width="2"/>
      <circle cx="300" cy="145" r="12" fill="#ffffff" stroke="#111827" stroke-width="2"/>
      <circle cx="340" cy="155" r="12" fill="#ffffff" stroke="#111827" stroke-width="2"/>
      <circle cx="390" cy="180" r="12" fill="#ffffff" stroke="#111827" stroke-width="2"/>

      <!-- Triceratops Face -->
      <ellipse cx="300" cy="270" rx="90" ry="70" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      
      <!-- Horns -->
      <polygon points="230,220 210,130 250,210" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <polygon points="370,220 390,130 350,210" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <polygon points="290,290 300,250 310,290" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Cute Eyes -->
      <circle cx="250" cy="260" r="15" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="250" cy="260" r="8" fill="#111827"/>
      <circle cx="350" cy="260" r="15" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="350" cy="260" r="8" fill="#111827"/>

      <!-- Mouth -->
      <path d="M 280,310 Q 300,325 320,310" fill="none" stroke="#111827" stroke-width="3" stroke-linecap="round"/>

      <!-- Body -->
      <path d="M 220,330 C 180,400 180,480 250,500 L 350,500 C 420,480 420,400 380,330 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      
      <!-- Legs -->
      <path d="M 230,450 L 230,520 L 270,520 L 270,450 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 330,450 L 330,520 L 370,520 L 370,450 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    `),
        altText: "Cute baby Triceratops dinosaur coloring sheet for kids",
        seoTitle: "Cute Baby Triceratops Coloring Page | Free Printable & Online",
        seoDescription: "Free printable baby Triceratops coloring page for preschoolers and kids. Color online or download for printing.",
        tags: [
            "dinosaur",
            "triceratops",
            "baby",
            "cute",
            "preschool"
        ],
        ageRange: "Preschool (3-5)",
        difficulty: "Easy",
        featured: false,
        popular: true,
        publishedDate: "2026-01-14"
    },
    // ANIMALS CATEGORY
    {
        id: "page-anim-01",
        slug: "playful-cat-and-yarn-coloring-page",
        title: "Playful Cat & Ball of Yarn Coloring Page",
        categorySlug: "animals",
        description: "An adorable fluffy kitten playing with a big ball of yarn. Simple and joyful coloring fun for animal lovers.",
        instructions: "Color the cat orange, gray, white, or black! Use bright red, blue, or yellow for the swirling yarn thread.",
        svgContent: createSvg(`
      <!-- Yarn Threads on Floor -->
      <path d="M 80,480 Q 200,420 320,490 Q 440,430 520,480" fill="none" stroke="#111827" stroke-width="4"/>

      <!-- Ball of Yarn -->
      <circle cx="430" cy="420" r="60" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <path d="M 380,400 Q 430,370 470,410" fill="none" stroke="#111827" stroke-width="3"/>
      <path d="M 390,430 Q 430,460 480,420" fill="none" stroke="#111827" stroke-width="3"/>
      <path d="M 410,380 Q 450,420 420,470" fill="none" stroke="#111827" stroke-width="3"/>

      <!-- Cat Body -->
      <path d="M 160,320 C 120,380 140,480 240,480 L 320,480 C 360,480 380,400 320,340 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Cat Tail -->
      <path d="M 140,420 C 80,400 60,320 100,280 C 110,270 120,280 115,295 C 85,325 100,380 150,400 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Cat Head -->
      <circle cx="240" cy="240" r="75" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Cat Ears -->
      <polygon points="180,180 170,100 220,165" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <polygon points="300,180 310,100 260,165" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Face Details -->
      <ellipse cx="205" cy="230" rx="12" ry="16" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="205" cy="230" r="7" fill="#111827"/>
      <ellipse cx="275" cy="230" rx="12" ry="16" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="275" cy="230" r="7" fill="#111827"/>

      <!-- Nose & Mouth -->
      <polygon points="235,250 245,250 240,258" fill="#111827" stroke="#111827" stroke-width="2"/>
      <path d="M 230,265 Q 240,275 250,265" fill="none" stroke="#111827" stroke-width="3" stroke-linecap="round"/>

      <!-- Whiskers -->
      <line x1="160" y1="240" x2="200" y2="248" stroke="#111827" stroke-width="3"/>
      <line x1="155" y1="258" x2="198" y2="258" stroke="#111827" stroke-width="3"/>
      <line x1="320" y1="240" x2="280" y2="248" stroke="#111827" stroke-width="3"/>
      <line x1="325" y1="258" x2="282" y2="258" stroke="#111827" stroke-width="3"/>
    `),
        altText: "Playful kitten cat playing with ball of yarn coloring page",
        seoTitle: "Playful Cat & Yarn Coloring Page | Free Printable & Online",
        seoDescription: "Free cat coloring page featuring a cute kitten playing with yarn. Color online or download printable PDF/PNG sheet.",
        tags: [
            "cat",
            "kitten",
            "pets",
            "yarn",
            "animals",
            "cute"
        ],
        ageRange: "Preschool (3-5)",
        difficulty: "Easy",
        featured: true,
        popular: true,
        publishedDate: "2026-01-05"
    },
    {
        id: "page-anim-02",
        slug: "happy-golden-retriever-dog-coloring-page",
        title: "Happy Golden Retriever Dog Coloring Page",
        categorySlug: "animals",
        description: "A friendly golden retriever dog wagging its tail next to a dog house and bone.",
        instructions: "Color the dog with warm golden or brown tones. Add a red collar and bright blue dog house!",
        svgContent: createSvg(`
      <!-- Dog House -->
      <polygon points="420,280 500,200 580,280" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <rect x="430" y="280" width="140" height="180" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <path d="M 470,460 A 30,50 0 0,1 530,460 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Dog Body -->
      <path d="M 180,280 C 130,320 120,440 200,470 L 320,470 C 370,440 360,340 300,300 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Paws -->
      <rect x="200" y="440" width="40" height="40" rx="10" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <rect x="280" y="440" width="40" height="40" rx="10" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Dog Head -->
      <ellipse cx="240" cy="220" rx="65" ry="55" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Floppy Ears -->
      <path d="M 175,200 Q 130,220 150,280 Q 185,270 185,220 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 305,200 Q 350,220 330,280 Q 295,270 295,220 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Muzzle & Tongue -->
      <ellipse cx="240" cy="240" rx="25" ry="20" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <ellipse cx="240" cy="230" rx="10" ry="7" fill="#111827"/>
      <path d="M 235,250 Q 240,270 245,250" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Eyes -->
      <circle cx="215" cy="205" r="8" fill="#111827"/>
      <circle cx="265" cy="205" r="8" fill="#111827"/>

      <!-- Dog Bone on Floor -->
      <path d="M 120,480 C 110,470 90,470 90,485 C 90,500 110,500 120,490 L 160,490 C 170,500 190,500 190,485 C 190,470 170,470 160,480 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    `),
        altText: "Happy golden retriever dog sitting by dog house coloring page",
        seoTitle: "Happy Dog Coloring Page | Free Printable & Online",
        seoDescription: "Free dog coloring page featuring a cute golden retriever. Color online or print for free at home.",
        tags: [
            "dog",
            "puppy",
            "pets",
            "animals",
            "kids"
        ],
        ageRange: "Kids (6-10)",
        difficulty: "Easy",
        featured: false,
        popular: true,
        publishedDate: "2026-01-09"
    },
    // PRINCESSES CATEGORY
    {
        id: "page-prnc-01",
        slug: "princess-in-fairytale-castle-garden-coloring-page",
        title: "Princess in Fairytale Castle Garden",
        categorySlug: "princesses",
        description: "A beautiful princess wearing a majestic ball gown holding a magic wand in a castle garden.",
        instructions: "Use glittery pinks, purples, and gold for the princess gown and crown. Color the castle towers in the background!",
        svgContent: createSvg(`
      <!-- Castle Towers in Background -->
      <rect x="100" y="150" width="80" height="200" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <polygon points="100,150 140,80 180,150" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      
      <rect x="420" y="150" width="80" height="200" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <polygon points="420,150 460,80 500,150" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Princess Dress / Gown -->
      <path d="M 270,300 L 160,520 Q 300,550 440,520 L 330,300 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <path d="M 230,370 C 270,390 330,390 370,370" fill="none" stroke="#111827" stroke-width="3"/>
      <path d="M 200,440 C 270,470 330,470 400,440" fill="none" stroke="#111827" stroke-width="3"/>

      <!-- Torso -->
      <path d="M 270,230 L 260,300 L 340,300 L 330,230 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Arms & Magic Wand -->
      <path d="M 260,240 L 210,280" fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round"/>
      <path d="M 340,240 L 380,260 L 410,220" fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round"/>
      <!-- Star on Wand -->
      <polygon points="410,220 413,227 420,227 415,232 417,239 410,235 403,239 405,232 400,227 407,227" fill="#ffffff" stroke="#111827" stroke-width="2"/>

      <!-- Princess Head & Hair -->
      <circle cx="300" cy="180" r="35" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <path d="M 255,180 Q 230,240 260,290" fill="none" stroke="#111827" stroke-width="3"/>
      <path d="M 345,180 Q 370,240 340,290" fill="none" stroke="#111827" stroke-width="3"/>

      <!-- Crown -->
      <polygon points="280,148 285,125 292,142 300,120 308,142 315,125 320,148" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Eyes & Smile -->
      <circle cx="288" cy="175" r="4" fill="#111827"/>
      <circle cx="312" cy="175" r="4" fill="#111827"/>
      <path d="M 292,192 Q 300,200 308,192" fill="none" stroke="#111827" stroke-width="2"/>
    `),
        altText: "Fairytale princess in ballgown with wand and castle coloring page",
        seoTitle: "Princess in Fairytale Castle Coloring Page | Free Printable & Online",
        seoDescription: "Free printable princess coloring page. Color beautiful fairytale gown and castle online or print high resolution coloring sheet.",
        tags: [
            "princess",
            "castle",
            "fairytale",
            "gown",
            "magic",
            "kids"
        ],
        ageRange: "Kids (6-10)",
        difficulty: "Medium",
        featured: true,
        popular: true,
        publishedDate: "2026-01-11"
    },
    // VEHICLES CATEGORY
    {
        id: "page-veh-01",
        slug: "sleek-sports-car-coloring-page",
        title: "Sleek Sports Car Coloring Page",
        categorySlug: "vehicles",
        description: "A fast, modern sports car racing down a highway with clouds and mountains in the background.",
        instructions: "Give this racing sports car a vibrant red, blue, or yellow finish! Color the wheels charcoal or silver.",
        svgContent: createSvg(`
      <!-- Road -->
      <line x1="20" y1="480" x2="580" y2="480" stroke="#111827" stroke-width="5"/>
      <line x1="80" y1="520" x2="160" y2="520" stroke="#111827" stroke-width="4" stroke-dasharray="20,10"/>
      <line x1="280" y1="520" x2="360" y2="520" stroke="#111827" stroke-width="4" stroke-dasharray="20,10"/>
      <line x1="480" y1="520" x2="560" y2="520" stroke="#111827" stroke-width="4" stroke-dasharray="20,10"/>

      <!-- Sports Car Body -->
      <path d="M 60,420 Q 80,360 160,340 L 260,260 Q 360,240 440,320 L 520,360 Q 560,380 550,420 L 60,420 Z" fill="#ffffff" stroke="#111827" stroke-width="5"/>

      <!-- Windows -->
      <path d="M 270,275 L 350,270 L 410,320 L 280,320 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Wheels -->
      <circle cx="160" cy="420" r="45" fill="#ffffff" stroke="#111827" stroke-width="5"/>
      <circle cx="160" cy="420" r="25" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="440" cy="420" r="45" fill="#ffffff" stroke="#111827" stroke-width="5"/>
      <circle cx="440" cy="420" r="25" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Headlight -->
      <polygon points="530,375 550,385 530,395" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    `),
        altText: "Sleek sports racing car on highway coloring page",
        seoTitle: "Sleek Sports Car Coloring Page | Free Printable & Online",
        seoDescription: "Free sports car coloring page. Color modern race car online or print free sheet for kids and auto fans.",
        tags: [
            "car",
            "sports car",
            "vehicles",
            "racing",
            "speed"
        ],
        ageRange: "Kids (6-10)",
        difficulty: "Medium",
        featured: true,
        popular: true,
        publishedDate: "2026-01-07"
    },
    {
        id: "page-veh-02",
        slug: "fire-truck-emergency-coloring-page",
        title: "Fire Truck Emergency Vehicle Coloring Page",
        categorySlug: "vehicles",
        description: "A heroic fire engine equipped with ladder, flashing emergency lights, and water hose.",
        instructions: "Color the body bright fire engine red! Add yellow and blue for emergency flashing lights.",
        svgContent: createSvg(`
      <!-- Fire Truck Main Body -->
      <rect x="80" y="240" width="360" height="180" rx="10" fill="#ffffff" stroke="#111827" stroke-width="5"/>
      <!-- Cab -->
      <path d="M 440,280 L 520,280 L 540,360 L 540,420 L 440,420 Z" fill="#ffffff" stroke="#111827" stroke-width="5"/>
      <!-- Windshield -->
      <polygon points="450,290 510,290 525,350 450,350" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Ladder on Top -->
      <rect x="120" y="190" width="280" height="30" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <line x1="160" y1="190" x2="160" y2="220" stroke="#111827" stroke-width="3"/>
      <line x1="200" y1="190" x2="200" y2="220" stroke="#111827" stroke-width="3"/>
      <line x1="240" y1="190" x2="240" y2="220" stroke="#111827" stroke-width="3"/>
      <line x1="280" y1="190" x2="280" y2="220" stroke="#111827" stroke-width="3"/>
      <line x1="320" y1="190" x2="320" y2="220" stroke="#111827" stroke-width="3"/>
      <line x1="360" y1="190" x2="360" y2="220" stroke="#111827" stroke-width="3"/>

      <!-- Siren Light -->
      <rect x="470" y="250" width="30" height="20" rx="5" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Wheels -->
      <circle cx="160" cy="420" r="40" fill="#ffffff" stroke="#111827" stroke-width="5"/>
      <circle cx="160" cy="420" r="20" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <circle cx="340" cy="420" r="40" fill="#ffffff" stroke="#111827" stroke-width="5"/>
      <circle cx="340" cy="420" r="20" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <circle cx="480" cy="420" r="40" fill="#ffffff" stroke="#111827" stroke-width="5"/>
      <circle cx="480" cy="420" r="20" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    `),
        altText: "Heroic fire truck engine with ladder coloring page",
        seoTitle: "Fire Truck Coloring Page | Free Printable & Online",
        seoDescription: "Free printable fire truck coloring sheet for kids. Color emergency fire engine online or print for free.",
        tags: [
            "fire truck",
            "vehicles",
            "emergency",
            "rescue",
            "kids"
        ],
        ageRange: "Preschool (3-5)",
        difficulty: "Easy",
        featured: false,
        popular: true,
        publishedDate: "2026-01-13"
    },
    // HOLIDAYS & SEASONS CATEGORY
    {
        id: "page-hol-01",
        slug: "christmas-tree-and-snowman-coloring-page",
        title: "Christmas Tree & Snowman Coloring Page",
        categorySlug: "christmas",
        description: "A decorated Christmas tree with glowing star and ornaments next to a smiling winter snowman.",
        instructions: "Color the Christmas tree green, ornaments gold and red, and the snowman with a bright orange carrot nose and cozy scarf!",
        svgContent: createSvg(`
      <!-- Star on Top -->
      <polygon points="200,60 206,80 226,80 210,92 216,112 200,100 184,112 190,92 174,80 194,80" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Christmas Tree Layers -->
      <polygon points="200,100 130,190 270,190" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <polygon points="200,160 100,280 300,280" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <polygon points="200,240 70,380 330,380" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Ornaments -->
      <circle cx="160" cy="220" r="12" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="230" cy="230" r="12" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="130" cy="330" r="14" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="200" cy="320" r="14" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="270" cy="340" r="14" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Tree Trunk & Presents -->
      <rect x="175" y="380" width="50" height="60" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <rect x="100" y="410" width="60" height="50" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <rect x="240" y="400" width="70" height="60" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Snowman -->
      <circle cx="440" cy="400" r="60" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <circle cx="440" cy="300" r="45" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <circle cx="440" cy="220" r="32" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Carrot Nose & Top Hat -->
      <polygon points="440,220 480,225 440,230" fill="#ffffff" stroke="#111827" stroke-width="2"/>
      <rect x="410" y="170" width="60" height="20" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <rect x="420" y="130" width="40" height="40" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    `),
        altText: "Christmas tree with ornaments and friendly snowman coloring page",
        seoTitle: "Christmas Tree & Snowman Coloring Page | Free Printable & Online",
        seoDescription: "Free printable Christmas tree and snowman coloring sheet. Color online or download PNG for holiday activity.",
        tags: [
            "christmas",
            "snowman",
            "christmas tree",
            "holidays",
            "winter"
        ],
        ageRange: "Kids (6-10)",
        difficulty: "Medium",
        featured: true,
        popular: true,
        publishedDate: "2026-01-02"
    },
    {
        id: "page-hol-02",
        slug: "halloween-pumpkin-jack-o-lantern-coloring-page",
        title: "Halloween Jack-o'-Lantern Pumpkin Coloring Page",
        categorySlug: "halloween",
        description: "A carved smiling Halloween pumpkin with a witch hat surrounded by bats and a crescent moon.",
        instructions: "Color the pumpkin bright orange with yellow glowing eyes! Add dark purple or black for the night sky.",
        svgContent: createSvg(`
      <!-- Moon -->
      <path d="M 450,80 A 60,60 0 1,0 530,160 A 50,50 0 1,1 450,80 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Bats -->
      <path d="M 100,120 Q 120,100 140,120 Q 160,100 180,120 Q 140,150 100,120 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Big Pumpkin Body -->
      <ellipse cx="300" cy="350" rx="180" ry="130" fill="#ffffff" stroke="#111827" stroke-width="5"/>
      <path d="M 230,225 C 200,300 200,400 230,475" fill="none" stroke="#111827" stroke-width="3"/>
      <path d="M 370,225 C 400,300 400,400 370,475" fill="none" stroke="#111827" stroke-width="3"/>

      <!-- Pumpkin Stem / Witch Hat -->
      <polygon points="220,230 300,80 380,230" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <ellipse cx="300" cy="230" rx="100" ry="20" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Carved Face -->
      <polygon points="220,300 250,330 220,330" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <polygon points="380,300 350,330 380,330" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <polygon points="290,340 310,340 300,360" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Smiling Mouth with Teeth -->
      <path d="M 210,380 Q 300,450 390,380 Z" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <rect x="250" y="390" width="20" height="20" fill="#ffffff" stroke="#111827" stroke-width="2"/>
      <rect x="330" y="390" width="20" height="20" fill="#ffffff" stroke="#111827" stroke-width="2"/>
    `),
        altText: "Carved Halloween Jack-o-lantern pumpkin with witch hat coloring page",
        seoTitle: "Halloween Pumpkin Coloring Page | Free Printable & Online",
        seoDescription: "Free Halloween jack-o-lantern coloring page for kids. Color online or download printable sheet.",
        tags: [
            "halloween",
            "pumpkin",
            "jack-o-lantern",
            "witch",
            "spooky"
        ],
        ageRange: "Kids (6-10)",
        difficulty: "Medium",
        featured: true,
        popular: true,
        publishedDate: "2026-01-03"
    },
    // OCEAN & SEA LIFE
    {
        id: "page-ocn-01",
        slug: "happy-dolphin-ocean-wave-coloring-page",
        title: "Happy Dolphin Jumping Ocean Wave",
        categorySlug: "ocean",
        description: "A joyful dolphin leaping high above rolling ocean waves with sea turtles and bubbles below.",
        instructions: "Color the dolphin ocean blue or silver-gray. Use aquamarine shades for the sea waves!",
        svgContent: createSvg(`
      <!-- Sun in Sky -->
      <circle cx="500" cy="100" r="40" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Dolphin Body Leaping -->
      <path d="M 120,380 C 140,200 320,120 480,220 C 440,260 380,260 320,280 C 260,300 200,360 120,380 Z" fill="#ffffff" stroke="#111827" stroke-width="5"/>

      <!-- Dolphin Fins -->
      <polygon points="300,165 340,110 350,180" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <polygon points="260,290 280,340 310,290" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Tail Fluke -->
      <path d="M 120,380 Q 80,340 60,370 Q 100,400 120,380 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 120,380 Q 80,420 60,390 Q 100,360 120,380 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Eye & Mouth -->
      <circle cx="440" cy="210" r="5" fill="#111827"/>
      <path d="M 450,230 Q 470,235 480,220" fill="none" stroke="#111827" stroke-width="3"/>

      <!-- Ocean Waves below -->
      <path d="M 20,440 Q 100,380 180,440 Q 260,500 340,440 Q 420,380 500,440 Q 550,480 580,440" fill="none" stroke="#111827" stroke-width="5"/>
      <path d="M 20,500 Q 120,450 220,500 Q 320,550 420,500 Q 520,450 580,500" fill="none" stroke="#111827" stroke-width="4"/>
    `),
        altText: "Happy dolphin leaping over ocean waves coloring page",
        seoTitle: "Dolphin Ocean Wave Coloring Page | Free Printable & Online",
        seoDescription: "Free printable dolphin coloring sheet. Color leaping dolphin online or download high quality PNG.",
        tags: [
            "dolphin",
            "ocean",
            "sea life",
            "waves",
            "animals"
        ],
        ageRange: "Kids (6-10)",
        difficulty: "Medium",
        featured: false,
        popular: true,
        publishedDate: "2026-01-06"
    },
    // SPACE CATEGORY
    {
        id: "page-spc-01",
        slug: "astronaut-exploring-moon-space-coloring-page",
        title: "Astronaut Exploring Moon & Space",
        categorySlug: "space",
        description: "An astronaut floating in outer space near Saturn, planets, shooting stars, and a rocket ship.",
        instructions: "Color the space suit white with blue and red patches. Fill deep space with dark indigo and bright yellow stars!",
        svgContent: createSvg(`
      <!-- Planets -->
      <circle cx="120" cy="120" r="40" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <ellipse cx="120" cy="120" rx="70" ry="15" fill="none" stroke="#111827" stroke-width="3"/>

      <!-- Rocket Ship -->
      <polygon points="480,100 520,180 440,180" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <rect x="450" y="180" width="60" height="90" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <circle cx="480" cy="220" r="15" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Astronaut Suit -->
      <!-- Helmet -->
      <circle cx="280" cy="220" r="50" fill="#ffffff" stroke="#111827" stroke-width="5"/>
      <ellipse cx="280" cy="220" rx="35" ry="25" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Body Suit -->
      <rect x="235" y="270" width="90" height="130" rx="20" fill="#ffffff" stroke="#111827" stroke-width="5"/>

      <!-- Arms -->
      <path d="M 235,290 C 180,300 170,360 210,380" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
      <path d="M 325,290 C 380,300 390,360 350,380" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round"/>

      <!-- Boots -->
      <rect x="240" y="400" width="35" height="60" rx="10" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <rect x="285" y="400" width="35" height="60" rx="10" fill="#ffffff" stroke="#111827" stroke-width="4"/>
    `),
        altText: "Astronaut floating in space with rocket ship and planet coloring page",
        seoTitle: "Astronaut in Outer Space Coloring Page | Free Printable & Online",
        seoDescription: "Free space astronaut coloring sheet for kids. Color online or download printable PNG.",
        tags: [
            "space",
            "astronaut",
            "rocket",
            "planets",
            "stars"
        ],
        ageRange: "Kids (6-10)",
        difficulty: "Medium",
        featured: false,
        popular: true,
        publishedDate: "2026-01-15"
    },
    // MANDALA / ADULTS CATEGORY
    {
        id: "page-man-01",
        slug: "intricate-floral-mandala-coloring-page",
        title: "Intricate Floral Zen Mandala",
        categorySlug: "mandala",
        description: "A detailed floral mandala pattern designed for mindfulness, focus, and relaxing adult art therapy.",
        instructions: "Select a harmonious color scheme (like sunset warm tones or oceanic blues). Color the concentric petals outwards.",
        svgContent: createSvg(`
      <circle cx="300" cy="300" r="260" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <circle cx="300" cy="300" r="210" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="300" cy="300" r="160" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="300" cy="300" r="100" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <circle cx="300" cy="300" r="40" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Petal Rings -->
      <path d="M 300,140 Q 340,200 300,260 Q 260,200 300,140 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 300,340 Q 340,400 300,460 Q 260,400 300,340 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 140,300 Q 200,340 260,300 Q 200,260 140,300 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 340,300 Q 400,340 460,300 Q 400,260 340,300 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Diagonal Petals -->
      <path d="M 187,187 Q 250,220 250,250 Q 220,250 187,187 Z" fill="#ffffff" stroke="#111827" stroke-width="2"/>
      <path d="M 413,187 Q 350,220 350,250 Q 380,250 413,187 Z" fill="#ffffff" stroke="#111827" stroke-width="2"/>
      <path d="M 187,413 Q 250,380 250,350 Q 220,350 187,413 Z" fill="#ffffff" stroke="#111827" stroke-width="2"/>
      <path d="M 413,413 Q 350,380 350,350 Q 380,350 413,413 Z" fill="#ffffff" stroke="#111827" stroke-width="2"/>
    `),
        altText: "Intricate floral mandala coloring page for adult relaxation and mindfulness",
        seoTitle: "Intricate Floral Mandala Coloring Page | Free Printable & Online",
        seoDescription: "Relax with this free printable floral mandala coloring sheet for adults. Color online or download PNG.",
        tags: [
            "mandala",
            "adults",
            "relaxing",
            "floral",
            "mindfulness",
            "detailed"
        ],
        ageRange: "Teens & Adults",
        difficulty: "Detailed",
        featured: true,
        popular: true,
        publishedDate: "2026-01-01"
    },
    // FOOD CATEGORY
    {
        id: "page-fod-01",
        slug: "kawaii-ice-cream-sundae-coloring-page",
        title: "Kawaii Ice Cream Sundae Coloring Page",
        categorySlug: "food",
        description: "A tall delicious ice cream sundae glass with scoops of chocolate, strawberry, and vanilla topped with a cherry.",
        instructions: "Make the scoops vibrant strawberry pink, mint green, and chocolate brown. Color the cherry bright red!",
        svgContent: createSvg(`
      <!-- Sundae Glass Base & Stem -->
      <polygon points="200,500 400,500 370,480 230,480" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <rect x="285" y="380" width="30" height="100" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      
      <!-- Sundae Glass Bowl -->
      <path d="M 180,220 L 220,380 Q 300,420 380,380 L 420,220 Z" fill="#ffffff" stroke="#111827" stroke-width="5"/>

      <!-- Ice Cream Scoops -->
      <circle cx="240" cy="200" r="50" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <circle cx="360" cy="200" r="50" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <circle cx="300" cy="140" r="55" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Cherry on Top -->
      <circle cx="300" cy="70" r="22" fill="#ffffff" stroke="#111827" stroke-width="4"/>
      <path d="M 300,48 Q 330,20 350,30" fill="none" stroke="#111827" stroke-width="3" stroke-linecap="round"/>

      <!-- Cute Kawaii Faces on Glass -->
      <circle cx="260" cy="280" r="8" fill="#111827"/>
      <circle cx="340" cy="280" r="8" fill="#111827"/>
      <path d="M 290,300 Q 300,312 310,300" fill="none" stroke="#111827" stroke-width="3" stroke-linecap="round"/>
    `),
        altText: "Kawaii ice cream sundae glass with cherry coloring page",
        seoTitle: "Kawaii Ice Cream Sundae Coloring Page | Free Printable & Online",
        seoDescription: "Free printable ice cream sundae coloring sheet. Color cute food art online or print for free.",
        tags: [
            "food",
            "ice cream",
            "kawaii",
            "sundae",
            "sweets"
        ],
        ageRange: "Preschool (3-5)",
        difficulty: "Easy",
        featured: false,
        popular: true,
        publishedDate: "2026-01-16"
    },
    // FLOWERS CATEGORY
    {
        id: "page-flw-01",
        slug: "sunflower-and-butterfly-garden-coloring-page",
        title: "Sunflower & Butterfly Garden Coloring Page",
        categorySlug: "flowers",
        description: "A giant smiling sunflower growing in a summer garden with fluttery butterflies and ladybugs.",
        instructions: "Color the sunflower petals golden yellow and orange. Make the butterfly wings colorful with bright blue and purple!",
        svgContent: createSvg(`
      <!-- Butterfly in Sky -->
      <path d="M 450,140 C 400,100 400,180 440,160 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 450,140 C 500,100 500,180 460,160 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <line x1="450" y1="120" x2="450" y2="180" stroke="#111827" stroke-width="4"/>

      <!-- Sunflower Stem & Leaves -->
      <line x1="280" y1="300" x2="280" y2="520" stroke="#111827" stroke-width="12"/>
      <path d="M 280,420 Q 180,380 160,450 Q 240,480 280,420 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 280,460 Q 380,420 400,490 Q 320,520 280,460 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>

      <!-- Sunflower Center -->
      <circle cx="280" cy="220" r="70" fill="#ffffff" stroke="#111827" stroke-width="5"/>

      <!-- Petals around Center -->
      <path d="M 280,150 Q 260,90 280,80 Q 300,90 280,150 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 280,290 Q 260,350 280,360 Q 300,350 280,290 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 210,220 Q 150,200 140,220 Q 150,240 210,220 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
      <path d="M 350,220 Q 410,200 420,220 Q 410,240 350,220 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    `),
        altText: "Sunflower with butterfly garden summer coloring page",
        seoTitle: "Sunflower & Butterfly Coloring Page | Free Printable & Online",
        seoDescription: "Free printable sunflower coloring page. Color beautiful summer flowers online or print at home.",
        tags: [
            "flowers",
            "sunflower",
            "butterfly",
            "garden",
            "nature"
        ],
        ageRange: "Kids (6-10)",
        difficulty: "Medium",
        featured: false,
        popular: true,
        publishedDate: "2026-01-17"
    },
    // PRESCHOOL / ALPHABET
    {
        id: "page-pre-01",
        slug: "alphabet-letter-a-is-for-apple-coloring-page",
        title: "Letter A is for Apple Preschool Coloring Page",
        categorySlug: "preschool",
        description: "Big bold capital letter A alongside a juicy apple with leaf. Ideal for toddler letter recognition and coloring.",
        instructions: "Color the Letter A with bright primary colors. Make the apple red or green!",
        svgContent: createSvg(`
      <!-- Big Letter A -->
      <polygon points="180,480 230,480 260,360 300,360 330,480 380,480 290,120 270,120" fill="#ffffff" stroke="#111827" stroke-width="6"/>
      <polygon points="265,300 295,300 280,220" fill="#ffffff" stroke="#111827" stroke-width="4"/>

      <!-- Apple next to Letter A -->
      <path d="M 450,280 C 420,230 380,280 410,360 C 430,410 470,410 490,360 C 520,280 480,230 450,280 Z" fill="#ffffff" stroke="#111827" stroke-width="5"/>
      <!-- Apple Stem & Leaf -->
      <path d="M 450,250 Q 460,210 450,190" fill="none" stroke="#111827" stroke-width="5" stroke-linecap="round"/>
      <path d="M 450,220 Q 490,200 480,230 Z" fill="#ffffff" stroke="#111827" stroke-width="3"/>
    `),
        altText: "Letter A is for Apple educational preschool coloring page",
        seoTitle: "Letter A is for Apple Coloring Page | Free Printable & Online",
        seoDescription: "Free printable preschool alphabet coloring page for Letter A. Color online or download PNG for early learning.",
        tags: [
            "preschool",
            "alphabet",
            "letter A",
            "apple",
            "educational"
        ],
        ageRange: "Toddlers (2-4)",
        difficulty: "Easy",
        featured: true,
        popular: true,
        publishedDate: "2026-01-04"
    }
];
function getPageBySlug(slug) {
    return COLORING_PAGES.find((p)=>p.slug === slug);
}
function getPagesByCategory(categorySlug) {
    return COLORING_PAGES.filter((p)=>p.categorySlug === categorySlug);
}
function getRelatedPages(currentPage, limit = 6) {
    // First match same category
    const sameCategory = COLORING_PAGES.filter((p)=>p.categorySlug === currentPage.categorySlug && p.slug !== currentPage.slug);
    if (sameCategory.length >= limit) {
        return sameCategory.slice(0, limit);
    }
    // Otherwise fill with tag matches or popular pages
    const remaining = COLORING_PAGES.filter((p)=>p.slug !== currentPage.slug && !sameCategory.some((sc)=>sc.slug === p.slug));
    return [
        ...sameCategory,
        ...remaining
    ].slice(0, limit);
}
}),
"[project]/Desktop/build-seo-optimized-coloring-website/src/lib/data/categories.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CATEGORIES",
    ()=>CATEGORIES,
    "getCategoryBySlug",
    ()=>getCategoryBySlug
]);
const CATEGORIES = [
    {
        id: "cat-unicorn",
        slug: "unicorn",
        name: "Unicorn Coloring Pages",
        description: "Discover magical unicorn coloring pages with rainbows, castles, and cute stars. Perfect for kids, preschoolers, and fantasy lovers.",
        seoTitle: "Free Unicorn Coloring Pages for Kids (Printable & Online) | ColoringNest",
        seoDescription: "Explore our collection of free unicorn coloring pages. Color online or download printable PDF/PNG unicorn sheets for kids and toddlers.",
        iconName: "Sparkles",
        featured: true,
        popular: true,
        heroColor: "from-pink-100 to-purple-100 border-pink-200",
        subcategories: [
            "Cute Unicorns",
            "Rainbow Unicorns",
            "Unicorn Castles",
            "Pegasus & Flying Unicorns"
        ],
        faqs: [
            {
                question: "Are these unicorn coloring pages free to print?",
                answer: "Yes! All unicorn coloring sheets on ColoringNest are 100% free to print at home, color directly in your web browser, or download as PNG images."
            },
            {
                question: "What age are unicorn coloring pages suitable for?",
                answer: "We offer simple unicorn pages for toddlers and preschoolers, as well as detailed, intricate designs for older children and adults."
            }
        ]
    },
    {
        id: "cat-dinosaurs",
        slug: "dinosaurs",
        name: "Dinosaur Coloring Pages",
        description: "Roar into fun with T-Rex, Triceratops, Brachiosaurus, and Velociraptor coloring sheets. Great for young paleontologists!",
        seoTitle: "Free Dinosaur Coloring Pages (T-Rex, Triceratops & More) | ColoringNest",
        seoDescription: "Free printable dinosaur coloring pages for kids. Color T-Rex, raptors, and long-neck dinos online or download high-res coloring sheets.",
        iconName: "Footprints",
        featured: true,
        popular: true,
        heroColor: "from-amber-100 to-emerald-100 border-amber-200",
        subcategories: [
            "T-Rex",
            "Baby Dinosaurs",
            "Herbivores",
            "Prehistoric Landscapes"
        ],
        faqs: [
            {
                question: "Can I color these dinosaur pages on an iPad or tablet?",
                answer: "Absolutely! Our interactive browser coloring tool works seamlessly on iPad, Android tablets, smartphones, and desktop computers."
            }
        ]
    },
    {
        id: "cat-animals",
        slug: "animals",
        name: "Animal Coloring Pages",
        description: "Cute cats, dogs, lions, elephants, pandas, and farm animals. Explore wildlife and domestic pets with easy and detailed outlines.",
        seoTitle: "Free Animal Coloring Pages for Kids & Adults | ColoringNest",
        seoDescription: "Download and print free animal coloring pages. Featuring puppies, kittens, safari animals, ocean life, and cute woodland creatures.",
        iconName: "Dog",
        featured: true,
        popular: true,
        heroColor: "from-emerald-100 to-teal-100 border-emerald-200",
        subcategories: [
            "Cats & Dogs",
            "Safari Animals",
            "Farm Animals",
            "Woodland Animals"
        ],
        faqs: [
            {
                question: "How do I print an animal coloring sheet?",
                answer: "Click on any animal coloring page, then click the 'Print Page' button. Your browser print window will open ready for standard letter/A4 paper."
            }
        ]
    },
    {
        id: "cat-princesses",
        slug: "princesses",
        name: "Princess Coloring Pages",
        description: "Royal gowns, fairytale castles, crowns, and magical gardens. Magical princess coloring sheets for dreamy young creators.",
        seoTitle: "Free Princess Coloring Pages (Printable & Online) | ColoringNest",
        seoDescription: "Free royal princess coloring sheets for children. Color enchanting princesses, castles, and fairy tales online or print at home.",
        iconName: "Crown",
        featured: true,
        popular: true,
        heroColor: "from-rose-100 to-pink-100 border-rose-200",
        subcategories: [
            "Fairytale Princesses",
            "Royal Castles",
            "Mermaid Princesses",
            "Ball Gowns"
        ]
    },
    {
        id: "cat-vehicles",
        slug: "vehicles",
        name: "Vehicle & Car Coloring Pages",
        description: "Sports cars, monster trucks, fire engines, race cars, airplanes, and rockets. High-octane coloring fun for car enthusiasts!",
        seoTitle: "Free Vehicle & Car Coloring Pages for Kids | ColoringNest",
        seoDescription: "Printable sports cars, fire trucks, planes, and monster trucks coloring pages. Color online or print for free.",
        iconName: "Car",
        featured: true,
        popular: true,
        heroColor: "from-blue-100 to-indigo-100 border-blue-200",
        subcategories: [
            "Sports Cars",
            "Monster Trucks",
            "Emergency Vehicles",
            "Planes & Rockets"
        ]
    },
    {
        id: "cat-fantasy",
        slug: "fantasy",
        name: "Fantasy & Fairy Tales",
        description: "Dragons, mermaids, fairies, wizards, and mythical creatures. Transport your imagination into mythical magic worlds.",
        seoTitle: "Free Fantasy Coloring Pages (Dragons, Fairies & Mermaids) | ColoringNest",
        seoDescription: "Immerse yourself in magical fantasy coloring sheets. Color dragons, mermaids, and fairies online or download as high quality PNG.",
        iconName: "Wand2",
        featured: true,
        popular: false,
        heroColor: "from-purple-100 to-indigo-100 border-purple-200",
        subcategories: [
            "Dragons",
            "Mermaids",
            "Fairies & Elves",
            "Magical Castles"
        ]
    },
    {
        id: "cat-nature",
        slug: "nature",
        name: "Nature & Landscape Coloring Pages",
        description: "Lush forests, mountains, waterfalls, rainbows, and garden scenes. Relaxing environmental designs for peaceful coloring.",
        seoTitle: "Free Nature Coloring Pages (Forests, Mountains, Rivers) | ColoringNest",
        seoDescription: "Beautiful nature and landscape coloring sheets. Perfect for stress-relieving coloring for kids and adults alike.",
        iconName: "Trees",
        featured: false,
        popular: true,
        heroColor: "from-green-100 to-emerald-100 border-green-200",
        subcategories: [
            "Forest Scenes",
            "Mountains & Sky",
            "Rainbows & Clouds",
            "Sunflowers"
        ]
    },
    {
        id: "cat-holidays",
        slug: "holidays",
        name: "Holiday & Season Coloring Pages",
        description: "Celebrate holidays all year long with festive Christmas, Halloween, Easter, Thanksgiving, and Valentine's Day designs.",
        seoTitle: "Free Holiday Coloring Pages for Kids (Christmas, Easter, Halloween) | ColoringNest",
        seoDescription: "Festive holiday coloring pages for every season. Easy printable sheets and online interactive coloring for school or home.",
        iconName: "Gift",
        featured: true,
        popular: true,
        heroColor: "from-red-100 to-orange-100 border-red-200",
        subcategories: [
            "Christmas",
            "Halloween",
            "Easter",
            "Thanksgiving",
            "Valentine's Day"
        ]
    },
    {
        id: "cat-christmas",
        slug: "christmas",
        name: "Christmas Coloring Pages",
        description: "Santa Claus, Christmas trees, snowmen, reindeers, and holiday gifts. Bring holiday cheer to life with vibrant colors.",
        seoTitle: "Free Christmas Coloring Pages for Kids (Printable & Online) | ColoringNest",
        seoDescription: "Merry Christmas coloring pages! Color Santa, festive trees, and cute reindeers online or print free holiday coloring sheets.",
        iconName: "Snowflake",
        featured: true,
        popular: true,
        heroColor: "from-red-100 to-emerald-100 border-red-200",
        subcategories: [
            "Santa Claus",
            "Christmas Trees",
            "Snowmen",
            "Reindeer"
        ]
    },
    {
        id: "cat-halloween",
        slug: "halloween",
        name: "Halloween Coloring Pages",
        description: "Friendly ghosts, carved jack-o'-lantern pumpkins, friendly witches, and spooky castles for Halloween crafting.",
        seoTitle: "Free Halloween Coloring Pages for Kids | ColoringNest",
        seoDescription: "Spooky and fun Halloween coloring sheets. Color pumpkins, ghosts, and trick-or-treaters online or download printable sheets.",
        iconName: "Ghost",
        featured: true,
        popular: true,
        heroColor: "from-orange-100 to-amber-100 border-orange-200",
        subcategories: [
            "Jack-o'-Lanterns",
            "Friendly Ghosts",
            "Witches & Cats",
            "Haunted Houses"
        ]
    },
    {
        id: "cat-easter",
        slug: "easter",
        name: "Easter Coloring Pages",
        description: "Easter bunnies, decorated spring eggs, baby chicks, and spring flowers. Bright and joyful spring holiday coloring.",
        seoTitle: "Free Easter Coloring Pages (Bunny, Eggs & Chicks) | ColoringNest",
        seoDescription: "Free printable Easter coloring pages. Color cute Easter bunnies and decorated eggs online or print for spring activities.",
        iconName: "Egg",
        featured: false,
        popular: true,
        heroColor: "from-yellow-100 to-pink-100 border-yellow-200",
        subcategories: [
            "Easter Bunny",
            "Decorated Eggs",
            "Spring Chicks"
        ]
    },
    {
        id: "cat-ocean",
        slug: "ocean",
        name: "Ocean & Sea Life Coloring Pages",
        description: "Dolphins, sea turtles, whales, colorful fish, and underwater coral reefs. Dive into deep sea underwater adventures.",
        seoTitle: "Free Ocean & Marine Animal Coloring Pages | ColoringNest",
        seoDescription: "Explore marine life with free ocean coloring pages. Color turtles, dolphins, and sea creatures online or print free sheets.",
        iconName: "Waves",
        featured: false,
        popular: true,
        heroColor: "from-cyan-100 to-blue-100 border-cyan-200",
        subcategories: [
            "Dolphins",
            "Sea Turtles",
            "Coral Reefs",
            "Whales"
        ]
    },
    {
        id: "cat-space",
        slug: "space",
        name: "Outer Space Coloring Pages",
        description: "Rockets, astronauts, planets, stars, and alien spaceships. Cosmic adventures for galaxy explorers.",
        seoTitle: "Free Outer Space & Astronaut Coloring Pages | ColoringNest",
        seoDescription: "Blast off with free space coloring sheets! Color astronauts, planets, and rockets online or print high-quality PNGs.",
        iconName: "Rocket",
        featured: false,
        popular: true,
        heroColor: "from-sky-100 to-indigo-100 border-sky-200",
        subcategories: [
            "Rockets & Shuttles",
            "Astronauts",
            "Planets & Solar System"
        ]
    },
    {
        id: "cat-food",
        slug: "food",
        name: "Food & Sweet Treat Coloring Pages",
        description: "Yummy ice cream cones, cupcakes, pizza slices, burgers, and cute kawaii snacks with happy faces.",
        seoTitle: "Free Food & Cupcake Coloring Pages | ColoringNest",
        seoDescription: "Delicious food coloring sheets featuring cupcakes, ice cream, fruits, and pizza. Color online or print free pages.",
        iconName: "Pizza",
        featured: false,
        popular: false,
        heroColor: "from-amber-100 to-rose-100 border-amber-200",
        subcategories: [
            "Kawaii Snacks",
            "Cupcakes & Cakes",
            "Ice Cream",
            "Fruits & Veggies"
        ]
    },
    {
        id: "cat-flowers",
        slug: "flowers",
        name: "Flower & Garden Coloring Pages",
        description: "Roses, sunflowers, tulips, bouquets, and flower mandalas. Floral beauty for relaxing creative sessions.",
        seoTitle: "Free Flower Coloring Pages for Kids & Adults | ColoringNest",
        seoDescription: "Printable flower coloring sheets including sunflowers, roses, and garden bouquets. Color online or download PNGs.",
        iconName: "Flower2",
        featured: false,
        popular: true,
        heroColor: "from-fuchsia-100 to-pink-100 border-fuchsia-200",
        subcategories: [
            "Sunflowers",
            "Roses & Tulips",
            "Flower Bouquets",
            "Floral Mandalas"
        ]
    },
    {
        id: "cat-mandala",
        slug: "mandala",
        name: "Mandala Coloring Pages",
        description: "Geometric circular patterns, zen art, and intricate mandalas designed for mindfulness, focus, and adult relaxation.",
        seoTitle: "Free Mandala Coloring Pages for Relaxation & Mindfulness | ColoringNest",
        seoDescription: "Intricate printable mandala coloring pages. Experience relaxing art therapy online or print high resolution mandala sheets.",
        iconName: "CircleDot",
        featured: true,
        popular: true,
        heroColor: "from-teal-100 to-indigo-100 border-teal-200",
        subcategories: [
            "Easy Mandalas",
            "Detailed Mandalas",
            "Floral Mandalas",
            "Geometric Patterns"
        ]
    },
    {
        id: "cat-adults",
        slug: "adults",
        name: "Coloring Pages for Adults",
        description: "Intricate patterns, detailed wildlife, zen line art, and anti-stress designs crafted specifically for grown-up coloring enthusiasts.",
        seoTitle: "Free Detailed Coloring Pages for Adults (Anti-Stress) | ColoringNest",
        seoDescription: "Relax with detailed coloring pages for adults. High-definition printable sheets for stress relief and mindfulness art therapy.",
        iconName: "Feather",
        featured: true,
        popular: true,
        heroColor: "from-violet-100 to-purple-100 border-violet-200",
        subcategories: [
            "Stress Relief",
            "Detailed Animals",
            "Botanical Art",
            "Complex Patterns"
        ]
    },
    {
        id: "cat-preschool",
        slug: "preschool",
        name: "Preschool & Toddler Coloring Pages",
        description: "Super simple thick outlines, large shapes, alphabet letters, and basic animals designed for little hands (ages 2-4).",
        seoTitle: "Free Easy Coloring Pages for Preschoolers & Toddlers | ColoringNest",
        seoDescription: "Simple printable coloring pages for toddlers and preschool kids. Bold lines and easy shapes ideal for early fine motor practice.",
        iconName: "Baby",
        featured: true,
        popular: true,
        heroColor: "from-yellow-100 to-amber-100 border-yellow-200",
        subcategories: [
            "Big Shapes",
            "Simple Animals",
            "Alphabet A-Z",
            "Numbers 1-10"
        ]
    },
    {
        id: "cat-kindergarten",
        slug: "kindergarten",
        name: "Kindergarten Coloring Pages",
        description: "Educational coloring sheets combining fun images with letters, sight words, counting objects, and early learning skills.",
        seoTitle: "Free Kindergarten Coloring Pages (Educational & Fun) | ColoringNest",
        seoDescription: "Fun and educational coloring sheets for kindergarten students. Practice letters, numbers, and motor skills while coloring.",
        iconName: "BookOpen",
        featured: false,
        popular: true,
        heroColor: "from-sky-100 to-emerald-100 border-sky-200",
        subcategories: [
            "Letter Trace & Color",
            "Count & Color",
            "Community Helpers",
            "Seasons"
        ]
    },
    {
        id: "cat-sports",
        slug: "sports",
        name: "Sports Coloring Pages",
        description: "Soccer balls, basketball, baseball, gymnastics, cycling, and martial arts for young sports fans.",
        seoTitle: "Free Sports Coloring Pages for Kids | ColoringNest",
        seoDescription: "Color soccer, basketball, baseball, and athletic designs. Printable sports coloring pages for boys and girls.",
        iconName: "Trophy",
        featured: false,
        popular: false,
        heroColor: "from-orange-100 to-yellow-100 border-orange-200",
        subcategories: [
            "Soccer",
            "Basketball",
            "Gymnastics",
            "Baseball"
        ]
    }
];
function getCategoryBySlug(slug) {
    return CATEGORIES.find((c)=>c.slug === slug);
}
}),
"[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/search.mjs [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$src$2f$lib$2f$data$2f$coloringPages$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/src/lib/data/coloringPages.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$src$2f$lib$2f$data$2f$categories$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/src/lib/data/categories.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
function SearchBar({ placeholder = "Search free coloring pages...", className = "", size = "md" }) {
    const [query, setQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Close suggestions dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleSearchSubmit = (e)=>{
        e.preventDefault();
        if (!query.trim()) return;
        setIsOpen(false);
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    };
    // Filter categories & pages for auto-complete
    const trimmed = query.trim().toLowerCase();
    const matchedCategories = trimmed ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$src$2f$lib$2f$data$2f$categories$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CATEGORIES"].filter((c)=>c.name.toLowerCase().includes(trimmed) || c.slug.toLowerCase().includes(trimmed)).slice(0, 3) : [];
    const matchedPages = trimmed ? __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$src$2f$lib$2f$data$2f$coloringPages$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["COLORING_PAGES"].filter((p)=>p.title.toLowerCase().includes(trimmed) || p.tags.some((t)=>t.toLowerCase().includes(trimmed)) || p.categorySlug.toLowerCase().includes(trimmed)).slice(0, 5) : [];
    const sizeClasses = {
        sm: "py-1.5 pl-9 pr-8 text-sm",
        md: "py-2.5 pl-10 pr-10 text-base",
        lg: "py-3.5 pl-12 pr-12 text-lg font-medium shadow-sm"
    };
    const iconSizes = {
        sm: "w-4 h-4 left-3",
        md: "w-5 h-5 left-3.5",
        lg: "w-6 h-6 left-4"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: `relative w-full ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSearchSubmit,
                className: "relative w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                        className: `absolute top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none ${iconSizes[size]}`
                    }, void 0, false, {
                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: query,
                        onChange: (e)=>{
                            setQuery(e.target.value);
                            setIsOpen(true);
                        },
                        onFocus: ()=>setIsOpen(true),
                        placeholder: placeholder,
                        className: `w-full rounded-full border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${sizeClasses[size]}`
                    }, void 0, false, {
                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    query && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>{
                            setQuery("");
                            setIsOpen(false);
                        },
                        className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full",
                        "aria-label": "Clear search query",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                            lineNumber: 102,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                        lineNumber: 93,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            isOpen && query.trim().length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150",
                children: matchedCategories.length === 0 && matchedPages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 text-center text-sm text-slate-500",
                    children: [
                        "No direct matches for “",
                        query,
                        "”. Press Enter to search all coloring pages."
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                    lineNumber: 111,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "py-2 divide-y divide-slate-100",
                    children: [
                        matchedCategories.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-3 py-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-semibold tracking-wider text-slate-400 uppercase px-2 mb-1 block",
                                    children: "Categories"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                                    lineNumber: 119,
                                    columnNumber: 19
                                }, this),
                                matchedCategories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/coloring-pages/${cat.slug}/`,
                                        onClick: ()=>setIsOpen(false),
                                        className: "flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-medium",
                                                children: cat.name
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                                                lineNumber: 129,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-sans",
                                                children: "Category"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                                                lineNumber: 130,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, cat.slug, true, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                                        lineNumber: 123,
                                        columnNumber: 21
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                            lineNumber: 118,
                            columnNumber: 17
                        }, this),
                        matchedPages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-3 py-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-semibold tracking-wider text-slate-400 uppercase px-2 mb-1 block",
                                    children: "Coloring Pages"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                                    lineNumber: 141,
                                    columnNumber: 19
                                }, this),
                                matchedPages.map((page)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: `/coloring-pages/${page.categorySlug}/${page.slug}/`,
                                        onClick: ()=>setIsOpen(false),
                                        className: "flex items-center justify-between px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 rounded-lg transition-colors group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 truncate",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                        className: "w-4 h-4 text-indigo-500 shrink-0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                                                        lineNumber: 152,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-medium truncate",
                                                        children: page.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                                                        lineNumber: 153,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                                                lineNumber: 151,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                className: "w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                                                lineNumber: 155,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, page.slug, true, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                                        lineNumber: 145,
                                        columnNumber: 21
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                            lineNumber: 140,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-2 bg-slate-50 text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSearchSubmit,
                                className: "w-full text-xs font-semibold text-indigo-600 hover:text-indigo-800 py-1 flex items-center justify-center gap-1",
                                children: [
                                    "View all results for “",
                                    query,
                                    "”",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                                        lineNumber: 168,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                                lineNumber: 163,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                            lineNumber: 162,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                    lineNumber: 115,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
                lineNumber: 109,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
}),
"[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/palette.mjs [app-ssr] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/search.mjs [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-ssr] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/printer.mjs [app-ssr] (ecmascript) <export default as Printer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$src$2f$components$2f$SearchBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/build-seo-optimized-coloring-website/src/components/SearchBar.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mobileSearchOpen, setMobileSearchOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const navLinks = [
        {
            href: "/",
            label: "Home"
        },
        {
            href: "/coloring-pages/",
            label: "Coloring Pages"
        },
        {
            href: "/printable-coloring-pages/",
            label: "Printables"
        },
        {
            href: "/free-coloring-pages/",
            label: "Free Pages"
        },
        {
            href: "/blog/",
            label: "Blog"
        }
    ];
    const isActive = (href)=>{
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between h-16 sm:h-20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/",
                                        className: "flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"], {
                                                    className: "w-5 h-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                                    lineNumber: 48,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                                lineNumber: 47,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-bold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-900 bg-clip-text text-transparent",
                                                        children: [
                                                            "Coloring",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-indigo-600",
                                                                children: "Nest"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                                                lineNumber: 52,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                                        lineNumber: 51,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] text-slate-500 tracking-wider uppercase font-semibold hidden sm:inline-block -mt-1",
                                                        children: "Free Online & Printable"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                                        lineNumber: 54,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                                lineNumber: 50,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                        lineNumber: 43,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                        className: "hidden lg:flex items-center gap-1 xl:gap-2 ml-4",
                                        children: navLinks.map((link)=>{
                                            const active = isActive(link.href);
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: link.href,
                                                className: `px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${active ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`,
                                                children: link.label
                                            }, link.href, false, {
                                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                                lineNumber: 65,
                                                columnNumber: 19
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                        lineNumber: 61,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                lineNumber: 42,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden sm:flex items-center gap-3 w-64 lg:w-80",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$src$2f$components$2f$SearchBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    size: "sm"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                lineNumber: 82,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex lg:hidden items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setMobileSearchOpen(!mobileSearchOpen),
                                        className: "p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors",
                                        "aria-label": "Toggle Search",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                        lineNumber: 88,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setMobileMenuOpen(!mobileMenuOpen),
                                        className: "p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors",
                                        "aria-label": "Toggle Menu",
                                        children: mobileMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "w-6 h-6"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                            lineNumber: 100,
                                            columnNumber: 33
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                            className: "w-6 h-6"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                            lineNumber: 100,
                                            columnNumber: 61
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    mobileSearchOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:hidden pb-4 pt-1 px-1 border-t border-slate-100",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$src$2f$components$2f$SearchBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            size: "md"
                        }, void 0, false, {
                            fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                            lineNumber: 108,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                        lineNumber: 107,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            mobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "lg:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3 shadow-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "flex flex-col space-y-1",
                        children: navLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: link.href,
                                onClick: ()=>setMobileMenuOpen(false),
                                className: `px-4 py-3 rounded-xl font-medium text-base transition-colors ${isActive(link.href) ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-700 hover:bg-slate-50"}`,
                                children: link.label
                            }, link.href, false, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                lineNumber: 118,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                        lineNumber: 116,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-2 border-t border-slate-100 grid grid-cols-2 gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/printable-coloring-pages/",
                                onClick: ()=>setMobileMenuOpen(false),
                                className: "flex items-center justify-center gap-2 p-3 bg-indigo-50 text-indigo-700 font-semibold rounded-xl text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$printer$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Printer$3e$__["Printer"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                        lineNumber: 138,
                                        columnNumber: 15
                                    }, this),
                                    "Printables"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                lineNumber: 133,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/coloring-pages/unicorn/unicorn-rainbow-coloring-page/",
                                onClick: ()=>setMobileMenuOpen(false),
                                className: "flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl text-sm shadow-xs",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$build$2d$seo$2d$optimized$2d$coloring$2d$website$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this),
                                    "Color Online"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
                lineNumber: 115,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Desktop/build-seo-optimized-coloring-website/src/components/Header.tsx",
        lineNumber: 38,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__032_~rn._.js.map