import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertColetaGrupo1Schema, type InsertColetaGrupo1 } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface FormularioGrupo1Props {
  dataColeta: string;
  linhaProducao: string;
}

const CAMPOS_GRUPO1 = [
  { name: "velocidadeLinha", label: "Velocidade da Linha" },
  { name: "coreAttach", label: "Core Attach" },
  { name: "coreWrap", label: "Core Wrap" },
  { name: "surge", label: "Surge" },
  { name: "cuffEnd", label: "Cuff End" },
  { name: "bead", label: "Bead" },
  { name: "legElastic", label: "Leg Elastic" },
  { name: "cuffElastic", label: "Cuff Elastic" },
  { name: "temporary", label: "Temporary" },
  { name: "topsheet", label: "Topsheet (Non Woven)" },
  { name: "backsheet", label: "Backsheet (Poly)" },
  { name: "frontal", label: "Frontal" },
  { name: "earAttach", label: "Ear Attach" },
  { name: "pulpFix", label: "Pulp Fix" },
  { name: "central", label: "Central" },
  { name: "release", label: "Release" },
  { name: "tapeOnBag", label: "Tape on Bag" },
  { name: "filme1x1", label: "Filme 1x1" },
] as const;

export default function FormularioGrupo1({ dataColeta, linhaProducao }: FormularioGrupo1Props) {
  const { toast } = useToast();

  const form = useForm<InsertColetaGrupo1>({
    resolver: zodResolver(insertColetaGrupo1Schema),
    defaultValues: {
      dataColeta,
      linhaProducao,
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
    mutation.mutate({ ...data, dataColeta, linhaProducao });
  };

  return (
    <div>
      <h3 className="text-xl font-medium mb-4">
        Formulário Grupo 1 - {linhaProducao}
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAMPOS_GRUPO1.map((campo) => (
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
