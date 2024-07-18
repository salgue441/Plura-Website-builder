"use client";

import { useState } from "react";
import { ChangeEvent, ReactNode, useTransition } from "react";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useRouter, usePathname } from "@/navigation";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type Props = {
  children: ReactNode;
  defaultLocale: string;
  label: string;
};

/**
 * Changes the locale of the current route when the user selects a new locale.
 * @component
 * @version 1.0.0
 *
 * @param children: ReactNode - The locales to display in the select element.
 * @param defaultLocale: string - The default locale to display in the select
 * @param label: string - The label for the select element.
 * @returns The locale switcher select element.
 */
const LocaleSwitcherSelect = ({ children, defaultLocale, label }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [locale, setLocale] = useState<string>(defaultLocale);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    if (nextLocale === defaultLocale) {
      return;
    }

    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale }
      );
    });

    setLocale(nextLocale);
  }

  return (
    <div className="relative">
      <p className="sr-only text-xl">{label}</p>
      <div className="inline-block relative">
        <select
          className={clsx(
            "appearance-none bg-primary text-gray-400 py-2 pl-4 pr-12 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            isPending && "opacity-50"
          )}
          defaultValue={defaultLocale}
          disabled={isPending}
          onChange={onSelectChange}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => setIsExpanded(false)}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
          {isExpanded ? (
            <FaChevronUp className="ml-2" />
          ) : (
            <FaChevronDown className="ml-2" />
          )}
        </div>
      </div>
    </div>
  );
};

export default LocaleSwitcherSelect;
