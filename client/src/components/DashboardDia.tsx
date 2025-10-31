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
  const [modalHeight, setModalHeight] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartHeight, setDragStartHeight] = useState(0);

  const updateGrupo1Mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ColetaGrupo1> }) =>
      apiRequest("PUT", `/api/coleta/grupo1/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coleta/grupo1"] });
      toast({ title: "Sucesso!", description: "Registro atualizado." });
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
      toast({ title: "Sucesso!", description: "Registro atualizado." });
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
        description: "Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.",
      }
    );
  };

  const atualizarCampo = (campo: string, valor: any) => {
    setValoresEditados((prev: any) => ({ ...prev, [campo]: valor }));
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isMobile) return;
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
    setDragStartHeight(modalHeight);
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !isMobile) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - dragStartY;
    const viewportHeight = window.innerHeight;
    const deltaPercent = (deltaY / viewportHeight) * 100;
    const newHeight = Math.min(Math.max(dragStartHeight - deltaPercent, 30), 90);
    setModalHeight(newHeight);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isMobile && isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDragMove);
      window.addEventListener('touchend', handleDragEnd);
      
      return () => {
        window.removeEventListener('mousemove', handleDragMove);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchmove', handleDragMove);
        window.removeEventListener('touchend', handleDragEnd);
      };
    }
  }, [isDragging, isMobile]);

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

      <Dialog open={modalEdicaoAberto} onOpenChange={setModalEdicaoAberto}>
        <DialogContent 
          className={
            isMobile
              ? "fixed inset-x-0 bottom-0 w-full max-w-none rounded-t-2xl border-t border-x-0 border-b-0 p-0 m-0 translate-x-0 translate-y-0 left-0 right-0 data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom"
              : "max-w-3xl max-h-[90vh] overflow-y-auto"
          }
          style={isMobile ? { height: `${modalHeight}vh`, width: '100vw' } : undefined}
        >
          {isMobile && (
            <div 
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleDragStart}
              onTouchStart={handleDragStart}
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
          )}
          <div className={isMobile ? "flex flex-col overflow-hidden" : ""} style={isMobile ? { height: 'calc(100% - 40px)' } : undefined}>
            <div className={isMobile ? "px-4" : ""}>
              <DialogHeader className={isMobile ? "pb-3" : ""}>
                <DialogTitle>Editar Registro</DialogTitle>
              </DialogHeader>
            </div>
            <div className={isMobile ? "px-4 overflow-y-auto flex-1" : "grid gap-4 py-4"}>
            {editandoGrupo === 1 ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SKU</label>
                  <Input
                    type="text"
                    value={valoresEditados.sku || ""}
                    onChange={(e) => atualizarCampo("sku", e.target.value)}
                    data-testid="input-edit-sku"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Peso Sacola Varpe</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.pesoSacolaVarpe || 0}
                    onChange={(e) => atualizarCampo("pesoSacolaVarpe", parseFloat(e.target.value) || 0)}
                    data-testid="input-edit-pesoSacolaVarpe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Velocidade da Linha</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.velocidadeLinha || 0}
                    onChange={(e) => atualizarCampo("velocidadeLinha", parseFloat(e.target.value) || 0)}
                    data-testid="input-edit-velocidadeLinha"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Core Attach</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.coreAttach || 0}
                    onChange={(e) => atualizarCampo("coreAttach", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Core Wrap</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.coreWrap || 0}
                    onChange={(e) => atualizarCampo("coreWrap", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Surge</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.surge || 0}
                    onChange={(e) => atualizarCampo("surge", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cuff End</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.cuffEnd || 0}
                    onChange={(e) => atualizarCampo("cuffEnd", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bead</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.bead || 0}
                    onChange={(e) => atualizarCampo("bead", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Leg Elastic</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.legElastic || 0}
                    onChange={(e) => atualizarCampo("legElastic", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cuff Elastic</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.cuffElastic || 0}
                    onChange={(e) => atualizarCampo("cuffElastic", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Temporary</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.temporary || 0}
                    onChange={(e) => atualizarCampo("temporary", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Topsheet</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.topsheet || 0}
                    onChange={(e) => atualizarCampo("topsheet", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Backsheet</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.backsheet || 0}
                    onChange={(e) => atualizarCampo("backsheet", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Frontal</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.frontal || 0}
                    onChange={(e) => atualizarCampo("frontal", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ear Attach</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.earAttach || 0}
                    onChange={(e) => atualizarCampo("earAttach", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pulp Fix</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.pulpFix || 0}
                    onChange={(e) => atualizarCampo("pulpFix", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Central</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.central || 0}
                    onChange={(e) => atualizarCampo("central", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Release</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.release || 0}
                    onChange={(e) => atualizarCampo("release", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tape on Bag</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.tapeOnBag || 0}
                    onChange={(e) => atualizarCampo("tapeOnBag", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Filme 1x1</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.filme1x1 || 0}
                    onChange={(e) => atualizarCampo("filme1x1", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SKU</label>
                  <Input
                    type="text"
                    value={valoresEditados.sku || ""}
                    onChange={(e) => atualizarCampo("sku", e.target.value)}
                    data-testid="input-edit-sku"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Peso Sacola Varpe</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.pesoSacolaVarpe || 0}
                    onChange={(e) => atualizarCampo("pesoSacolaVarpe", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Velocidade da Linha</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.velocidadeLinha || 0}
                    onChange={(e) => atualizarCampo("velocidadeLinha", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Waist Packer</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.waistPacker || 0}
                    onChange={(e) => atualizarCampo("waistPacker", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">ISG Elastic</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.isgElastic || 0}
                    onChange={(e) => atualizarCampo("isgElastic", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Waist Elastic</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.waistElastic || 0}
                    onChange={(e) => atualizarCampo("waistElastic", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">ISG Side Seal</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.isgSideSeal || 0}
                    onChange={(e) => atualizarCampo("isgSideSeal", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Absorvent Fix</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.absorventFix || 0}
                    onChange={(e) => atualizarCampo("absorventFix", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Outer Edge</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.outerEdge || 0}
                    onChange={(e) => atualizarCampo("outerEdge", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Inner</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.inner || 0}
                    onChange={(e) => atualizarCampo("inner", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bead</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.bead || 0}
                    onChange={(e) => atualizarCampo("bead", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Standing Gather</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.standingGather || 0}
                    onChange={(e) => atualizarCampo("standingGather", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Backfilm Fix</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.backflimFix || 0}
                    onChange={(e) => atualizarCampo("backflimFix", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">OSG Side Seal</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.osgSideSeal || 0}
                    onChange={(e) => atualizarCampo("osgSideSeal", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">OSG Elástico</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.osgElastico || 0}
                    onChange={(e) => atualizarCampo("osgElastico", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">NW Seal Cont Lateral</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.nwSealContLateral || 0}
                    onChange={(e) => atualizarCampo("nwSealContLateral", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">NW Seal Int Cent Ral</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.nwSealIntCentRal || 0}
                    onChange={(e) => atualizarCampo("nwSealIntCentRal", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Out Side Back Film</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.outSideBackFlm || 0}
                    onChange={(e) => atualizarCampo("outSideBackFlm", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Topsheet Fix</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.topsheetFix || 0}
                    onChange={(e) => atualizarCampo("topsheetFix", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Core Wrap</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.coreWrap || 0}
                    onChange={(e) => atualizarCampo("coreWrap", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Core Wrap Seal</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.coreWrapSeal || 0}
                    onChange={(e) => atualizarCampo("coreWrapSeal", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mat Fix</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={valoresEditados.matFix || 0}
                    onChange={(e) => atualizarCampo("matFix", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            )}
            </div>
            <div className={isMobile ? "px-4 pt-4 pb-4 border-t bg-background" : ""}>
              <DialogFooter>
                <Button variant="outline" onClick={cancelarEdicao} data-testid="button-cancel-edit">
                  Cancelar
                </Button>
                <Button onClick={salvarEdicao} disabled={updateGrupo1Mutation.isPending || updateGrupo2Mutation.isPending} data-testid="button-save-edit">
                  {updateGrupo1Mutation.isPending || updateGrupo2Mutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
