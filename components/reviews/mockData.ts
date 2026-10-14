import { Review } from "./types";

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "review-pending-01",
    author: "Elena Vance",
    status: "pending",
    createdAt: "14m ago",
    rating: 5,
    product: {
      name: "Merino Wool Crewneck Sweater",
      sku: "MWC-082-BLK",
    },
    comment:
      "Fabric density and seam stitching exceeded expectations. Warm yet breathable.",
    photos: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdnLi_BLnjm3wbLgIwUCqkAYi_x2amrswPKKCvPUcsIAsuQZ0eR7Du4OM8X9vl2WKU7hWjygP8n5w8waPfclMUTnLYKBQp9niW3AkxF3a6qMGjLTvn4Rizcpnt3uYl_HS4MS7Ftw_kz15S1JnbI2JL5HTJu8HuG8e-m1X0dVJfVcLot-xVUni0__sgalUoPfrqCl1b3wvTKWXqIacdruc5G9xYiaPV0vSZYn7hLa2UuNctFrzqvFuWBQ",
    ],
    verifiedPurchase: true,
  },
  {
    id: "review-pending-02",
    author: "Marcus Kane",
    status: "pending",
    createdAt: "42m ago",
    rating: 4,
    product: {
      name: "Minimalist Commuter Backpack",
      sku: "MCB-016-SLT",
    },
    comment:
      "Waterproof zips work great in heavy rain. Compartment fits a 16 inch laptop easily.",
    photos: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBeE2WVnHigqHD6V-g5n2S4UBZwUSJi2UPQSoiGTjkROcG3ZTWuZRd4muhvQMzbD3mwC6vq4w9V8-OfSuzB2iAHau3bjSXgoi_rQqZzzGauUv3Iev5YWjXeihAh9Vy4c4Nx2clSWJacd6EDpWAhk-oHSwxiwRiq1iuc9ggLQuHPJJb2J96CirL3t4OuVrKYo5-VC1zIPP7WRXcBEi42Im3E0bZ1bJbub9LHhij27zblVDnRaxAkHx_yXQ",
    ],
    verifiedPurchase: true,
  },
  {
    id: "review-pending-03",
    author: "Sophia Lind",
    status: "pending",
    createdAt: "2h ago",
    rating: 5,
    product: {
      name: "Matte Studio Desk Lamp",
      sku: "MSD-204-BRS",
    },
    comment:
      "Minimalist brass joints and smooth dimming. Perfectly illuminates my desk setup.",
    photos: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC0rpsbrVPJL_KQh-7gkKIx5Pwk2VonlEyszZnq3nLVP751xqvzygdTV6_9cNL8nPOs7VDR7aPbi53-qd5IZcdCATGnzC3xIKF92so9VEGhtMqM2jKagGj25NeP_cwdpAUiBJqUGEU_cPkzn1IeiuZlJmmMdaLbGoZ_rzBd2K_U5BBzsj_kYXXyi9FtOeZjYzaTw7uGweRIQDA2-drZMvrtHk4UFkJL7PRiIIVAklDyUky7Y7mYwcPv9A",
    ],
    verifiedPurchase: true,
  },
  {
    id: "review-flagged-01",
    author: "BotAccount_992",
    status: "flagged",
    createdAt: "3h ago",
    rating: 1,
    product: {
      name: "Merino Wool Crewneck Sweater",
      sku: "MWC-082-BLK",
    },
    comment:
      "Suspicious promotional content: Claim your free discount coupon at bit.ly/promo-fake-now",
    photos: [],
    verifiedPurchase: false,
    flagReason: "Automated spam filter detected unauthorized affiliate link",
    ipAddress: "194.26.29.112",
  },
  {
    id: "review-flagged-02",
    author: "Liam Zhao",
    status: "flagged",
    createdAt: "5h ago",
    rating: 2,
    product: {
      name: "Matte Studio Desk Lamp",
      sku: "MSD-204-BRS",
    },
    comment:
      "Package box was partially dented upon delivery, though lamp works fine.",
    photos: [],
    verifiedPurchase: true,
    flagReason: "Customer reported shipping carrier damage",
  },
  {
    id: "review-approved-01",
    author: "Clara Oswald",
    status: "approved",
    createdAt: "1d ago",
    rating: 5,
    product: {
      name: "Minimalist Commuter Backpack",
      sku: "MCB-016-SLT",
    },
    comment:
      "Incredible attention to detail. Ergonomic straps feel effortless during long bike commutes.",
    photos: [],
    verifiedPurchase: true,
    merchantReply:
      "Thank you Clara! Glad our ergonomic straps keep your commutes comfortable.",
  },
  {
    id: "review-approved-02",
    author: "David Miller",
    status: "approved",
    createdAt: "2d ago",
    rating: 5,
    product: {
      name: "Merino Wool Crewneck Sweater",
      sku: "MWC-082-BLK",
    },
    comment:
      "Superior handfeel and fit true to size. Already ordered a second one in charcoal.",
    photos: [],
    verifiedPurchase: true,
  },
];
