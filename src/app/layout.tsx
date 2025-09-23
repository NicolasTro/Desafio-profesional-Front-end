import ClientLayoutWithAuth from "@/Components/ClientLayoutWithAuth";
import { AppProvider } from "@/Context/AppContext";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"]
});



export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <html lang="en" className={`${openSans.className}`} suppressHydrationWarning>
      <body>
        <AppProvider>
          <ClientLayoutWithAuth>
            {children}
          </ClientLayoutWithAuth>
        </AppProvider>
      </body>
    </html>
  );
}
