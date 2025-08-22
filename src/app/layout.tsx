import Footer from "@/Components/Footer";
import "./globals.css";
import Header from "@/Components/Header";
import { Open_Sans } from "next/font/google";


const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en" className={openSans.className} suppressHydrationWarning>
      <body>
        <Header />

        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
