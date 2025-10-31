import { useLocation } from "wouter";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Scale, CheckSquare } from "lucide-react";

const quickAccessCards = [
  {
    id: "rotacao-bombas",
    title: "Rotação de Bombas",
    icon: Droplet,
    enabled: true,
    route: "/",
  },
  {
    id: "gramatura-semanal",
    title: "Gramatura Semanal",
    icon: Scale,
    enabled: false,
    route: "#",
  },
  {
    id: "controle-5s",
    title: "Controle 5S",
    icon: CheckSquare,
    enabled: false,
    route: "#",
  },
];

export default function QuickAccess() {
  const [, setLocation] = useLocation();

  const handleCardClick = (card: typeof quickAccessCards[0]) => {
    if (card.enabled) {
      setLocation(card.route);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center" data-testid="text-title">
          Bem-vindo
        </h1>
        
        <div className="grid grid-cols-1 gap-4">
          {quickAccessCards.map((card) => {
            const Icon = card.icon;
            const isDisabled = !card.enabled;
            
            return (
              <Card
                key={card.id}
                className={`transition-all duration-200 ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:shadow-md"
                }`}
                onClick={() => handleCardClick(card)}
                data-testid={`card-${card.id}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isDisabled
                          ? "bg-gray-200 dark:bg-gray-700"
                          : "bg-primary"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isDisabled
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-primary-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base" data-testid={`text-title-${card.id}`}>
                        {card.title}
                      </CardTitle>
                      {isDisabled && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          (Em breve)
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
