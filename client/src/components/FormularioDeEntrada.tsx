import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import FormularioGrupo1 from "./FormularioGrupo1";
import FormularioGrupo2 from "./FormularioGrupo2";

const LINHAS_GRUPO1 = ["L.90", "L.91", "L.92", "L.93", "L.94", "L.80", "L.81", "L.82", "L.83"];
const LINHAS_GRUPO2 = ["L.84", "L.85"];
const TODAS_LINHAS = [...LINHAS_GRUPO1, ...LINHAS_GRUPO2];

export default function FormularioDeEntrada() {
  const [dataColeta, setDataColeta] = useState<Date>(new Date());
  const [linhaProducao, setLinhaProducao] = useState<string>("");

  const isGrupo1 = LINHAS_GRUPO1.includes(linhaProducao);
  const isGrupo2 = LINHAS_GRUPO2.includes(linhaProducao);

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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="data-coleta"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dataColeta && "text-muted-foreground"
                  )}
                  data-testid="button-data-coleta"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataColeta ? (
                    format(dataColeta, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataColeta}
                  onSelect={(date) => date && setDataColeta(date)}
                  initialFocus
                  locale={ptBR}
                  data-testid="calendar-data-coleta"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linha-producao">Linha de Produção</Label>
            <Select value={linhaProducao} onValueChange={setLinhaProducao}>
              <SelectTrigger id="linha-producao" data-testid="select-linha-producao">
                <SelectValue placeholder="Selecione a linha" />
              </SelectTrigger>
              <SelectContent>
                {TODAS_LINHAS.map((linha) => (
                  <SelectItem key={linha} value={linha} data-testid={`option-linha-${linha}`}>
                    {linha}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {linhaProducao && (
          <div className="mt-6 pt-6 border-t">
            {isGrupo1 && (
              <FormularioGrupo1
                dataColeta={format(dataColeta, "yyyy-MM-dd")}
                linhaProducao={linhaProducao}
              />
            )}
            {isGrupo2 && (
              <FormularioGrupo2
                dataColeta={format(dataColeta, "yyyy-MM-dd")}
                linhaProducao={linhaProducao}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
