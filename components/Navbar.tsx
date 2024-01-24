import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const navIcons = [
  {
    src: "/assets/icons/search.svg",
    alt: "search",
  },
  {
    src: "/assets/icons/black-heart.svg",
    alt: "heart",
  },
  {
    src: "/assets/icons/user.svg",
    alt: "user",
  },
];

const Navbar = () => {
  return (
    <div className={poppins.className}>
      <header className="w-full">
        <nav className="nav">
          <Link href="/" className="flex item-center gap-1">
            <Image
              src="/assets/icons/logo.svg"
              width={27}
              height={27}
              alt="logo"
            />
            <p className="nav-logo">
              Margin<span className="text-primary">Way</span>
            </p>
          </Link>
          <div className="flex item-center gap-5">
            {navIcons.map((icon) => (
              <Image
                src={icon.src}
                key={icon.alt}
                alt={icon.alt}
                width={28}
                height={28}
                className="object-contain"
              />
            ))}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
