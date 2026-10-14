import { ProductItem } from "./types";

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "prod-1",
    sku: "MK-8921",
    title: "Minimalist Merino Wool Knit",
    price: 120.0,
    imageUrl: "/images/products/merino-knit.jpg",
    imageAlt:
      "Studio product photograph of a premium charcoal gray minimalist merino wool knit sweater against a stark clean studio lighting setting, perfectly folded with micro-textured fabric details.",
    is_active: true,
    category: "apparel",
    barcode: "890123456789",
    description: "Architectural 100% merino wool knit sweater with tight gauge ribbing.",
  },
  {
    id: "prod-2",
    sku: "MS-1042",
    title: "Monochrome Studio Sneaker",
    price: 195.0,
    imageUrl: "/images/products/studio-sneaker.jpg",
    imageAlt:
      "High-contrast editorial product shot of a sleek monochrome all-black and matte white architectural studio sneaker on a subtle gradient background.",
    is_active: true,
    category: "footwear",
    barcode: "890123456790",
    description: "Vulcanized rubber sole with premium calfskin upper in high contrast.",
  },
  {
    id: "prod-3",
    sku: "CT-4402",
    title: "Structured Canvas Tote",
    price: 75.0,
    imageUrl: "/images/products/canvas-tote.jpg",
    imageAlt:
      "Commercial studio shot of an off-white unbleached heavy structured canvas tote bag with black webbing straps standing upright on pristine white floor.",
    is_active: false, // Draft
    category: "accessories",
    barcode: "890123456791",
    description: "24oz heavyweight unbleached cotton canvas with reinforced webbing handles.",
  },
  {
    id: "prod-4",
    sku: "CP-3011",
    title: "Matte Ceramic Pour-over",
    price: 54.0,
    imageUrl: "/images/products/ceramic-pour-over.jpg",
    imageAlt:
      "Artisanal ceramic pour-over coffee dripper in textured matte basalt black clay, minimalist Scandinavian aesthetic, soft diffused lighting.",
    is_active: false, // Draft
    category: "home_living",
    barcode: "890123456792",
    description: "Single-origin pour-over dripper made with matte basalt stoneware clay.",
  },
  {
    id: "prod-5",
    sku: "BL-2201",
    title: "Architectural Linen Overshirt",
    price: 145.0,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDSYu3JQLEMz0Agbbklul3buW693iKU8i6M6J8yqDCESw1HETmPAcmRbFy77XzqlwC1TZbKTFi8HTb1bjNFEWT1N2OXhsTs0CUjOYHN8tH3yt97LXe3LcI2AfRSgPWJOn52PAgV9e856_RFvJmcOvDZBe7R8rUcOiq3ySMgBqS_MwoeuOqKUER38CjmklWfI3vP9FTY7r8ebcPiZaUffWMk9hoPBnbndSbr5U8eezNB6q-WTdUqVAN2FQ",
    imageAlt: "Textured French flax linen overshirt in natural chalk finish.",
    is_active: true,
    category: "apparel",
    barcode: "890123456793",
    description: "Unstructured boxy cut overshirt with matte horn buttons.",
  },
  {
    id: "prod-6",
    sku: "LW-9080",
    title: "Minimalist Leather Cardholder",
    price: 45.0,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBXO6Rrz9tKYpl2ae9zEIR-jz4M6EUnMwY-Y9HAa12YvmcP3dKebFLF1JvZ0dcsfxxG-vNSwhKOlfx8R8fbkyq_f_7nuZg4XLDqYIXlXnhogG_B0wr8wovmea56uAKTIis-RmjtTwSqwDCtQvP4KBkWaOHuG8KByaT3yziOztwlBjCw0ZWSJ58BwoHBB9PALsSADNh6A1q2HHRaDYf_oyQwJHtVXTdyv36Db0dqxDVaQvIOPsGQLYMuQw",
    imageAlt: "Vegetable tanned Italian bridle leather cardholder with hand-painted edges.",
    is_active: true,
    category: "accessories",
    barcode: "890123456794",
    description: "Four-slot precision card sleeve with central folded bill compartment.",
  },
];
