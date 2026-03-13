import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/store/AuthContext";
import { AppProvider } from "@/store/AppContext";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://asun.vn"),

  title: {
    default: "Asun Việt Nam - Hệ thống điện máy cao cấp",
    template: "%s | Asun Việt Nam"
  },

  description:
    "Asun Việt Nam - Hệ thống thương mại điện tử điện máy cao cấp. Sản phẩm chính hãng, giá tốt, giao hàng toàn quốc.",

  keywords: [
    "điện máy",
    "điện máy cao cấp",
    "đồ gia dụng",
    "mua đồ điện máy",
    "Asun Việt Nam"
  ],

  authors: [{ name: "Asun Việt Nam" }],

  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://asun.vn",
    siteName: "Asun Việt Nam",
    title: "Asun Việt Nam - Hệ thống điện máy cao cấp",
    description:
      "Hệ thống thương mại điện tử điện máy cao cấp tích hợp AI.",
    images: [
      {
        url: "https://w.ladicdn.com/664194bb278fae0012c9fcfa/29366248_1941804405829698_8259729440334938112_n-20240731043727-n5eo-.png",
        width: 1200,
        height: 630
      }
    ]
  },

  twitter: {
    card: "summary_large_image",
    title: "Asun Việt Nam",
    description: "Hệ thống điện máy cao cấp",
  },

  icons: {
    icon: "https://w.ladicdn.com/664194bb278fae0012c9fcfa/29366248_1941804405829698_8259729440334938112_n-20240731043727-n5eo-.png",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${merriweather.variable} antialiased`}>
        <AuthProvider>
          <AppProvider>
            <ClientLayout>{children}</ClientLayout>
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}