import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Scale, CheckSquare } from "lucide-react";

const quickAccessCards = [
  {
    id: "rotacao-bombas",
    title: "Rotação de Bombas",
    description: "Sistema de coleta diária de rotação das bombas",
    icon: Droplet,
    enabled: true,
    route: "/",
  },
  {
    id: "gramatura-semanal",
    title: "Gramatura Semanal",
    description: "Controle semanal de gramatura",
    icon: Scale,
    enabled: false,
    route: "#",
  },
  {
    id: "controle-5s",
    title: "Controle 5S",
    description: "Gestão do programa 5S",
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8" data-testid="text-title">
          Acesso Rápido
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickAccessCards.map((card) => {
            const Icon = card.icon;
            const isDisabled = !card.enabled;
            
            return (
              <Card
                key={card.id}
                className={`transition-all duration-200 ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:shadow-lg hover:scale-105"
                }`}
                onClick={() => handleCardClick(card)}
                data-testid={`card-${card.id}`}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        isDisabled
                          ? "bg-gray-300 dark:bg-gray-700"
                          : "bg-primary"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isDisabled
                            ? "text-gray-500 dark:text-gray-400"
                            : "text-primary-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl" data-testid={`text-title-${card.id}`}>
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
                <CardContent>
                  <CardDescription data-testid={`text-description-${card.id}`}>
                    {card.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
