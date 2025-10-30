import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type ColetaGrupo1, type ColetaGrupo2 } from "@shared/schema";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import * as XLSX from "xlsx";

interface DashboardDiaProps {
  data: string;
  grupo1: ColetaGrupo1[];
  grupo2: ColetaGrupo2[];
  onVoltar: () => void;
}

export default function DashboardDia({ data, grupo1, grupo2, onVoltar }: DashboardDiaProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const exportarParaExcel = () => {
    try {
      const wb = XLSX.utils.book_new();

      // Formatar data para exibição
      const dataObj = parseISO(data);
      const dia = format(dataObj, "dd", { locale: ptBR });
      const mes = format(dataObj, "MMMM", { locale: ptBR }).toUpperCase();

      const titulo = "COLETA DIÁRIA DE ROTAÇÕES DAS BOMBAS DO SISTEMA NORDSON";

      // --- Planilha 1: ABS e Tape (L.90-L.83) ---
      if (grupo1.length > 0) {
        const dadosGrupo1: any[][] = [
          [titulo],
          [],
          [null, "DIA", dia, "MÊS", mes],
          [
            "LINHA",
            "VELOCIDADE DA LINHA",
            "CORE ATTACH (ADESIVO CENTRAL)",
            "CORE WRAP (ADESIVO LATERAL)",
            "SURGE",
            "CUFF END",
            "BEAD",
            "LEG ELASTIC (ELÁSTICO DA PERNA)",
            "CUFF ELASTIC (ELÁSTICO DA CUFF)",
            "TEMPORARY",
            "TOPSHEET (NON WOVEN)",
            "BACKSHEET (POLY)",
            "FRONTAL",
            "EAR ATTACH",
            "PULP FIX",
            "CENTRAL",
            "RELEASE",
            "TAPE ON BAG",
            "FILME 1X1" 
          ]
        ];

        const grupo1Ordenado = [...grupo1].sort((a, b) => a.linhaProducao.localeCompare(b.linhaProducao));
        grupo1Ordenado.forEach(coleta => {
          dadosGrupo1.push([
            coleta.linhaProducao,
            coleta.velocidadeLinha,
            coleta.coreAttach,
            coleta.coreWrap,
            coleta.surge,
            coleta.cuffEnd,
            coleta.bead,
            coleta.legElastic,
            coleta.cuffElastic,
            coleta.temporary,
            coleta.topsheet,
            coleta.backsheet,
            coleta.frontal,
            coleta.earAttach,
            coleta.pulpFix,
            coleta.central,
            coleta.release,
            coleta.tapeOnBag,
            coleta.flumeY, 
          ]);
        });

        const wsGrupo1 = XLSX.utils.aoa_to_sheet(dadosGrupo1);

        wsGrupo1['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 18 } },
          { s: { r: 2, c: 1 }, e: { r: 2, c: 2 } },
          { s: { r: 2, c: 3 }, e: { r: 2, c: 4 } },
        ];
        
        wsGrupo1['!cols'] = [
          { wch: 8 },
          { wch: 12 },
          { wch: 14 },
          { wch: 14 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 14 },
          { wch: 14 },
          { wch: 12 },
          { wch: 12 },
          { wch: 12 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 12 },
          { wch: 12 },
        ];

        XLSX.utils.book_append_sheet(wb, wsGrupo1, "ABS e Tape");
      }

      // --- Planilha 2: Pants (L.84-L.85) ---
      if (grupo2.length > 0) {
        const dadosGrupo2: any[][] = [
          [titulo],
          [],
          [null, "DIA", dia, "MÊS", mes],
          [
            "LINHA", 
            "VELOCIDADE DA LINHA",
            "WAIST PACKER",
            "ISG ELASTIC",
            "WAIST ELASTIC",
            "ISG SIDE SEAL", 
            "ABSORVENT FIX",
            "OUTER EDGE",
            "INNER",
            "BEAD",
            "STANDING GATHER FRONT B. FIX", 
            "BACKFILM FIX",
            "OSG SIDE SEAL",
            "OSG ELÁSTICO (LATERAL)",
            "NW SEAL CONT (LATERAL)", 
            "NW SEAL INT CENT (RAL)",
            "OUT SIDE BACK FILM FIX",
            "TOPSHEET FIX",
            "CORE WRAP",
            "CORE WRAP SIDE SEAL",
            "MAT FIX"
          ]
        ];
        
        const grupo2Ordenado = [...grupo2].sort((a, b) => a.linhaProducao.localeCompare(b.linhaProducao));
        grupo2Ordenado.forEach(coleta => {
          dadosGrupo2.push([
            coleta.linhaProducao,
            coleta.velocidadeLinha,
            coleta.waistPacker,
            coleta.isgElastic,
            coleta.waistElastic,
            coleta.isgSideSeal,
            coleta.absorventFix,
            coleta.outerEdge,
            coleta.inner,
            coleta.bead,
            coleta.standingGather,
            coleta.backflimFix,
            coleta.osgSideSeal,
            coleta.osgElastico,
            coleta.nwSealContLateral,
            coleta.nwSealIntCentRal,
            coleta.outSideBackFlm,
            coleta.topsheetFix,
            coleta.coreWrap,
            coleta.coreWrapSeal,
            coleta.matFix,
          ]);
        });

        const wsGrupo2 = XLSX.utils.aoa_to_sheet(dadosGrupo2);
        
        wsGrupo2['!merges'] = [
          { s: { r: 0, c: 0 }, e: { r: 0, c: 20 } },
          { s: { r: 2, c: 1 }, e: { r: 2, c: 2 } },
          { s: { r: 2, c: 3 }, e: { r: 2, c: 4 } },
        ];

        wsGrupo2['!cols'] = [
          { wch: 8 },
          { wch: 12 },
          { wch: 12 },
          { wch: 10 },
          { wch: 12 },
          { wch: 14 },
          { wch: 12 },
          { wch: 10 },
          { wch: 10 },
          { wch: 10 },
          { wch: 14 },
          { wch: 12 },
          { wch: 12 },
          { wch: 12 },
          { wch: 12 },
          { wch: 14 },
          { wch: 14 },
          { wch: 12 },
          { wch: 10 },
          { wch: 14 },
          { wch: 10 },
        ];

        XLSX.utils.book_append_sheet(wb, wsGrupo2, "Pants");
      }

      const dataFormatada = format(parseISO(data), "dd-MM-yyyy", { locale: ptBR });
      XLSX.writeFile(wb, `Coleta_Nordson_${dataFormatada}.xlsx`);

      toast({
        title: "Exportação concluída!",
        description: `Arquivo Excel gerado com sucesso para o dia ${format(parseISO(data), "dd/MM/yyyy", { locale: ptBR })}.`,
      });

    } catch (error) {
      console.error("Erro ao exportar para Excel:", error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo Excel. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Ordenar coletas por linha de produção
  const grupo1Ordenado = [...grupo1].sort((a, b) => a.linhaProducao.localeCompare(b.linhaProducao));
  const grupo2Ordenado = [...grupo2].sort((a, b) => a.linhaProducao.localeCompare(b.linhaProducao));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={onVoltar}
              data-testid="button-voltar"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>
                Coletas do dia {format(parseISO(data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </CardTitle>
              <CardDescription>
                Visualização em formato de planilha
              </CardDescription>
            </div>
          </div>
          {!isMobile && (
            <Button
              onClick={exportarParaExcel}
              className="gap-2"
              data-testid="button-exportar-excel"
            >
              <Download className="h-4 w-4" />
              Exportar para Excel
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Grupo 1 - L.90 até L.83 */}
        {grupo1Ordenado.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Absorventes e Fraldas Tape</h4>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead rowSpan={3} className="sticky left-0 bg-card z-10 border-r font-semibold">Linha</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Velocidade<br/>da Linha</TableHead>
                    <TableHead colSpan={2} className="text-center border-r font-semibold">Core</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Surge</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Cuff End</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Bead</TableHead>
                    <TableHead colSpan={2} className="text-center border-r font-semibold">Elástico</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Temporary</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Topsheet</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Backsheet</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Frontal</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Ear Attach</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Pulp Fix</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Central</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Release</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Tape on Bag</TableHead>
                    <TableHead rowSpan={3} className="text-center font-semibold">Flume Y</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="text-center border-r text-xs">Attach</TableHead>
                    <TableHead className="text-center border-r text-xs">Wrap</TableHead>
                    <TableHead className="text-center border-r text-xs">Leg</TableHead>
                    <TableHead className="text-center border-r text-xs">Cuff</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grupo1Ordenado.map((coleta) => (
                    <TableRow key={coleta.id}>
                      <TableCell className="sticky left-0 bg-card font-medium border-r">{coleta.linhaProducao}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.velocidadeLinha.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.coreAttach.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.coreWrap.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.surge.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.cuffEnd.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.bead.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.legElastic.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.cuffElastic.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.temporary.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.topsheet.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.backsheet.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.frontal.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.earAttach.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.pulpFix.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.central.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.release.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.tapeOnBag.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono">{coleta.flumeY.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Grupo 2 - L.84 e L.85 */}
        {grupo2Ordenado.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2">Fraldas Pants</h4>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead rowSpan={3} className="sticky left-0 bg-card z-10 border-r font-semibold">Linha</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Velocidade<br/>da Linha</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Waist Packer</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">ISG Elastic</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Waist Elastic</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">ISG Side Seal</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Absorvent Fix</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Outer Edge</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Inner</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Bead</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Standing Gather</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Backflim Fix</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">OSG Side Seal</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">OSG Elástico</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">NW Seal Cont</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">NW Seal Int Cent</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Out Side Back FLM</TableHead>
                    <TableHead rowSpan={3} className="text-center border-r font-semibold">Topsheet Fix</TableHead>
                    <TableHead colSpan={2} className="text-center border-r font-semibold">Core Wrap</TableHead>
                    <TableHead rowSpan={3} className="text-center font-semibold">Mat Fix</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="text-center border-r text-xs">Wrap</TableHead>
                    <TableHead className="text-center border-r text-xs">Seal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grupo2Ordenado.map((coleta) => (
                    <TableRow key={coleta.id}>
                      <TableCell className="sticky left-0 bg-card font-medium border-r">{coleta.linhaProducao}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.velocidadeLinha.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.waistPacker.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.isgElastic.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.waistElastic.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.isgSideSeal.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.absorventFix.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.outerEdge.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.inner.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.bead.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.standingGather.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.backflimFix.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.osgSideSeal.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.osgElastico.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.nwSealContLateral.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.nwSealIntCentRal.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.outSideBackFlm.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.topsheetFix.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.coreWrap.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono border-r">{coleta.coreWrapSeal.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-mono">{coleta.matFix.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {grupo1Ordenado.length === 0 && grupo2Ordenado.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhuma coleta registrada para este dia</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
