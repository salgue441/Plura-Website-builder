import { unstable_setRequestLocale } from "next-intl/server";

type Props = {
  params: { locale: string };
};

const Page = ({ params: { locale } }: Props) => {
  unstable_setRequestLocale(locale);
  return <div>Domain</div>;
};

export default Page;
