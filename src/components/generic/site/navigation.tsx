"use client";

import { useTranslations } from "next-intl";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";
import NavigationLink from "./navigation-links";
import LocaleSwitcher from "../locale-switcher";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { User } from "@prisma/client";

type Props = {
  user?: null | User;
};

/**
 * Renders the site navigation of the landing page.
 * @components
 * @version 1.0.0
 *
 * @returns The site navigation.
 */
const Navigation = ({ user }: Props) => {
  const navTranslations = useTranslations("Site");

  return (
    <div className="fixed top-0 right-0 left-0 p-4 flex items-center justify-between z-10">
      <aside className="flex items-center gap-2">
        <Image
          src={"/assets/plura-logo.svg"}
          width={40}
          height={40}
          alt="Plura logo"
        />

        <span className="text-xl font-bold">Plura .</span>
      </aside>

      <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
        <ul className="flex items-center justify-center gap-8">
          <NavigationLink href={"#"}>
            {navTranslations("navigation.pricing")}
          </NavigationLink>
          <NavigationLink href={"#"}>
            {navTranslations("navigation.about")}
          </NavigationLink>
          <NavigationLink href={"#"}>
            {navTranslations("navigation.documentation")}
          </NavigationLink>
          <NavigationLink href={"#"}>
            {navTranslations("navigation.features")}
          </NavigationLink>
        </ul>
      </nav>

      <aside className="flex gap-2 items-center">
        <LocaleSwitcher />

        <Link
          href={"/agency"}
          className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80"
        >
          Login
        </Link>

        <UserButton />
        <ModeToggle />
      </aside>
    </div>
  );
};

export default Navigation;
