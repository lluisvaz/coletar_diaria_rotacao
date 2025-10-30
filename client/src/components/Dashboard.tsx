import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ColetaGrupo1, type ColetaGrupo2 } from "@shared/schema";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Calendar } from "lucide-react";
import DashboardDia from "./DashboardDia";

interface ColetasPorDia {
  data: string;
  grupo1: ColetaGrupo1[];
  grupo2: ColetaGrupo2[];
  total: number;
}

export default function Dashboard() {
  const [diasSelecionado, setDiaSelecionado] = useState<string | null>(null);

  const { data: grupo1Data, isLoading: isLoadingGrupo1 } = useQuery<
    ColetaGrupo1[]
  >({
    queryKey: ["/api/coleta/grupo1"],
  });

  const { data: grupo2Data, isLoading: isLoadingGrupo2 } = useQuery<
    ColetaGrupo2[]
  >({
    queryKey: ["/api/coleta/grupo2"],
  });

  // Agrupar coletas por dia
  const coletasPorDia: ColetasPorDia[] = [];

  if (grupo1Data || grupo2Data) {
    const diasMap = new Map<string, ColetasPorDia>();

    // Adicionar coletas do grupo 1
    grupo1Data?.forEach((coleta) => {
      const dataKey = coleta.dataColeta;
      if (!diasMap.has(dataKey)) {
        diasMap.set(dataKey, {
          data: dataKey,
          grupo1: [],
          grupo2: [],
          total: 0,
        });
      }
      const dia = diasMap.get(dataKey)!;
      dia.grupo1.push(coleta);
      dia.total++;
    });

    // Adicionar coletas do grupo 2
    grupo2Data?.forEach((coleta) => {
      const dataKey = coleta.dataColeta;
      if (!diasMap.has(dataKey)) {
        diasMap.set(dataKey, {
          data: dataKey,
          grupo1: [],
          grupo2: [],
          total: 0,
        });
      }
      const dia = diasMap.get(dataKey)!;
      dia.grupo2.push(coleta);
      dia.total++;
    });

    // Converter map para array e ordenar por data (mais recente primeiro)
    coletasPorDia.push(
      ...Array.from(diasMap.values()).sort((a, b) => {
        return new Date(b.data).getTime() - new Date(a.data).getTime();
      }),
    );
  }

  // Se um dia foi selecionado, mostrar o dashboard desse dia
  if (diasSelecionado) {
    const dadosDia = coletasPorDia.find((d) => d.data === diasSelecionado);
    if (dadosDia) {
      return (
        <DashboardDia
          data={diasSelecionado}
          grupo1={dadosDia.grupo1}
          grupo2={dadosDia.grupo2}
          onVoltar={() => setDiaSelecionado(null)}
        />
      );
    }
  }

  const isLoading = isLoadingGrupo1 || isLoadingGrupo2;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard de Coletas</CardTitle>
        <CardDescription>
          Selecione um dia para visualizar e exportar os dados
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : coletasPorDia.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coletasPorDia.map((dia) => (
              <Card
                key={dia.data}
                className="cursor-pointer hover-elevate active-elevate-2 transition-all"
                onClick={() => setDiaSelecionado(dia.data)}
                data-testid={`card-dia-${dia.data}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">
                      {format(parseISO(dia.data), "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total de registros:
                      </span>
                      <span className="text-2xl font-semibold text-foreground">
                        {dia.total}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Absorventes e Fraldas Tape
                        </p>
                        <p className="text-lg font-medium">
                          {dia.grupo1.length}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {dia.grupo1.map((c) => c.linhaProducao).join(", ") ||
                            "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Fraldas Pants
                        </p>
                        <p className="text-lg font-medium">
                          {dia.grupo2.length}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {dia.grupo2.map((c) => c.linhaProducao).join(", ") ||
                            "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma coleta registrada</p>
            <p className="text-sm mt-2">
              Use a aba "Entrada de Dados" para adicionar novas coletas
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
