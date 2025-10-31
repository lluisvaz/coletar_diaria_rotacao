import { useState } from "react";
import { useLocation } from "wouter";
import { Home, BarChart3, LogOut, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavLink {
  icon: typeof Home;
  label: string;
  route: string;
  active?: boolean;
}

const navLinks: NavLink[] = [
  { icon: Home, label: "Acesso Rápido", route: "/home" },
  { icon: Droplet, label: "Rotação de Bombas", route: "/" },
  { icon: BarChart3, label: "Dashboard", route: "/dashboard" },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setLocation("/login");
      window.location.reload();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <TooltipProvider>
      <nav className="fixed left-0 top-0 h-screen w-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-4 z-50">
        <div className="mb-8 w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Droplet className="w-6 h-6 text-primary-foreground" />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.route;

            return (
              <Tooltip key={link.route}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setLocation(link.route)}
                    data-testid={`button-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`w-10 h-10 ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{link.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        <div className="mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                data-testid="button-logout"
                className="w-10 h-10 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Sair</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </nav>
    </TooltipProvider>
  );
}
