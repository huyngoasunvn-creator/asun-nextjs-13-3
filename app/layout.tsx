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

const baseUrl = "https://asun.vn";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

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

  robots: {
    index: true,
    follow: true
  },

  openGraph: {
  type: "website",
  locale: "vi_VN",
  siteName: "Asun Việt Nam",
  url: baseUrl,
  title: "Asun Việt Nam - Hệ thống điện máy cao cấp",
  description:
    "Asun Việt Nam - Hệ thống thương mại điện tử điện máy cao cấp. Sản phẩm chính hãng, giá tốt, giao hàng toàn quốc.",
  images: [
    {
      url: `${baseUrl}/logo-share.jpg`,
      width: 1200,
      height: 630,
      alt: "Asun Việt Nam"
    }
  ]
},

  twitter: {
    card: "summary_large_image"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Asun Việt Nam",
    url: baseUrl,
    logo:
      "https://w.ladicdn.com/664194bb278fae0012c9fcfa/29366248_1941804405829698_8259729440334938112_n-20240731043727-n5eo-.png"
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Asun Việt Nam",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="vi">
      <head>
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>

      <body suppressHydrationWarning className={`${inter.variable} ${merriweather.variable} antialiased`}>
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />

        <AuthProvider>
          <AppProvider>
            <ClientLayout>{children}</ClientLayout>
          </AppProvider>
        </AuthProvider>

      </body>
    </html>
  );
}