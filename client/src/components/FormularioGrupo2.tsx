import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertColetaGrupo2Schema, type InsertColetaGrupo2 } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface FormularioGrupo2Props {
  dataColeta: string;
  linhaProducao: string;
}

const CAMPOS_GRUPO2 = [
  { name: "velocidadeLinha", label: "Velocidade da Linha" },
  { name: "waistPacker", label: "Waist Packer" },
  { name: "isgElastic", label: "ISG Elastic" },
  { name: "waistElastic", label: "Waist Elastic" },
  { name: "isgSideSeal", label: "ISG Side Seal" },
  { name: "absorventFix", label: "Absorvent Fix" },
  { name: "outerEdge", label: "Outer Edge" },
  { name: "inner", label: "Inner" },
  { name: "bead", label: "Bead" },
  { name: "standingGather", label: "Standing Gather" },
  { name: "backflimFix", label: "Backflim Fix" },
  { name: "osgSideSeal", label: "OSG Side Seal" },
  { name: "osgElastico", label: "OSG Elástico" },
  { name: "nwSealContLateral", label: "NW Seal Cont (Lateral)" },
  { name: "nwSealIntCentRal", label: "NW Seal Int Cent (RAL)" },
  { name: "outSideBackFlm", label: "Out Side Back FLM" },
  { name: "topsheetFix", label: "Topsheet Fix" },
  { name: "coreWrap", label: "Core Wrap" },
  { name: "coreWrapSeal", label: "Core Wrap Seal" },
  { name: "matFix", label: "Mat Fix" },
] as const;

export default function FormularioGrupo2({ dataColeta, linhaProducao }: FormularioGrupo2Props) {
  const { toast } = useToast();

  const form = useForm<InsertColetaGrupo2>({
    resolver: zodResolver(insertColetaGrupo2Schema),
    defaultValues: {
      dataColeta,
      linhaProducao,
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
      });
      form.reset({
        dataColeta,
        linhaProducao,
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
    mutation.mutate({ ...data, dataColeta, linhaProducao });
  };

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">
        Formulário Grupo 2 - {linhaProducao}
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAMPOS_GRUPO2.map((campo) => (
              <FormField
                key={campo.name}
                control={form.control}
                name={campo.name as any}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      {campo.label}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="text-right font-mono"
                        data-testid={`input-${campo.name}`}
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
