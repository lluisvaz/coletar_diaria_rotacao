import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  insertColetaGrupo2Schema,
  type InsertColetaGrupo2,
} from "@shared/schema";
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

interface FormularioGrupo2Props {
  dataColeta: string;
  linhaProducao: string;
  onSalvarSucesso?: () => void;
}

const CAMPOS_GRUPO2 = [
  { name: "sku", label: "SKU", type: "text" },
  { name: "pesoSacolaVarpe", label: "Peso da Sacola na Varpe", type: "number" },
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
  { name: "nwSealContLateral", label: "NW Seal Cont (Lateral)", type: "number" },
  { name: "nwSealIntCentRal", label: "NW Seal Int Cent (RAL)", type: "number" },
  { name: "outSideBackFlm", label: "Out Side Back FLM", type: "number" },
  { name: "topsheetFix", label: "Topsheet Fix", type: "number" },
  { name: "coreWrap", label: "Core Wrap", type: "number" },
  { name: "coreWrapSeal", label: "Core Wrap Seal", type: "number" },
  { name: "matFix", label: "Mat Fix", type: "number" },
] as const;

export default function FormularioGrupo2({
  dataColeta,
  linhaProducao,
  onSalvarSucesso,
}: FormularioGrupo2Props) {
  const { toast } = useToast();

  const form = useForm<InsertColetaGrupo2>({
    resolver: zodResolver(insertColetaGrupo2Schema),
    defaultValues: {
      dataColeta,
      linhaProducao,
      sku: '',
      pesoSacolaVarpe: 0,
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
        sku: '',
        pesoSacolaVarpe: 0,
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
    mutation.mutate({ ...data, dataColeta, linhaProducao });
  };

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">
        Preencha corretamente os dados da {linhaProducao}
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
