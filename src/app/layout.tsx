import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link"; 

export const metadata: Metadata = {
  title: "do it;",
  description: "Todo App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">

        {/* 상단바 */}
        <header className="w-full border-grey bg-white">
          <div className="max-w-[1200px] mx-auto h-[60px] flex items-center px-4">

           
            <Link href="/"> 
              <div className="flex items-center gap-2 cursor-pointer">
                <Image
                  src="/images/Size=Small@3x.png"
                  alt="logo"
                  width={70}
                  height={40}
                />
                <span
                  style={{
                    fontFamily: 'NanumSquareB',
                    fontWeight: 700,
                    fontSize: '24px',
                    color: '#7c3aed',
                    textShadow: '0 0 1px #7c3aed',
                  }}
                >
                  do it;
                </span>
              </div>
            </Link>

          </div>
        </header>

        {children}

      </body>
    </html>
  );
}
