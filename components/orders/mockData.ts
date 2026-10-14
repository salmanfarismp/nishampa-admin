import { Order, OrderTelemetryData } from "./types";

export const INITIAL_TELEMETRY: OrderTelemetryData = {
  pendingCount: 18,
  todayCount: 86,
};

export const INITIAL_STATUS_TABS = [
  { id: "all", label: "All", count: 86 },
  { id: "new", label: "New", count: 18 },
  { id: "accepted", label: "Accepted", count: 14 },
  { id: "shipped", label: "Shipped", count: 42 },
  { id: "delivered", label: "Delivered", count: 10 },
  { id: "returned", label: "Returned", count: 2 },
] as const;

export const INITIAL_ORDERS: Order[] = [
  {
    id: "#ORD-9024",
    timeAgo: "12m ago",
    customerName: "Elena Vance",
    location: "Seattle, WA",
    primaryStatus: "new",
    secondaryStatus: "active",
    paymentMethod: "Online",
    paymentStatus: "paid",
    itemsSummary: "Merino Wool Crewneck (x1), Tumbler (x2)",
    totalItemsCount: 3,
    totalAmount: 248.0,
    primaryImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDEDDOnnBFsbXUo5i_wazQMRZWzfeQ8CJQg73zHOWY932dmv7fS_ksZp4NGczCpEZ2Up8rZoy1E7T8VpBVlZUZkGwyWXVjWchmo9L24lVjhXav3BkTRd-BWuPg1eKg1mQxNoLTh9yfYzckM0nriLYbOujPc2UedXz2fMoqPu4XpOrRgc3utnCUKQTlBb8omOMsY5WeX5nhdM-TQwXP9gtmmQXa9w9Znsnzqgp6fCzYAGSNRCQPE2MaHrg",
    items: [
      {
        id: "item-1",
        name: "Merino Wool Crewneck",
        quantity: 1,
        price: 168.0,
        imageUrl: "/images/products/merino-knit.jpg",
      },
      {
        id: "item-2",
        name: "Insulated Studio Tumbler",
        quantity: 2,
        price: 40.0,
      },
    ],
    actionState: "default",
  },
  {
    id: "#ORD-9023",
    timeAgo: "34m ago",
    customerName: "Marcus Kane",
    location: "Toronto, CA",
    primaryStatus: "accepted",
    secondaryStatus: "active",
    paymentMethod: "COD",
    paymentStatus: "pending",
    itemsSummary: "Titanium Stylus Pen (x1)",
    totalItemsCount: 1,
    totalAmount: 89.0,
    primaryImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA780D_q1CEjJf8m4Y_X_Un8kdc4Z_d0DHlvxc4ZR1vAe6ZwfWeV2dD7XhkWXHve4MC1PqkbiakXDTh8JRFdZz8BS2Sldy3TkKOyc-s1PUPAH4KWTRfqVGU_8mZ3FkA3Rjv3wKCpprgfdYfaCQ1QJ8yer18gf1hCT7sd0JUZkVbVRYUSrR7AFOdGB-xIr71pE2qoBo3gGaITZN1K_-Oz596mGi6ssITqDErjkv5kLpM2ZqFY6zvD3sIAA",
    items: [
      {
        id: "item-3",
        name: "Titanium Stylus Pen",
        quantity: 1,
        price: 89.0,
      },
    ],
    actionState: "default",
  },
  {
    id: "#ORD-9022",
    timeAgo: "1h ago",
    customerName: "Sophia Lind",
    location: "Stockholm, SE",
    primaryStatus: "shipped",
    secondaryStatus: "completed",
    paymentMethod: "Online",
    paymentStatus: "paid",
    itemsSummary: "Leather Folio (x1), Brass Ruler (x1)",
    totalItemsCount: 2,
    totalAmount: 312.0,
    primaryImageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAL0GtsxagMJZKPARqccCyV8feYsjHXu8B5oTWKmozUyrXxXg1aVx9rHYi6dCu09rZz28rvQeJlPUS7UNTYHhqQeqAMRrJ2Qs4f8M0hpQ9Y7otgg7suicoHfOmWUSGKvHkGgJvG9n4PEeOEmcW6N8rc56L0yTzoT-aPzKszFejILiyeYI50UcqTc-yuI7Wit6T-SSFQZzDzYyZbc8FMTVI16nQlWy972uz95Z3dLb72zBwEBIEUrGpFsw",
    carrier: "DHL",
    trackingNumber: "#940124",
    items: [
      {
        id: "item-4",
        name: "Full-Grain Leather Folio",
        quantity: 1,
        price: 248.0,
      },
      {
        id: "item-5",
        name: "Solid Brass Precision Ruler",
        quantity: 1,
        price: 64.0,
      },
    ],
    actionState: "default",
  },
  {
    id: "#ORD-9021",
    timeAgo: "2h ago",
    customerName: "Julian Wu",
    location: "San Francisco, CA",
    primaryStatus: "returned",
    secondaryStatus: "cancelled",
    paymentMethod: "Online",
    paymentStatus: "refunded",
    itemsSummary: "Customer Cancellation",
    totalItemsCount: 0,
    totalAmount: 45.0,
    refundDetails: "Refunded $45.00 to Online • Visa (Completed)",
    isStrikethrough: true,
    items: [
      {
        id: "item-6",
        name: "Linen Minimalist Cap",
        quantity: 1,
        price: 45.0,
      },
    ],
    actionState: "default",
  },
];
