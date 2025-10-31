import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await apiRequest("POST", "/api/auth/verify", { code });

      toast({
        title: "Acesso concedido",
        description: "Bem-vindo ao sistema!",
      });
      window.location.href = "/home";
    } catch (error: any) {
      toast({
        title: "Acesso negado",
        description: error.message || "Código de acesso inválido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md" data-testid="card-login">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold" data-testid="text-title">
            Sistema Personal Care
          </CardTitle>
          <CardDescription data-testid="text-description">
            Digite o código de acesso para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Código de acesso"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isLoading}
                required
                data-testid="input-code"
                className="text-center text-lg tracking-widest"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-submit"
            >
              {isLoading ? "Verificando..." : "Acessar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
