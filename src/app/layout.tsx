import "./styles.css";

type Props = {
  children: React.ReactNode;
};

/**
 * Since there's a not-found page on root
 *
 * @param children: ReactNode - The children to render
 * @returns ReactNode - The layout of the application
 */
export default function RootLayout({ children }: Props) {
  return children;
}
