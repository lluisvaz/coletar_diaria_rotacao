import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  insertColetaGrupo1Schema,
  type InsertColetaGrupo1,
  type ColetaGrupo1,
} from "@shared/schema";
import { formatInTimeZone } from "date-fns-tz";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface FormularioGrupo1Props {
  dataColeta: string;
  linhaProducao: string;
  onSalvarSucesso?: () => void;
}

const CAMPOS_GRUPO1 = [
  { name: "sku", label: "SKU", type: "text" },
  { name: "pesoSacolaVarpe", label: "Peso da Sacola na Varpe", type: "number" },
  { name: "velocidadeLinha", label: "Velocidade da Linha", type: "number" },
  { name: "coreAttach", label: "Core Attach", type: "number" },
  { name: "coreWrap", label: "Core Wrap", type: "number" },
  { name: "surge", label: "Surge", type: "number" },
  { name: "cuffEnd", label: "Cuff End", type: "number" },
  { name: "bead", label: "Bead", type: "number" },
  { name: "legElastic", label: "Leg Elastic", type: "number" },
  { name: "cuffElastic", label: "Cuff Elastic", type: "number" },
  { name: "temporary", label: "Temporary", type: "number" },
  { name: "topsheet", label: "Topsheet (Non Woven)", type: "number" },
  { name: "backsheet", label: "Backsheet (Poly)", type: "number" },
  { name: "frontal", label: "Frontal", type: "number" },
  { name: "earAttach", label: "Ear Attach", type: "number" },
  { name: "pulpFix", label: "Pulp Fix", type: "number" },
  { name: "central", label: "Central", type: "number" },
  { name: "release", label: "Release", type: "number" },
  { name: "tapeOnBag", label: "Tape on Bag", type: "number" },
  { name: "filme1x1", label: "Filme 1x1", type: "number" },
] as const;

export default function FormularioGrupo1({
  dataColeta,
  linhaProducao,
  onSalvarSucesso,
}: FormularioGrupo1Props) {
  const { toast } = useToast();

  const { data: coletasExistentes } = useQuery<ColetaGrupo1[]>({
    queryKey: ["/api/coleta/grupo1"],
  });

  const form = useForm<InsertColetaGrupo1>({
    resolver: zodResolver(insertColetaGrupo1Schema),
    defaultValues: {
      dataColeta,
      linhaProducao,
      sku: "",
      pesoSacolaVarpe: 0,
      velocidadeLinha: 0,
      coreAttach: 0,
      coreWrap: 0,
      surge: 0,
      cuffEnd: 0,
      bead: 0,
      legElastic: 0,
      cuffElastic: 0,
      temporary: 0,
      topsheet: 0,
      backsheet: 0,
      frontal: 0,
      earAttach: 0,
      pulpFix: 0,
      central: 0,
      release: 0,
      tapeOnBag: 0,
      filme1x1: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertColetaGrupo1) =>
      apiRequest("POST", "/api/coleta/grupo1", data),
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Coleta salva com sucesso.",
      });
      form.reset({
        dataColeta,
        linhaProducao,
        sku: "",
        pesoSacolaVarpe: 0,
        velocidadeLinha: 0,
        coreAttach: 0,
        coreWrap: 0,
        surge: 0,
        cuffEnd: 0,
        bead: 0,
        legElastic: 0,
        cuffElastic: 0,
        temporary: 0,
        topsheet: 0,
        backsheet: 0,
        frontal: 0,
        earAttach: 0,
        pulpFix: 0,
        central: 0,
        release: 0,
        tapeOnBag: 0,
        filme1x1: 0,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/coleta/grupo1"] });
      onSalvarSucesso?.();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao salvar a coleta. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertColetaGrupo1) => {
    const hoje = formatInTimeZone(
      new Date(),
      "America/Sao_Paulo",
      "yyyy-MM-dd",
    );
    if (dataColeta !== hoje) {
      toast({
        title: "Data inválida",
        description: "Só é permitido registrar dados do dia atual.",
        variant: "destructive",
      });
      return;
    }

    const jaRegistrado = coletasExistentes?.some(
      (c) => c.dataColeta === dataColeta && c.linhaProducao === linhaProducao,
    );
    if (jaRegistrado) {
      toast({
        title: "Linha já registrada",
        description: `A linha ${linhaProducao} já possui registro para o dia ${new Date(dataColeta).toLocaleDateString("pt-BR")}.`,
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({ ...data, dataColeta, linhaProducao });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {CAMPOS_GRUPO1.map((campo) => (
              <FormField
                key={campo.name}
                control={form.control}
                name={campo.name as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium">
                      {campo.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={campo.type || "number"}
                        step={campo.type === "number" ? "0.01" : undefined}
                        placeholder={campo.type === "text" ? "" : "0.00"}
                        className="text-center font-mono h-8 text-sm"
                        data-testid={`input-${campo.name}`}
                        {...field}
                        onChange={(e) =>
                          campo.type === "text"
                            ? field.onChange(e.target.value)
                            : field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full md:w-auto px-8"
              data-testid="button-salvar-grupo1"
            >
              {mutation.isPending ? "Salvando..." : "Salvar Coleta"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
