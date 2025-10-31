import { useState } from "react";
import { useLocation } from "wouter";
import { Menu, Home, LogOut, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { icon: Home, label: "Início", route: "/home" },
  { icon: Droplet, label: "Rotação de Bombas", route: "/" },
];

export default function MobileHeader() {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

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

  const handleNavigate = (route: string) => {
    setLocation(route);
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 z-50 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" data-testid="button-menu">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Droplet className="w-5 h-5 text-primary-foreground" />
              </div>
              <span>Sistema PC</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-8 flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.route;

              return (
                <Button
                  key={link.route}
                  variant={isActive ? "default" : "ghost"}
                  className="justify-start gap-3"
                  onClick={() => handleNavigate(link.route)}
                  data-testid={`button-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Button>
              );
            })}
            <div className="mt-auto pt-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="w-5 h-5" />
                <span>Sair</span>
              </Button>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
