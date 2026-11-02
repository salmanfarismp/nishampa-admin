import { redirect } from "next/navigation";

// import ProductsScreen from "./products/page";

export default function AdminPage() {
  // return <ProductsScreen />;
  redirect("/orders");
}

