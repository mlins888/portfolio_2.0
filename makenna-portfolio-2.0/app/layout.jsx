import "./globals.css";
import Nav from "./nav";
import Scene from "./scene";

export const metadata = {
  title: "Makenna Linsky Portfolio",
  description: "A creative overhead lake and mountain portfolio landing page.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Scene />              {/* persistent 3D world, behind every page */}
        <Nav />
        <main>{children}</main>  {/* the current page, on top */}
      </body>
    </html>
  );
}
