import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import FormularioGrupo1 from "./FormularioGrupo1";
import FormularioGrupo2 from "./FormularioGrupo2";
import { useQuery } from "@tanstack/react-query";
import { type ColetaGrupo1, type ColetaGrupo2 } from "@shared/schema";

const LINHAS_GRUPO1 = [
  "L90",
  "L91",
  "L92",
  "L93",
  "L94",
  "L80",
  "L81",
  "L82",
  "L83",
];
const LINHAS_GRUPO2 = ["L84", "L85"];
const TODAS_LINHAS = [...LINHAS_GRUPO1, ...LINHAS_GRUPO2];

export default function FormularioDeEntrada() {
  const [dataColeta, setDataColeta] = useState<Date>(new Date());
  const [linhaProducao, setLinhaProducao] = useState<string>("");
  const [mostrarFormulario, setMostrarFormulario] = useState<boolean>(true);

  const isGrupo1 = LINHAS_GRUPO1.includes(linhaProducao);
  const isGrupo2 = LINHAS_GRUPO2.includes(linhaProducao);

  const { data: grupo1Data } = useQuery<ColetaGrupo1[]>({
    queryKey: ["/api/coleta/grupo1"],
  });

  const { data: grupo2Data } = useQuery<ColetaGrupo2[]>({
    queryKey: ["/api/coleta/grupo2"],
  });

  const dataColetaFormatada = format(dataColeta, "yyyy-MM-dd");
  
  const linhasRegistradas = new Set<string>();
  grupo1Data?.forEach((coleta) => {
    if (coleta.dataColeta === dataColetaFormatada) {
      linhasRegistradas.add(coleta.linhaProducao);
    }
  });
  grupo2Data?.forEach((coleta) => {
    if (coleta.dataColeta === dataColetaFormatada) {
      linhasRegistradas.add(coleta.linhaProducao);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Coleta de Dados</CardTitle>
        <CardDescription>
          Selecione a data e a linha de produção para iniciar o registro
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="data-coleta">Data da Coleta</Label>
            <Button
              id="data-coleta"
              variant="outline"
              disabled
              className={cn(
                "w-full justify-start text-left font-normal opacity-60 cursor-not-allowed",
              )}
              data-testid="button-data-coleta"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(dataColeta, "PPP", { locale: ptBR })}
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linha-producao">Linha de Produção</Label>
            <Select value={linhaProducao} onValueChange={setLinhaProducao}>
              <SelectTrigger
                id="linha-producao"
                data-testid="select-linha-producao"
              >
                <SelectValue placeholder="Selecione a linha" />
              </SelectTrigger>
              <SelectContent>
                {TODAS_LINHAS.map((linha) => (
                  <SelectItem
                    key={linha}
                    value={linha}
                    disabled={linhasRegistradas.has(linha)}
                    data-testid={`option-linha-${linha}`}
                  >
                    {linha} {linhasRegistradas.has(linha) && "(já registrado)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {linhaProducao && (
          <div className="mt-6 pt-6 border-t">
            {!mostrarFormulario && (
              <Button
                onClick={() => setMostrarFormulario(true)}
                variant="outline"
                className="w-full"
              >
                Adicionar Nova Coleta
              </Button>
            )}
            {mostrarFormulario && (
              <>
                {isGrupo1 && (
                  <FormularioGrupo1
                    dataColeta={format(dataColeta, "yyyy-MM-dd")}
                    linhaProducao={linhaProducao}
                    onSalvarSucesso={() => setMostrarFormulario(false)}
                  />
                )}
                {isGrupo2 && (
                  <FormularioGrupo2
                    dataColeta={format(dataColeta, "yyyy-MM-dd")}
                    linhaProducao={linhaProducao}
                    onSalvarSucesso={() => setMostrarFormulario(false)}
                  />
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
