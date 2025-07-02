import { Card, CardContent } from "@/components/ui/card";
import { SummaryCardsProps } from "./types";

const SummaryCards = ({ summaryCards }: SummaryCardsProps) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {summaryCards.map((card) => (
      <Card key={card.title}>
        <CardContent className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-muted-foreground">
              {card.title}
            </p>
            <p className={`text-base font-bold ${card.valueClass ?? ""}`}>
              {card.value}
            </p>
          </div>
          <div
            className={`h-8 w-8 flex items-center justify-center rounded-full ${
              card.iconBgClass ?? ""
            }`}
            aria-label={card.title}
            tabIndex={0}
          >
            {card.icon}
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default SummaryCards;
