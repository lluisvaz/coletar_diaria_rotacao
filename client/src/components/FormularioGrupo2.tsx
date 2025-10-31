import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  insertColetaGrupo2Schema,
  type InsertColetaGrupo2,
  type ColetaGrupo2,
} from "@shared/schema";
import { formatInTimeZone } from "date-fns-tz";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

interface FormularioGrupo2Props {
  dataColeta: string;
  linhaProducao: string;
  onSalvarSucesso?: () => void;
}

// Campos iniciais (em azul) para Grupo 2
const CAMPOS_INICIAIS_GRUPO2 = [
  { name: "sku", label: "SKU", type: "text", destaque: true },
  { name: "pesoSacolaVarpe", label: "Peso da Sacola na Varpe", type: "number", destaque: true },
] as const;

// Campos adicionais para todas as linhas do Grupo 2 (L84 e L85) (em azul)
const CAMPOS_ESPECIAIS_GRUPO2 = [
  { name: "parametroPainel", label: "Parâmetro do Painel", type: "number", destaque: true },
  { name: "acrisson", label: "Acrisson", type: "number", destaque: true },
] as const;

const CAMPOS_GRUPO2 = [
  { name: "velocidadeLinha", label: "Velocidade da Linha", type: "number" },
  { name: "waistPacker", label: "Waist Packer", type: "number" },
  { name: "isgElastic", label: "ISG Elastic", type: "number" },
  { name: "waistElastic", label: "Waist Elastic", type: "number" },
  { name: "isgSideSeal", label: "ISG Side Seal", type: "number" },
  { name: "absorventFix", label: "Absorvent Fix", type: "number" },
  { name: "outerEdge", label: "Outer Edge", type: "number" },
  { name: "inner", label: "Inner", type: "number" },
  { name: "bead", label: "Bead", type: "number" },
  { name: "standingGather", label: "Standing Gather", type: "number" },
  { name: "backflimFix", label: "Backflim Fix", type: "number" },
  { name: "osgSideSeal", label: "OSG Side Seal", type: "number" },
  { name: "osgElastico", label: "OSG Elástico", type: "number" },
  {
    name: "nwSealContLateral",
    label: "NW Seal Cont (Lateral)",
    type: "number",
  },
  { name: "nwSealIntCentRal", label: "NW Seal Int Cent (RAL)", type: "number" },
  { name: "outSideBackFlm", label: "Out Side Back FLM", type: "number" },
  { name: "topsheetFix", label: "Topsheet Fix", type: "number" },
  { name: "coreWrap", label: "Core Wrap", type: "number" },
  { name: "coreWrapSeal", label: "Core Wrap Seal", type: "number" },
  { name: "matFix", label: "Mat Fix", type: "number" },
] as const;

const todosOsCamposGrupo2 = [
  ...CAMPOS_INICIAIS_GRUPO2,
  ...CAMPOS_ESPECIAIS_GRUPO2,
  ...CAMPOS_GRUPO2,
];

export default function FormularioGrupo2({
  dataColeta,
  linhaProducao,
  onSalvarSucesso,
}: FormularioGrupo2Props) {
  const { toast } = useToast();

  const { data: coletasExistentes, isLoading } = useQuery<ColetaGrupo2[]>({
    queryKey: ["/api/coleta/grupo2"],
  });

  const form = useForm<InsertColetaGrupo2>({
    resolver: zodResolver(insertColetaGrupo2Schema),
    defaultValues: {
      dataColeta,
      linhaProducao,
      sku: "",
      pesoSacolaVarpe: 0,
      parametroPainel: 0,
      acrisson: 0,
      velocidadeLinha: 0,
      waistPacker: 0,
      isgElastic: 0,
      waistElastic: 0,
      isgSideSeal: 0,
      absorventFix: 0,
      outerEdge: 0,
      inner: 0,
      bead: 0,
      standingGather: 0,
      backflimFix: 0,
      osgSideSeal: 0,
      osgElastico: 0,
      nwSealContLateral: 0,
      nwSealIntCentRal: 0,
      outSideBackFlm: 0,
      topsheetFix: 0,
      coreWrap: 0,
      coreWrapSeal: 0,
      matFix: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: InsertColetaGrupo2) =>
      apiRequest("POST", "/api/coleta/grupo2", data),
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Coleta salva com sucesso.",
        variant: "success",
      });
      form.reset({
        dataColeta,
        linhaProducao,
        sku: "",
        pesoSacolaVarpe: 0,
        parametroPainel: 0,
        acrisson: 0,
        velocidadeLinha: 0,
        waistPacker: 0,
        isgElastic: 0,
        waistElastic: 0,
        isgSideSeal: 0,
        absorventFix: 0,
        outerEdge: 0,
        inner: 0,
        bead: 0,
        standingGather: 0,
        backflimFix: 0,
        osgSideSeal: 0,
        osgElastico: 0,
        nwSealContLateral: 0,
        nwSealIntCentRal: 0,
        outSideBackFlm: 0,
        topsheetFix: 0,
        coreWrap: 0,
        coreWrapSeal: 0,
        matFix: 0,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/coleta/grupo2"] });
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

  const onSubmit = (data: InsertColetaGrupo2) => {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {todosOsCamposGrupo2.map((campo) => (
            <div key={campo.name} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {todosOsCamposGrupo2.map((campo) => (
              <FormField
                key={campo.name}
                control={form.control}
                name={campo.name as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={`text-xs font-medium ${"destaque" in campo && campo.destaque ? "text-blue-600 dark:text-blue-400" : ""}`}>
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
              data-testid="button-salvar-grupo2"
            >
              {mutation.isPending ? "Salvando..." : "Salvar Coleta"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
