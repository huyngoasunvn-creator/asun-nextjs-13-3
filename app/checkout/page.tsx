import type { Metadata } from "next";
import Checkout from '@/components/Checkout';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

export const metadata: Metadata = {
  title: "Thanh toán",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${baseUrl}/checkout`,
  },
};

export default function CheckoutPage() {
  return <Checkout />;
}
