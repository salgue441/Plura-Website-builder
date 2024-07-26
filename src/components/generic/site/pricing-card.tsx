import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { PricingCards } from "@/domain/models";
import clsx from "clsx";
import { Check } from "lucide-react";
import Link from "next/link";

type Props = {
  cards: PricingCards[];
};

/**
 * Renders a pricing card that displays the title, description, price, duration,
 * and features of a plan.
 * @component
 * @version 1.0.0
 *
 * @param cards: Pricing[] - The pricing cards to display.
 * @returns The pricing card.
 */
const PricingCard = (props: Props) => {
  return (
    <>
      {props.cards.map((card) => (
        <Card
          key={card.title}
          className={clsx("w-[300px] flex flex-col justify-between", {
            "border-2 border-primary": card.title === "Unlimited Saas"
          })}
        >
          <CardHeader>
            <CardTitle
              className={clsx("", {
                "text-muted-foreground": card.title !== "Unlimited Saas"
              })}
            >
              {card.title}
            </CardTitle>

            <CardDescription>{card.description}</CardDescription>
          </CardHeader>

          <CardContent>
            <span className="text-4xl font-bold">{card.price}</span>
            <span className="text-muted-foreground">
              {card.duration && `/${card.duration}`}
            </span>
          </CardContent>

          <CardFooter className="flex flex-col items-start gap-4">
            <div>
              {card.features.map((feature) => (
                <div key={feature} className="flex gap-2 items-center">
                  <Check className="text-muted-foreground" />
                  <p>{feature}</p>
                </div>
              ))}
            </div>

            <Link
              href={`/agency?plan=${card.priceId}`}
              className={clsx("w-full text-center bg-primary p-2 rounded-md", {
                "!bg-muted-foreground": card.title === "Unlimited Saas"
              })}
            >
              Get Started
            </Link>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default PricingCard;
