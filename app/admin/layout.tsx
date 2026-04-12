import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asun.vn";

export const metadata: Metadata = {
  title: "Quản trị hệ thống",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${baseUrl}/admin`,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
