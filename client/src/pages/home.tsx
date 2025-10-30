import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FormularioDeEntrada from "@/components/FormularioDeEntrada";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  const [activeTab, setActiveTab] = useState("entrada");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            Logger de Rotação de Bombas Nordson
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sistema de coleta diária de rotação das bombas
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6" data-testid="tabs-main">
            <TabsTrigger value="entrada" data-testid="tab-entrada">
              Entrada de Dados
            </TabsTrigger>
            <TabsTrigger value="dashboard" data-testid="tab-dashboard">
              Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entrada" className="mt-0">
            <FormularioDeEntrada />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-0">
            <Dashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
