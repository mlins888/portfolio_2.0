"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  if (pathname === "/") return null; // hide the nav on the home page

  return (
    <nav className="nav">
      <Link href="/">Home</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}