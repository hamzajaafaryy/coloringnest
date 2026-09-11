export interface ColoringPage {
  id: string;
  slug: string;
  title: string;
  categorySlug: string;
  description: string;
  instructions: string;
  svgContent: string;
  altText: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  ageRange: "Toddlers (2-4)" | "Preschool (3-5)" | "Kids (6-10)" | "Teens & Adults";
  difficulty: "Easy" | "Medium" | "Detailed";
  featured?: boolean;
  popular?: boolean;
  publishedDate: string;
  faqs?: { question: string; answer: string }[];
}

// SVG Builder helper for clean colorable SVG paths
const createSvg = (paths: string) => `
<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" class="coloring-svg w-full h-full select-none" style="background:#ffffff;">
  <g class="coloring-layer">
    ${paths}
  </g>
</svg>
`.trim();

export const COLORING_PAGES: ColoringPage[] = [
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
    tags: ["unicorn", "rainbow", "stars", "cute", "fantasy", "preschool"],
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
    tags: ["unicorn", "baby", "cute", "hearts", "flowers", "toddler"],
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
    tags: ["dinosaur", "t-rex", "prehistoric", "volcano", "kids"],
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
    tags: ["dinosaur", "triceratops", "baby", "cute", "preschool"],
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
    tags: ["cat", "kitten", "pets", "yarn", "animals", "cute"],
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
    tags: ["dog", "puppy", "pets", "animals", "kids"],
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
    tags: ["princess", "castle", "fairytale", "gown", "magic", "kids"],
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
    tags: ["car", "sports car", "vehicles", "racing", "speed"],
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
    tags: ["fire truck", "vehicles", "emergency", "rescue", "kids"],
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
    tags: ["christmas", "snowman", "christmas tree", "holidays", "winter"],
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
    tags: ["halloween", "pumpkin", "jack-o-lantern", "witch", "spooky"],
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
    tags: ["dolphin", "ocean", "sea life", "waves", "animals"],
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
    tags: ["space", "astronaut", "rocket", "planets", "stars"],
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
    tags: ["mandala", "adults", "relaxing", "floral", "mindfulness", "detailed"],
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
    tags: ["food", "ice cream", "kawaii", "sundae", "sweets"],
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
    tags: ["flowers", "sunflower", "butterfly", "garden", "nature"],
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
    tags: ["preschool", "alphabet", "letter A", "apple", "educational"],
    ageRange: "Toddlers (2-4)",
    difficulty: "Easy",
    featured: true,
    popular: true,
    publishedDate: "2026-01-04"
  }
];

export function getPageBySlug(slug: string): ColoringPage | undefined {
  return COLORING_PAGES.find((p) => p.slug === slug);
}

export function getPagesByCategory(categorySlug: string): ColoringPage[] {
  return COLORING_PAGES.filter((p) => p.categorySlug === categorySlug);
}

export function getRelatedPages(currentPage: ColoringPage, limit = 6): ColoringPage[] {
  // First match same category
  const sameCategory = COLORING_PAGES.filter(
    (p) => p.categorySlug === currentPage.categorySlug && p.slug !== currentPage.slug
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }
  // Otherwise fill with tag matches or popular pages
  const remaining = COLORING_PAGES.filter(
    (p) => p.slug !== currentPage.slug && !sameCategory.some((sc) => sc.slug === p.slug)
  );
  return [...sameCategory, ...remaining].slice(0, limit);
}
