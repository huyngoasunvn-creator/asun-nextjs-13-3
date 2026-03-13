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
  title: "Asun Việt Nam - Hệ thống điện máy cao cấp",
  description: "Chào mừng bạn đến với Asun Việt Nam. Hệ thống thương mại điện tử điện máy cao cấp tích hợp AI và quản trị thông minh.",
  icons: {
    icon: "https://w.ladicdn.com/664194bb278fae0012c9fcfa/29366248_1941804405829698_8259729440334938112_n-20240731043727-n5eo-.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
