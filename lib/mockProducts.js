// lib/constants/mockProducts.js
// lib/mockProducts.js
// lib/mockProducts.js
export const products = [
  // READY TO WEAR - WOMEN
  {
    id: "p1",
    name: "Tailored Trench Coat",
    slug: "tailored-trench-coat",
    category: "ready-to-wear",
    subcategory: "women",
    price: 85000,
    currency: "NGN",
    color: "mocha",
    size: ["XS", "S", "M", "L"],
    material: "Wool-blend",
    tags: ["new", "outerwear", "best-seller"],
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80",
    description:
      "A timeless trench coat crafted from premium wool-blend fabric. Features classic double-breasted design with a detachable belt. Perfect for transitional weather, this sophisticated piece elevates any ensemble with its clean lines and impeccable tailoring.",
    inStock: true,
    sku: "TW-TRENCH-001",
  },
  {
    id: "p2",
    name: "Silk Slip Dress",
    slug: "silk-slip-dress",
    category: "ready-to-wear",
    subcategory: "women",
    price: 72000,
    currency: "NGN",
    color: "dusty-rose",
    size: ["XS", "S", "M"],
    material: "Silk",
    tags: ["evening", "luxury"],
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80",
    description:
      "Effortlessly elegant silk slip dress with delicate spaghetti straps and bias-cut silhouette. The lustrous fabric drapes beautifully, creating a flattering feminine shape. Ideal for evening events or dressed down with a leather jacket.",
    inStock: true,
    sku: "TW-SLIP-002",
  },
  {
    id: "p3",
    name: "Pleated Midi Skirt",
    slug: "pleated-midi-skirt",
    category: "ready-to-wear",
    subcategory: "women",
    price: 45000,
    currency: "NGN",
    color: "ivory",
    size: ["S", "M", "L"],
    material: "Chiffon",
    tags: ["essentials"],
    image:
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=1200&q=80",
    description:
      "Flowing pleated midi skirt in lightweight chiffon. Features an elasticated waistband for comfort and movement. The soft pleats catch the light beautifully, making this a versatile piece for both office and weekend wear.",
    inStock: true,
    sku: "TW-SKIRT-003",
  },
  {
    id: "p4",
    name: "Cashmere Knit Sweater",
    slug: "cashmere-knit-sweater",
    category: "ready-to-wear",
    subcategory: "women",
    price: 95000,
    currency: "NGN",
    color: "beige",
    size: ["XS", "S", "M", "L", "XL"],
    material: "Cashmere",
    tags: ["new", "luxury", "best-seller"],
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80",
    description:
      "Pure cashmere sweater with ribbed crew neck and cuffs. Incredibly soft and lightweight, this investment piece offers unparalleled warmth and comfort. The relaxed fit makes it perfect for layering or wearing alone.",
    inStock: true,
    sku: "TW-CASH-004",
  },

  // READY TO WEAR - MEN
  {
    id: "p5",
    name: "Linen Button Shirt",
    slug: "linen-button-shirt",
    category: "ready-to-wear",
    subcategory: "men",
    price: 42000,
    currency: "NGN",
    color: "beige",
    size: ["S", "M", "L", "XL"],
    material: "Linen",
    tags: ["essentials"],
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
    description:
      "Classic linen shirt with mother-of-pearl buttons and chest pocket. The breathable natural fabric keeps you cool in warm weather while maintaining a refined appearance. Perfect for both casual and smart-casual occasions.",
    inStock: true,
    sku: "TW-LINEN-005",
  },
  {
    id: "p6",
    name: "Tailored Wool Blazer",
    slug: "tailored-wool-blazer",
    category: "ready-to-wear",
    subcategory: "men",
    price: 125000,
    currency: "NGN",
    color: "navy",
    size: ["M", "L", "XL", "2XL"],
    material: "Wool",
    tags: ["formal", "best-seller"],
    image:
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1200&q=80",
    description:
      "Impeccably tailored single-breasted blazer in premium wool. Features notch lapels, functioning sleeve buttons, and structured shoulders. A wardrobe essential that pairs perfectly with both dress trousers and denim.",
    inStock: true,
    sku: "TW-BLAZ-006",
  },
  {
    id: "p7",
    name: "Cotton Oxford Shirt",
    slug: "cotton-oxford-shirt",
    category: "ready-to-wear",
    subcategory: "men",
    price: 38000,
    currency: "NGN",
    color: "white",
    size: ["S", "M", "L", "XL", "2XL"],
    material: "Cotton",
    tags: ["essentials"],
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=1200&q=80",
    description:
      "Crisp Oxford cotton shirt with button-down collar and barrel cuffs. The dense weave provides structure while remaining comfortable throughout the day. A versatile staple that works from boardroom to weekend brunch.",
    inStock: true,
    sku: "TW-OXF-007",
  },

  // READY TO WEAR - KIDS
  {
    id: "p8",
    name: "Kids Playful Tee",
    slug: "kids-playful-tee",
    category: "ready-to-wear",
    subcategory: "kids",
    price: 12000,
    currency: "NGN",
    color: "mint",
    size: ["2-3Y", "4-5Y", "6-7Y"],
    material: "Cotton",
    tags: ["kids"],
    image:
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=900&q=80",
    description:
      "Soft cotton t-shirt with playful print. Made from organic cotton that's gentle on sensitive skin. Features a comfortable crew neck and relaxed fit that allows for active play. Machine washable for easy care.",
    inStock: true,
    sku: "TW-KID-008",
  },
  {
    id: "p9",
    name: "Kids Denim Overalls",
    slug: "kids-denim-overalls",
    category: "ready-to-wear",
    subcategory: "kids",
    price: 28000,
    currency: "NGN",
    color: "blue",
    size: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    material: "Denim",
    tags: ["kids", "casual"],
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=1200&q=80",
    description:
      "Classic denim overalls with adjustable straps and multiple pockets. Durable construction withstands active play while the soft-washed denim ensures comfort. Features snap closures for easy changing.",
    inStock: true,
    sku: "TW-KID-009",
  },

  // READY TO WEAR - BRIDAL SHOWER
  {
    id: "p10",
    name: "Bridal Lace Gown",
    slug: "bridal-lace-gown",
    category: "ready-to-wear",
    subcategory: "bridal-shower",
    price: 450000,
    currency: "NGN",
    color: "ivory",
    size: ["S", "M", "L"],
    material: "Lace",
    tags: ["bridal", "exclusive", "new"],
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    description:
      "Exquisite bridal gown featuring delicate French lace over silk lining. The fitted bodice transitions into a flowing A-line skirt with chapel train. Hand-sewn embellishments add subtle sparkle. A timeless design for the modern bride.",
    inStock: true,
    sku: "TW-BRID-010",
  },
  {
    id: "p11",
    name: "Satin Bridesmaid Dress",
    slug: "satin-bridesmaid-dress",
    category: "ready-to-wear",
    subcategory: "bridal-shower",
    price: 85000,
    currency: "NGN",
    color: "dusty-rose",
    size: ["XS", "S", "M", "L", "XL"],
    material: "Satin",
    tags: ["bridal"],
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80",
    description:
      "Elegant satin bridesmaid dress with cowl neckline and bias-cut skirt. The luxurious fabric drapes beautifully and catches the light. Features adjustable straps and side zipper for a perfect fit.",
    inStock: true,
    sku: "TW-BRID-011",
  },

  // JEWELRY
  {
    id: "p12",
    name: "Gold Hoop Earrings",
    slug: "gold-hoop-earrings",
    category: "jewelry",
    price: 25000,
    currency: "NGN",
    color: "gold",
    size: [],
    material: "Gold-plated",
    tags: ["accessory", "gift"],
    image:
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80",
    description:
      "Classic gold-plated hoop earrings in medium size. Lightweight and comfortable for all-day wear. The smooth finish catches light beautifully. Secure hinged closure ensures they stay in place.",
    inStock: true,
    sku: "JW-HOOP-012",
  },
  {
    id: "p13",
    name: "Pearl Strand Necklace",
    slug: "pearl-strand-necklace",
    category: "jewelry",
    price: 65000,
    currency: "NGN",
    color: "ivory",
    size: [],
    material: "Freshwater Pearl",
    tags: ["luxury", "gift", "best-seller"],
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
    description:
      "Elegant freshwater pearl necklace with gold-plated clasp. Each pearl is hand-selected for consistent size and luster. Classic 18-inch length sits perfectly at the collarbone. Comes in luxury gift box.",
    inStock: true,
    sku: "JW-PEARL-013",
  },
  {
    id: "p14",
    name: "Dainty Chain Bracelet",
    slug: "dainty-chain-bracelet",
    category: "jewelry",
    price: 18500,
    currency: "NGN",
    color: "gold",
    size: [],
    material: "Gold-plated",
    tags: ["new", "accessory"],
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=1200&q=80",
    description:
      "Delicate chain bracelet with adjustable length. Features a secure lobster clasp and extender chain. Minimalist design pairs well with other jewelry or makes a statement on its own.",
    inStock: true,
    sku: "JW-BRAC-014",
  },

  // ACCESSORIES
  {
    id: "p15",
    name: "Classic Leather Belt",
    slug: "classic-leather-belt",
    category: "accessories",
    price: 22000,
    currency: "NGN",
    color: "brown",
    size: ["M", "L"],
    material: "Leather",
    tags: ["essentials"],
    image:
      "https://images.unsplash.com/photo-1624222247344-550fb60583c2?auto=format&fit=crop&w=900&q=80",
    description:
      "Full-grain leather belt with polished brass buckle. The leather develops a beautiful patina over time. Versatile design works with both casual and formal attire. Made to last for years.",
    inStock: true,
    sku: "AC-BELT-015",
  },
  {
    id: "p16",
    name: "Statement Sunglasses",
    slug: "statement-sunglasses",
    category: "accessories",
    price: 35000,
    currency: "NGN",
    color: "black",
    size: [],
    material: "Acetate",
    tags: ["sunglasses", "summer"],
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    description:
      "Oversized acetate sunglasses with UV400 protection lenses. The bold frame makes a fashion statement while protecting your eyes. Includes protective case and cleaning cloth.",
    inStock: true,
    sku: "AC-SUN-016",
  },
  {
    id: "p17",
    name: "Velvet Evening Clutch",
    slug: "velvet-evening-clutch",
    category: "accessories",
    price: 38000,
    currency: "NGN",
    color: "emerald",
    size: [],
    material: "Velvet",
    tags: ["evening", "luxury"],
    image:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&q=80",
    description:
      "Luxurious velvet clutch with gold-tone frame closure. Compact size holds essentials while adding a pop of color. Features optional chain strap for versatile carrying. Lined interior with card slot.",
    inStock: true,
    sku: "AC-CLU-017",
  },

  // BEAUTY & HAIR
  {
    id: "p18",
    name: "Hydrating Facial Serum",
    slug: "hydrating-facial-serum",
    category: "beauty-hair",
    price: 28000,
    currency: "NGN",
    color: "clear",
    size: [],
    material: "Serum",
    tags: ["skincare", "new"],
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
    description:
      "Lightweight hyaluronic acid serum that deeply hydrates and plumps skin. Fast-absorbing formula works under moisturizer or makeup. Suitable for all skin types. Vegan and cruelty-free. 30ml bottle.",
    inStock: true,
    sku: "BH-SER-018",
  },
  {
    id: "p19",
    name: "Limited Edition Perfume",
    slug: "limited-edition-perfume",
    category: "beauty-hair",
    price: 120000,
    currency: "NGN",
    color: "amber",
    size: [],
    material: "Fragrance",
    tags: ["limited", "scent", "luxury"],
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
    description:
      "Exclusive eau de parfum with notes of bergamot, jasmine, and amber. Long-lasting formula develops beautifully on skin throughout the day. Comes in elegant glass bottle with gold accents. 50ml.",
    inStock: true,
    sku: "BH-PERF-019",
  },

  // COSMETICS
  {
    id: "p20",
    name: "Nude Matte Lipstick",
    slug: "nude-matte-lipstick",
    category: "cosmetics",
    price: 8500,
    currency: "NGN",
    color: "nude",
    size: [],
    material: "Makeup",
    tags: ["beauty", "best-seller"],
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80",
    description:
      "Long-wearing matte lipstick in universally flattering nude shade. Creamy formula glides on smoothly and sets to comfortable matte finish. Enriched with vitamin E for soft, nourished lips. Paraben-free.",
    inStock: true,
    sku: "CO-LIP-020",
  },
];
export const PRODUCT_COLORS = [
  { name: "Mocha", value: "mocha", hex: "#5B3A2E" },
  { name: "Beige", value: "beige", hex: "#F5F5DC" },
  { name: "Dusty Rose", value: "dusty-rose", hex: "#DCAE96" },
  { name: "Gold", value: "gold", hex: "#D4AF7F" },
  { name: "Clear", value: "clear", hex: "#F0F0F0" },
  { name: "Brown", value: "brown", hex: "#8B4513" },
  { name: "Mint", value: "mint", hex: "#98D8C8" },
  { name: "Ivory", value: "ivory", hex: "#FFFFF0" },
  { name: "Nude", value: "nude", hex: "#E3BC9A" },
  { name: "Black", value: "black", hex: "#222222" },
  { name: "Emerald", value: "emerald", hex: "#50C878" },
  { name: "Amber", value: "amber", hex: "#FFBF00" },
];
