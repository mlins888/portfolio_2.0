import "./globals.css";

export const metadata = {
  title: "Makenna Linsky Portfolio",
  description: "A creative overhead lake and mountain portfolio landing page.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
