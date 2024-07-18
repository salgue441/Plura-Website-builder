import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./locale-switcher-select";
import { locales } from "@/config/config";

/**
 * Renders a locale switcher dropdown that allows users to switch between
 * supported locales.
 * @components
 * @version 1.0.0
 *
 * @returns The locale switcher dropdown.
 */
const LocaleSwitcher = () => {
  const translations = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect defaultLocale={locale} label={translations("label")}>
      {locales.map((current) => (
        <option
          key={current}
          value={current}
          className="bg-secondary rounded-lg px-4 py-3 text-base text-gray-500 hover:bg-gray- hover:text-gray-900 transition-colors duration-300 ease-in-out"
          style={{ margin: "0.5rem 0", minWidth: "10rem" }}
        >
          {translations("locale", { locale: current })}
        </option>
      ))}
    </LocaleSwitcherSelect>
  );
};

export default LocaleSwitcher;
