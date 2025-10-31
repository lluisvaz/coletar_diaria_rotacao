import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type ColetaGrupo1, type ColetaGrupo2 } from "@shared/schema";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  Download,
  Trash2,
  Edit,
  Check,
  X,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import ExcelJS from "exceljs";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";

interface DashboardDiaProps {
  data: string;
  grupo1: ColetaGrupo1[];
  grupo2: ColetaGrupo2[];
  onVoltar: () => void;
}

export default function DashboardDia({
  data,
  grupo1,
  grupo2,
  onVoltar,
}: DashboardDiaProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoGrupo, setEditandoGrupo] = useState<1 | 2 | null>(null);
  const [valoresEditados, setValoresEditados] = useState<any>({});

  const updateGrupo1Mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ColetaGrupo1> }) =>
      apiRequest("PUT", `/api/coleta/grupo1/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coleta/grupo1"] });
      toast({ title: "Sucesso!", description: "Registro atualizado." });
      setEditandoId(null);
      setEditandoGrupo(null);
      setValoresEditados({});
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar.",
        variant: "destructive",
      });
    },
  });

  const updateGrupo2Mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ColetaGrupo2> }) =>
      apiRequest("PUT", `/api/coleta/grupo2/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coleta/grupo2"] });
      toast({ title: "Sucesso!", description: "Registro atualizado." });
      setEditandoId(null);
      setEditandoGrupo(null);
      setValoresEditados({});
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar.",
        variant: "destructive",
      });
    },
  });

  const deleteGrupo1Mutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/coleta/grupo1/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coleta/grupo1"] });
      toast({ title: "Sucesso!", description: "Registro excluído." });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao excluir.",
        variant: "destructive",
      });
    },
  });

  const deleteGrupo2Mutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/coleta/grupo2/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coleta/grupo2"] });
      toast({ title: "Sucesso!", description: "Registro excluído." });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao excluir.",
        variant: "destructive",
      });
    },
  });

  const iniciarEdicao = (coleta: ColetaGrupo1 | ColetaGrupo2, grupo: 1 | 2) => {
    setEditandoId(coleta.id);
    setEditandoGrupo(grupo);
    setValoresEditados({ ...coleta });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditandoGrupo(null);
    setValoresEditados({});
  };

  const salvarEdicao = () => {
    if (editandoId === null || editandoGrupo === null) return;

    if (editandoGrupo === 1) {
      updateGrupo1Mutation.mutate({ id: editandoId, data: valoresEditados });
    } else {
      updateGrupo2Mutation.mutate({ id: editandoId, data: valoresEditados });
    }
  };

  const excluirRegistro = (id: number, grupo: 1 | 2) => {
    if (!confirm("Tem certeza que deseja excluir este registro?")) return;

    if (grupo === 1) {
      deleteGrupo1Mutation.mutate(id);
    } else {
      deleteGrupo2Mutation.mutate(id);
    }
  };

  const atualizarCampo = (campo: string, valor: any) => {
    setValoresEditados((prev: any) => ({ ...prev, [campo]: valor }));
  };

  const exportarParaExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();

      const dataObj = parseISO(data);
      const dia = format(dataObj, "dd", { locale: ptBR });
      const mes = format(dataObj, "MMMM", { locale: ptBR }).toUpperCase();

      const titulo = "COLETA DIÁRIA DE ROTAÇÕES DAS BOMBAS DO SISTEMA NORDSON";

      const estiloDados = {
        alignment: {
          horizontal: "center" as const,
          vertical: "middle" as const,
          wrapText: true,
        },
        border: {
          top: { style: "thin" as const },
          bottom: { style: "thin" as const },
          left: { style: "thin" as const },
          right: { style: "thin" as const },
        },
      };

      const estiloCabecalho = {
        ...estiloDados,
        font: { bold: true, size: 10 },
        fill: {
          type: "pattern" as const,
          pattern: "solid" as const,
          fgColor: { argb: "FFD9D9D9" },
        },
      };

      const estiloTitulo = {
        font: { bold: true, size: 11 },
        alignment: {
          horizontal: "center" as const,
          vertical: "middle" as const,
        },
      };

      const estiloDataLabel = {
        font: { bold: true, size: 10 },
        alignment: {
          horizontal: "center" as const,
          vertical: "middle" as const,
        },
      };

      if (grupo1.length > 0) {
        const ws = workbook.addWorksheet("ABS e Tape");

        ws.mergeCells("A1:S1");
        ws.getCell("A1").value = titulo;
        ws.getCell("A1").style = estiloTitulo;

        ws.getCell("B3").value = "DIA";
        ws.getCell("B3").style = estiloDataLabel;
        ws.mergeCells("B3:C3");
        ws.getCell("C3").value = dia;

        ws.getCell("D3").value = "MÊS";
        ws.getCell("D3").style = estiloDataLabel;
        ws.mergeCells("D3:E3");
        ws.getCell("E3").value = mes;

        const headers = [
          "",
          "SKU",
          "PESO SACOLA\nVARPE",
          "VELOCIDADE\nDA LINHA",
          "CORE ATTACH\n(ADESIVO\nCENTRAL)",
          "CORE WRAP\n(ADESIVO\nLATERAL)",
          "SURGE",
          "CUFF END",
          "BEAD",
          "LEG ELASTIC\n(ELÁSTICO DA\nPERNA)",
          "CUFF ELASTIC\n(ELÁSTICO DA\nCUFF)",
          "TEMPORARY",
          "TOPSHEET\n(NON\nWOVEN)",
          "BACKSHEET\n(POLY)",
          "FRONTAL",
          "EAR\nATTACH",
          "PULP FIX",
          "CENTRAL",
          "RELEASE",
          "TAPE ON\nBAG",
          "FILME 1X1",
        ];

        const headerRow = ws.getRow(4);
        headers.forEach((header, index) => {
          const cell = headerRow.getCell(index + 1);
          cell.value = header;
          cell.style = estiloCabecalho;
        });
        headerRow.height = 45;

        const grupo1Ordenado = [...grupo1].sort((a, b) =>
          a.linhaProducao.localeCompare(b.linhaProducao),
        );
        grupo1Ordenado.forEach((coleta, idx) => {
          const row = ws.getRow(5 + idx);
          const values = [
            coleta.linhaProducao,
            coleta.sku,
            coleta.pesoSacolaVarpe,
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
            coleta.filme1x1,
          ];

          values.forEach((value, colIdx) => {
            const cell = row.getCell(colIdx + 1);
            cell.value = value;
            cell.style = estiloDados;
          });
        });

        const columnWidths = [
          8, 12, 12, 12, 14, 14, 10, 10, 10, 14, 14, 12, 12, 12, 10, 10, 10, 10,
          10, 12, 12,
        ];
        columnWidths.forEach((width, idx) => {
          ws.getColumn(idx + 1).width = width;
        });
      }

      if (grupo2.length > 0) {
        const ws = workbook.addWorksheet("Pants");

        ws.mergeCells("A1:U1");
        ws.getCell("A1").value = titulo;
        ws.getCell("A1").style = estiloTitulo;

        ws.getCell("B3").value = "DIA";
        ws.getCell("B3").style = estiloDataLabel;
        ws.mergeCells("B3:C3");
        ws.getCell("C3").value = dia;

        ws.getCell("D3").value = "MÊS";
        ws.getCell("D3").style = estiloDataLabel;
        ws.mergeCells("D3:E3");
        ws.getCell("E3").value = mes;

        const headers = [
          "",
          "SKU",
          "PESO SACOLA\nVARPE",
          "VELOCIDADE\nDA LINHA",
          "WAIST\nPACKER",
          "ISG\nELASTIC",
          "WAIST\nELASTIC",
          "ISG SIDE\nSEAL",
          "ABSORVENT\nFIX",
          "OUTER\nEDGE",
          "INNER",
          "BEAD",
          "STANDING\nGATHER\nFRONT B. FIX",
          "BACKFILM\nFIX",
          "OSG SIDE\nSEAL",
          "OSG\nELÁSTICO\n(LATERAL)",
          "NW SEAL\nCONT\n(LATERAL)",
          "NW SEAL\nINT CENT\n(RAL)",
          "OUT SIDE\nBACK FILM\nFIX",
          "TOPSHEET\nFIX",
          "CORE\nWRAP",
          "CORE\nWRAP SIDE\nSEAL",
          "MAT FIX",
        ];

        const headerRow = ws.getRow(4);
        headers.forEach((header, index) => {
          const cell = headerRow.getCell(index + 1);
          cell.value = header;
          cell.style = estiloCabecalho;
        });
        headerRow.height = 45;

        const grupo2Ordenado = [...grupo2].sort((a, b) =>
          a.linhaProducao.localeCompare(b.linhaProducao),
        );
        grupo2Ordenado.forEach((coleta, idx) => {
          const row = ws.getRow(5 + idx);
          const values = [
            coleta.linhaProducao,
            coleta.sku,
            coleta.pesoSacolaVarpe,
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
          ];

          values.forEach((value, colIdx) => {
            const cell = row.getCell(colIdx + 1);
            cell.value = value;
            cell.style = estiloDados;
          });
        });

        const columnWidths = [
          8, 12, 12, 12, 12, 10, 12, 14, 12, 10, 10, 10, 14, 12, 12, 12, 12, 14,
          14, 12, 10, 14, 10,
        ];
        columnWidths.forEach((width, idx) => {
          ws.getColumn(idx + 1).width = width;
        });
      }

      const dataFormatada = format(parseISO(data), "dd-MM-yyyy", {
        locale: ptBR,
      });
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Coleta_Nordson_${dataFormatada}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);

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
  const grupo1Ordenado = [...grupo1].sort((a, b) =>
    a.linhaProducao.localeCompare(b.linhaProducao),
  );
  const grupo2Ordenado = [...grupo2].sort((a, b) =>
    a.linhaProducao.localeCompare(b.linhaProducao),
  );

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
                {" "}
                {format(parseISO(data), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </CardTitle>
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
            <h4 className="text-sm font-medium mb-2">
              Absorventes e Fraldas Tape
            </h4>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      rowSpan={3}
                      className="sticky left-0 bg-card z-10 border-r font-semibold"
                    >
                      Linha
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      SKU
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Peso Sacola
                      <br />
                      Varpe
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Velocidade
                      <br />
                      da Linha
                    </TableHead>
                    <TableHead
                      colSpan={2}
                      className="text-center border-r font-semibold"
                    >
                      Core
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Surge
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Cuff End
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Bead
                    </TableHead>
                    <TableHead
                      colSpan={2}
                      className="text-center border-r font-semibold"
                    >
                      Elástico
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Temporary
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Topsheet
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Backsheet
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Frontal
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Ear Attach
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Pulp Fix
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Central
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Release
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Tape on Bag
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center font-semibold"
                    >
                      Filme 1x1
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center font-semibold sticky right-0 bg-card"
                    >
                      Ações
                    </TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="text-center border-r text-xs">
                      Attach
                    </TableHead>
                    <TableHead className="text-center border-r text-xs">
                      Wrap
                    </TableHead>
                    <TableHead className="text-center border-r text-xs">
                      Leg
                    </TableHead>
                    <TableHead className="text-center border-r text-xs">
                      Cuff
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grupo1Ordenado.map((coleta) => {
                    const isEditing =
                      editandoId === coleta.id && editandoGrupo === 1;
                    const displayData = isEditing ? valoresEditados : coleta;

                    const renderCell = (
                      field: keyof ColetaGrupo1,
                      tipo: "text" | "number" = "number",
                    ) =>
                      isEditing ? (
                        <Input
                          type={tipo}
                          step={tipo === "number" ? "0.01" : undefined}
                          value={
                            displayData[field] || (tipo === "number" ? 0 : "")
                          }
                          onChange={(e) =>
                            atualizarCampo(
                              field,
                              tipo === "number"
                                ? parseFloat(e.target.value) || 0
                                : e.target.value,
                            )
                          }
                          className="h-7 text-xs text-center"
                        />
                      ) : (
                        <span>
                          {tipo === "number" &&
                          typeof displayData[field] === "number"
                            ? displayData[field].toFixed(2)
                            : displayData[field]}
                        </span>
                      );

                    return (
                      <TableRow key={coleta.id}>
                        <TableCell className="sticky left-0 bg-card font-medium border-r">
                          {coleta.linhaProducao}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("sku", "text")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("pesoSacolaVarpe")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("velocidadeLinha")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("coreAttach")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("coreWrap")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("surge")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("cuffEnd")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("bead")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("legElastic")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("cuffElastic")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("temporary")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("topsheet")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("backsheet")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("frontal")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("earAttach")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("pulpFix")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("central")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("release")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("tapeOnBag")}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {renderCell("filme1x1")}
                        </TableCell>
                        <TableCell className="sticky right-0 bg-card">
                          <div className="flex gap-1 justify-center">
                            {isEditing ? (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={salvarEdicao}
                                >
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={cancelarEdicao}
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => iniciarEdicao(coleta, 1)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => excluirRegistro(coleta.id, 1)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
                    <TableHead
                      rowSpan={3}
                      className="sticky left-0 bg-card z-10 border-r font-semibold"
                    >
                      Linha
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      SKU
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Peso Sacola
                      <br />
                      Varpe
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Velocidade
                      <br />
                      da Linha
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Waist Packer
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      ISG Elastic
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Waist Elastic
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      ISG Side Seal
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Absorvent Fix
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Outer Edge
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Inner
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Bead
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Standing Gather
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Backflim Fix
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      OSG Side Seal
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      OSG Elástico
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      NW Seal Cont
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      NW Seal Int Cent
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Out Side Back FLM
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center border-r font-semibold"
                    >
                      Topsheet Fix
                    </TableHead>
                    <TableHead
                      colSpan={2}
                      className="text-center border-r font-semibold"
                    >
                      Core Wrap
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center font-semibold"
                    >
                      Mat Fix
                    </TableHead>
                    <TableHead
                      rowSpan={3}
                      className="text-center font-semibold sticky right-0 bg-card"
                    >
                      Ações
                    </TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="text-center border-r text-xs">
                      Wrap
                    </TableHead>
                    <TableHead className="text-center border-r text-xs">
                      Seal
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grupo2Ordenado.map((coleta) => {
                    const isEditing =
                      editandoId === coleta.id && editandoGrupo === 2;
                    const displayData = isEditing ? valoresEditados : coleta;

                    const renderCell = (
                      field: keyof ColetaGrupo2,
                      tipo: "text" | "number" = "number",
                    ) =>
                      isEditing ? (
                        <Input
                          type={tipo}
                          step={tipo === "number" ? "0.01" : undefined}
                          value={
                            displayData[field] || (tipo === "number" ? 0 : "")
                          }
                          onChange={(e) =>
                            atualizarCampo(
                              field,
                              tipo === "number"
                                ? parseFloat(e.target.value) || 0
                                : e.target.value,
                            )
                          }
                          className="h-7 text-xs text-center"
                        />
                      ) : (
                        <span>
                          {tipo === "number" &&
                          typeof displayData[field] === "number"
                            ? displayData[field].toFixed(2)
                            : displayData[field]}
                        </span>
                      );

                    return (
                      <TableRow key={coleta.id}>
                        <TableCell className="sticky left-0 bg-card font-medium border-r">
                          {coleta.linhaProducao}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("sku", "text")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("pesoSacolaVarpe")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("velocidadeLinha")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("waistPacker")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("isgElastic")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("waistElastic")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("isgSideSeal")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("absorventFix")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("outerEdge")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("inner")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("bead")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("standingGather")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("backflimFix")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("osgSideSeal")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("osgElastico")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("nwSealContLateral")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("nwSealIntCentRal")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("outSideBackFlm")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("topsheetFix")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("coreWrap")}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {renderCell("coreWrapSeal")}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {renderCell("matFix")}
                        </TableCell>
                        <TableCell className="sticky right-0 bg-card">
                          <div className="flex gap-1 justify-center">
                            {isEditing ? (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={salvarEdicao}
                                >
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={cancelarEdicao}
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => iniciarEdicao(coleta, 2)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => excluirRegistro(coleta.id, 2)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
