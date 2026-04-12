import type { Metadata } from "next";
import OrderHistory from '@/components/OrderHistory';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

export const metadata: Metadata = {
  title: "Lịch sử đơn hàng",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${baseUrl}/orders`,
  },
};

export default function OrdersPage() {
  return <OrderHistory />;
}
