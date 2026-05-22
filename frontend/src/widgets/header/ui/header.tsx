"use client";
import React from "react";
import Nav from "./nav/nav";
import CatalogDropdown from "./dropdown/catalog-dropdown";
import Logo from "@/public/images/logo.svg";
import Link from "next/link";
import HeaderIcons from "./header-icons/icons";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E5E5]">
      <div className="container flex h-16 md:h-[90px] items-center justify-between">
        <Link href="/">
          <Image src={Logo} alt="Geometrica" />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          <CatalogDropdown />
        </div>

        <Nav />
        <HeaderIcons />
      </div>
    </header>
  );
}
