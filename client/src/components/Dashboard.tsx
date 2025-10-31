import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ColetaGrupo1, type ColetaGrupo2 } from "@shared/schema";
import { format, parseISO, isWithinInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Calendar, Trash2, Filter } from "lucide-react";
import DashboardDia from "./DashboardDia";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useConfirmer } from "@/components/ui/confirmer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface ColetasPorDia {
  data: string;
  grupo1: ColetaGrupo1[];
  grupo2: ColetaGrupo2[];
  total: number;
}

export default function Dashboard() {
  const [diasSelecionado, setDiaSelecionado] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<"todos" | "semana" | "mes" | "dia">("todos");
  const [diaEspecifico, setDiaEspecifico] = useState<Date | undefined>(undefined);
  const { toast } = useToast();
  const { confirm, ConfirmerDialog } = useConfirmer();

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

  const deleteDiaMutation = useMutation({
    mutationFn: async (data: string) => {
      const coletasDia = coletasPorDia.find((d) => d.data === data);
      if (!coletasDia) return;

      const promises = [
        ...coletasDia.grupo1.map((c) => apiRequest("DELETE", `/api/coleta/grupo1/${c.id}`)),
        ...coletasDia.grupo2.map((c) => apiRequest("DELETE", `/api/coleta/grupo2/${c.id}`)),
      ];

      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coleta/grupo1"] });
      queryClient.invalidateQueries({ queryKey: ["/api/coleta/grupo2"] });
      toast({ title: "Sucesso!", description: "Todos os registros do dia foram excluídos." });
    },
    onError: () => {
      toast({ title: "Erro", description: "Falha ao excluir registros.", variant: "destructive" });
    },
  });

  const excluirDia = (data: string, event: React.MouseEvent) => {
    event.stopPropagation();
    confirm(
      () => deleteDiaMutation.mutate(data),
      {
        title: "Excluir todos os registros do dia?",
        description: `Tem certeza que deseja excluir TODOS os registros do dia ${format(parseISO(data), "dd/MM/yyyy", { locale: ptBR })}? Esta ação não pode ser desfeita.`,
      }
    );
  };

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
    let allDias = Array.from(diasMap.values()).sort((a, b) => {
      return new Date(b.data).getTime() - new Date(a.data).getTime();
    });

    // Aplicar filtros
    if (filtro === "semana") {
      const hoje = new Date();
      const inicioSemana = startOfWeek(hoje, { locale: ptBR });
      const fimSemana = endOfWeek(hoje, { locale: ptBR });
      allDias = allDias.filter((dia) =>
        isWithinInterval(parseISO(dia.data), { start: inicioSemana, end: fimSemana })
      );
    } else if (filtro === "mes") {
      const hoje = new Date();
      const inicioMes = startOfMonth(hoje);
      const fimMes = endOfMonth(hoje);
      allDias = allDias.filter((dia) =>
        isWithinInterval(parseISO(dia.data), { start: inicioMes, end: fimMes })
      );
    } else if (filtro === "dia" && diaEspecifico) {
      const diaFormatado = format(diaEspecifico, "yyyy-MM-dd");
      allDias = allDias.filter((dia) => dia.data === diaFormatado);
    }

    coletasPorDia.push(...allDias);
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
    <>
      {ConfirmerDialog}
      <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Dashboard de Coletas</CardTitle>
            <CardDescription>
              Selecione um dia para visualizar e exportar os dados
            </CardDescription>
          </div>
          <div className="flex gap-2 items-center max-w-md md:max-w-none">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select value={filtro} onValueChange={(value: any) => setFiltro(value)}>
              <SelectTrigger className="w-full md:w-[180px]" data-testid="select-filtro">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="semana">Esta Semana</SelectItem>
                <SelectItem value="mes">Este Mês</SelectItem>
                <SelectItem value="dia">Dia Específico</SelectItem>
              </SelectContent>
            </Select>
            {filtro === "dia" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-shrink-0">
                    {diaEspecifico ? format(diaEspecifico, "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarComponent
                    mode="single"
                    selected={diaEspecifico}
                    onSelect={setDiaEspecifico}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">
                        {format(parseISO(dia.data), "dd 'de' MMMM 'de' yyyy", {
                          locale: ptBR,
                        })}
                      </CardTitle>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={(e) => excluirDia(dia.data, e)}
                      data-testid={`button-delete-dia-${dia.data}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
    </>
  );
}
