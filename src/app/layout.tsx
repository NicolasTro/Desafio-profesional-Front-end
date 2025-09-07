import Footer from "@/Components/Footer";
import "./globals.css";
import Header from "@/Components/Header";
import SlideMenu from "@/Components/slideMenu";
import { getTokenFromCookie } from "@/lib/auth";
import { AppProvider } from "@/Context/AppContext";
import { Open_Sans } from "next/font/google";
import ReactQueryProvider from '@/Components/ReactQueryProvider';


const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
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
        <ReactQueryProvider>
          <AppProvider>
            <div className={`app-grid ${token ? 'with-aside' : ''}`}>
              <Header />
              {token ? <SlideMenu isOpen={undefined} /> : null}
              <main>
                {children}
              </main>
              <Footer />
            </div>
          </AppProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
