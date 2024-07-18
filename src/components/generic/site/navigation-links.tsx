import { ComponentProps } from "react";
import type { pathnames } from "@/config/config";
import { Link } from "@/navigation";

/**
 * Represents the props for a navigation link component.
 * @template Pathname - The type of the pathname for the link.
 */
interface NavigationLinkProps<Pathname extends keyof typeof pathnames>
  extends Omit<ComponentProps<typeof Link<Pathname>>, "onClick"> {
  onClick?: () => void;
}

/**
 * Navigation link component for the navigation bar.
 *
 * @component
 *
 * @param href: string - The href of the component
 * @param onClick?: () => void - Optional onClick handler
 * @returns JSX.Element
 */
const NavigationLink = <Pathname extends keyof typeof pathnames>({
  href,
  onClick,
  ...rest
}: NavigationLinkProps<Pathname>) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return <Link href={href} onClick={handleClick} {...rest} />;
};

export default NavigationLink;
