export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  iconName: string;
  featured: boolean;
  popular: boolean;
  itemCount?: number;
  heroColor?: string;
  subcategories?: string[];
  faqs?: { question: string; answer: string }[];
}

export const CATEGORIES: Category[] = [
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
    subcategories: ["Cute Unicorns", "Rainbow Unicorns", "Unicorn Castles", "Pegasus & Flying Unicorns"],
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
    subcategories: ["T-Rex", "Baby Dinosaurs", "Herbivores", "Prehistoric Landscapes"],
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
    subcategories: ["Cats & Dogs", "Safari Animals", "Farm Animals", "Woodland Animals"],
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
    subcategories: ["Fairytale Princesses", "Royal Castles", "Mermaid Princesses", "Ball Gowns"]
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
    subcategories: ["Sports Cars", "Monster Trucks", "Emergency Vehicles", "Planes & Rockets"]
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
    subcategories: ["Dragons", "Mermaids", "Fairies & Elves", "Magical Castles"]
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
    subcategories: ["Forest Scenes", "Mountains & Sky", "Rainbows & Clouds", "Sunflowers"]
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
    subcategories: ["Christmas", "Halloween", "Easter", "Thanksgiving", "Valentine's Day"]
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
    subcategories: ["Santa Claus", "Christmas Trees", "Snowmen", "Reindeer"]
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
    subcategories: ["Jack-o'-Lanterns", "Friendly Ghosts", "Witches & Cats", "Haunted Houses"]
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
    subcategories: ["Easter Bunny", "Decorated Eggs", "Spring Chicks"]
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
    subcategories: ["Dolphins", "Sea Turtles", "Coral Reefs", "Whales"]
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
    subcategories: ["Rockets & Shuttles", "Astronauts", "Planets & Solar System"]
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
    subcategories: ["Kawaii Snacks", "Cupcakes & Cakes", "Ice Cream", "Fruits & Veggies"]
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
    subcategories: ["Sunflowers", "Roses & Tulips", "Flower Bouquets", "Floral Mandalas"]
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
    subcategories: ["Easy Mandalas", "Detailed Mandalas", "Floral Mandalas", "Geometric Patterns"]
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
    subcategories: ["Stress Relief", "Detailed Animals", "Botanical Art", "Complex Patterns"]
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
    subcategories: ["Big Shapes", "Simple Animals", "Alphabet A-Z", "Numbers 1-10"]
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
    subcategories: ["Letter Trace & Color", "Count & Color", "Community Helpers", "Seasons"]
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
    subcategories: ["Soccer", "Basketball", "Gymnastics", "Baseball"]
  }
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
