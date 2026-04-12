import type { Metadata } from "next";
import Wishlist from '@/components/Wishlist';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

export const metadata: Metadata = {
  title: "Sản phẩm yêu thích",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${baseUrl}/wishlist`,
  },
};

export default function WishlistPage() {
  return <Wishlist />;
}
