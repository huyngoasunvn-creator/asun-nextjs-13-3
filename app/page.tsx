import type { Metadata } from "next";
import ProductList from "@/components/ProductList";

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "Mua sắm điện máy cao cấp tại Asun Việt Nam. Giá tốt, khuyến mãi mỗi ngày."
};

export default function Home() {
  return <ProductList />;
}