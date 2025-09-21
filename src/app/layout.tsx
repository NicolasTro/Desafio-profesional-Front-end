import Footer from "@/Components/Footer";
import "./globals.css";
import Header from "@/Components/Header";
import SlideMenu from "@/Components/slideMenu";
import { getTokenFromCookie } from "@/lib/auth";
import { AppProvider } from "@/Context/AppContext";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"]
});

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getTokenFromCookie();

  return (
    <html lang="en" className={openSans.className} suppressHydrationWarning>
      <body>
        <AppProvider>
          <div className={`app-grid ${token ? "with-aside" : ""}`}>
            <Header />
            <SlideMenu isOpen={undefined} />
            <main>
              {children}
            </main>
            <Footer />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
