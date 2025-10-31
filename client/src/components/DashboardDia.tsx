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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { FormularioEdicaoGrupo } from "./DashboardDia/FormularioEdicaoGrupo";
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
import { useConfirmer } from "@/components/ui/confirmer";
import ExcelJS from "exceljs";
import { useState, useEffect } from "react";
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
  const { confirm, ConfirmerDialog } = useConfirmer();
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoGrupo, setEditandoGrupo] = useState<1 | 2 | null>(null);
  const [valoresEditados, setValoresEditados] = useState<any>({});

  const updateGrupo1Mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ColetaGrupo1> }) =>
      apiRequest("PUT", `/api/coleta/grupo1/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coleta/grupo1"] });
      toast({
        title: "Sucesso!",
        description: "Registro atualizado.",
        variant: "success",
      });
      setModalEdicaoAberto(false);
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
      toast({
        title: "Sucesso!",
        description: "Registro atualizado.",
        variant: "success",
      });
      setModalEdicaoAberto(false);
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
      toast({
        title: "Sucesso!",
        description: "Registro excluído.",
        variant: "success",
      });
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
      toast({
        title: "Sucesso!",
        description: "Registro excluído.",
        variant: "success",
      });
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
    setModalEdicaoAberto(true);
  };

  const cancelarEdicao = () => {
    setModalEdicaoAberto(false);
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
    confirm(
      () => {
        if (grupo === 1) {
          deleteGrupo1Mutation.mutate(id);
        } else {
          deleteGrupo2Mutation.mutate(id);
        }
      },
      {
        title: "Excluir registro?",
        description:
          "Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.",
      },
    );
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

      // Criar uma única aba com ambos os grupos
      if (grupo1.length > 0 || grupo2.length > 0) {
        const ws = workbook.addWorksheet("Rotação de Bombas");

        ws.mergeCells("A1:Z1");
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

        // Headers para Grupo 1 - SKU e Peso Sacola vêm depois com 3 colunas de diferença
        const headers = [
          "",
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
          "PARÂMETRO\nDO PAINEL",
          "ACRISSON",
          "",
          "SKU",
          "PESO SACOLA\nVARPE",
        ];

        const headerRow = ws.getRow(4);
        headers.forEach((header, index) => {
          const cell = headerRow.getCell(index + 1);
          cell.value = header;
          cell.style = estiloCabecalho;
        });
        headerRow.height = 45;

        // Adicionar dados do Grupo 1 (L90-L83)
        const grupo1Ordenado = [...grupo1].sort((a, b) =>
          a.linhaProducao.localeCompare(b.linhaProducao),
        );
        grupo1Ordenado.forEach((coleta, idx) => {
          const row = ws.getRow(5 + idx);
          // Para linhas L80-L83, incluir parametroPainel e acrisson
          const temCamposEspeciais = ["L80", "L81", "L82", "L83"].includes(coleta.linhaProducao);
          const values = [
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
            coleta.filme1x1,
            temCamposEspeciais ? coleta.parametroPainel : "",
            temCamposEspeciais ? coleta.acrisson : "",
            "",
            coleta.sku,
            coleta.pesoSacolaVarpe,
          ];

          values.forEach((value, colIdx) => {
            const cell = row.getCell(colIdx + 1);
            cell.value = value;
            cell.style = estiloDados;
            // Formatar números com 2 casas decimais
            if (typeof value === "number" && colIdx !== 22) {
              // Não formatar SKU
              cell.numFmt = "0.00";
            }
          });
        });

        // Adicionar dados do Grupo 2 (L84 e L85) 5 linhas abaixo do Grupo 1
        if (grupo2.length > 0) {
          const startRowGrupo2 = 5 + grupo1.length + 5;

          // Headers para Grupo 2
          const headersGrupo2 = [
            "",
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
            "PARÂMETRO\nDO PAINEL",
            "ACRISSON",
            "",
            "SKU",
            "PESO SACOLA\nVARPE",
          ];

          const headerRowGrupo2 = ws.getRow(startRowGrupo2 - 1);
          headersGrupo2.forEach((header, index) => {
            const cell = headerRowGrupo2.getCell(index + 1);
            cell.value = header;
            cell.style = estiloCabecalho;
          });
          headerRowGrupo2.height = 45;

          const grupo2Ordenado = [...grupo2].sort((a, b) =>
            a.linhaProducao.localeCompare(b.linhaProducao),
          );
          grupo2Ordenado.forEach((coleta, idx) => {
            const row = ws.getRow(startRowGrupo2 + idx);
            const values = [
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
              coleta.parametroPainel,
              coleta.acrisson,
              "",
              coleta.sku,
              coleta.pesoSacolaVarpe,
            ];

            values.forEach((value, colIdx) => {
              const cell = row.getCell(colIdx + 1);
              cell.value = value;
              cell.style = estiloDados;
              // Formatar números com 2 casas decimais
              if (typeof value === "number" && colIdx !== 24) {
                // Não formatar SKU
                cell.numFmt = "0.00";
              }
            });
          });
        }

        // Ajustar larguras das colunas de forma mais adequada ao conteúdo
        const columnWidths = [
          10, // Linha (A)
          14, // Velocidade da Linha (B)
          16, // Core Attach / Waist Packer (C)
          16, // Core Wrap / ISG Elastic (D)
          12, // Surge / Waist Elastic (E)
          12, // Cuff End / ISG Side Seal (F)
          12, // Bead / Absorvent Fix (G)
          16, // Leg Elastic / Outer Edge (H)
          16, // Cuff Elastic / Inner (I)
          13, // Temporary / Bead (J)
          14, // Topsheet / Standing Gather (K)
          14, // Backsheet / Backfilm Fix (L)
          12, // Frontal / OSG Side Seal (M)
          13, // Ear Attach / OSG Elastico (N)
          12, // Pulp Fix / NW Seal Cont (O)
          12, // Central / NW Seal Int Cent (P)
          12, // Release / Out Side Back Film Fix (Q)
          13, // Tape on Bag / Topsheet Fix (R)
          13, // Filme 1x1 / Core Wrap (S)
          16, // Parâmetro do Painel / Core Wrap Side Seal (T)
          13, // Acrisson / Mat Fix (U)
          3, // Espaço vazio (V)
          15, // SKU (W)
          15, // Peso Sacola Varpe (X)
        ];

        columnWidths.forEach((width, idx) => {
          ws.getColumn(idx + 1).width = width;
        });

        // Habilitar ajuste automático de altura para todas as linhas
        ws.eachRow((row, rowNumber) => {
          if (rowNumber >= 4) {
            // Apenas para linhas de dados e cabeçalho
            row.eachCell((cell) => {
              // Garantir que wrapText esteja habilitado (já está no estilo, mas reforçando)
              if (cell.style.alignment) {
                cell.alignment = {
                  ...cell.style.alignment,
                  wrapText: true,
                };
              }
            });
          }
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
      link.download = `Rotação_de_Bombas_${dataFormatada}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Exportação concluída!",
        description: `Arquivo Excel gerado com sucesso para o dia ${format(parseISO(data), "dd/MM/yyyy", { locale: ptBR })}.`,
        variant: "success",
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
            <h4 className="text-sm font-medium mb-2">ABS e Tape</h4>
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
                    return (
                      <TableRow key={coleta.id}>
                        <TableCell className="sticky left-0 bg-card font-medium border-r">
                          {coleta.linhaProducao}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.sku}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.pesoSacolaVarpe?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.velocidadeLinha?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.coreAttach?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.coreWrap?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.surge?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.cuffEnd?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.bead?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.legElastic?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.cuffElastic?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.temporary?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.topsheet?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.backsheet?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.frontal?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.earAttach?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.pulpFix?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.central?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.release?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.tapeOnBag?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {coleta.filme1x1?.toFixed(2)}
                        </TableCell>
                        <TableCell className="sticky right-0 bg-card">
                          <div className="flex gap-1 justify-center">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => iniciarEdicao(coleta, 1)}
                              data-testid={`button-edit-grupo1-${coleta.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => excluirRegistro(coleta.id, 1)}
                              data-testid={`button-delete-grupo1-${coleta.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
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
            <h4 className="text-sm font-medium mb-2">Pants</h4>
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
                    return (
                      <TableRow key={coleta.id}>
                        <TableCell className="sticky left-0 bg-card font-medium border-r">
                          {coleta.linhaProducao}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.sku}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.pesoSacolaVarpe?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.velocidadeLinha?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.waistPacker?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.isgElastic?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.waistElastic?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.isgSideSeal?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.absorventFix?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.outerEdge?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.inner?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.bead?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.standingGather?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.backflimFix?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.osgSideSeal?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.osgElastico?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.nwSealContLateral?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.nwSealIntCentRal?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.outSideBackFlm?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.topsheetFix?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.coreWrap?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono border-r">
                          {coleta.coreWrapSeal?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {coleta.matFix?.toFixed(2)}
                        </TableCell>
                        <TableCell className="sticky right-0 bg-card">
                          <div className="flex gap-1 justify-center">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => iniciarEdicao(coleta, 2)}
                              data-testid={`button-edit-grupo2-${coleta.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => excluirRegistro(coleta.id, 2)}
                              data-testid={`button-delete-grupo2-${coleta.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
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

      {ConfirmerDialog}

      {isMobile ? (
        <Drawer open={modalEdicaoAberto} onOpenChange={setModalEdicaoAberto}>
          <DrawerContent className="max-h-[85vh]">
            <div className="flex flex-col h-full overflow-hidden">
              <DrawerHeader className="px-4">
                <DrawerTitle>Editar Registro</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 overflow-y-auto flex-1">
                {editandoGrupo && (
                  <FormularioEdicaoGrupo
                    grupo={editandoGrupo}
                    valoresEditados={valoresEditados}
                    atualizarCampo={atualizarCampo}
                  />
                )}
              </div>
              <DrawerFooter className="px-4 pt-4 pb-4 border-t">
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    onClick={cancelarEdicao}
                    data-testid="button-cancel-edit"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={salvarEdicao}
                    disabled={
                      updateGrupo1Mutation.isPending ||
                      updateGrupo2Mutation.isPending
                    }
                    data-testid="button-save-edit"
                    className="flex-1"
                  >
                    {updateGrupo1Mutation.isPending ||
                    updateGrupo2Mutation.isPending
                      ? "Salvando..."
                      : "Salvar"}
                  </Button>
                </div>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={modalEdicaoAberto} onOpenChange={setModalEdicaoAberto}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Registro</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {editandoGrupo && (
                <FormularioEdicaoGrupo
                  grupo={editandoGrupo}
                  valoresEditados={valoresEditados}
                  atualizarCampo={atualizarCampo}
                />
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={cancelarEdicao}
                data-testid="button-cancel-edit"
              >
                Cancelar
              </Button>
              <Button
                onClick={salvarEdicao}
                disabled={
                  updateGrupo1Mutation.isPending ||
                  updateGrupo2Mutation.isPending
                }
                data-testid="button-save-edit"
              >
                {updateGrupo1Mutation.isPending ||
                updateGrupo2Mutation.isPending
                  ? "Salvando..."
                  : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
