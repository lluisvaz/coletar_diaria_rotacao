import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type ColetaGrupo1, type ColetaGrupo2 } from "@shared/schema";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: grupo1Data, isLoading: isLoadingGrupo1 } = useQuery<ColetaGrupo1[]>({
    queryKey: ["/api/coleta/grupo1"],
  });

  const { data: grupo2Data, isLoading: isLoadingGrupo2 } = useQuery<ColetaGrupo2[]>({
    queryKey: ["/api/coleta/grupo2"],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard de Coletas</CardTitle>
        <CardDescription>
          Visualização de todas as coletas registradas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="grupo1" className="w-full">
          <TabsList className="grid w-full grid-cols-2" data-testid="tabs-dashboard">
            <TabsTrigger value="grupo1" data-testid="tab-grupo1">
              Coletas Grupo 1 {grupo1Data && `(${grupo1Data.length})`}
            </TabsTrigger>
            <TabsTrigger value="grupo2" data-testid="tab-grupo2">
              Coletas Grupo 2 {grupo2Data && `(${grupo2Data.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grupo1" className="mt-6">
            {isLoadingGrupo1 ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : grupo1Data && grupo1Data.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-card z-10 min-w-[110px]">Data</TableHead>
                      <TableHead className="min-w-[100px]">Linha</TableHead>
                      <TableHead className="text-right">Velocidade</TableHead>
                      <TableHead className="text-right">Core Attach</TableHead>
                      <TableHead className="text-right">Core Wrap</TableHead>
                      <TableHead className="text-right">Surge</TableHead>
                      <TableHead className="text-right">Cuff End</TableHead>
                      <TableHead className="text-right">Bead</TableHead>
                      <TableHead className="text-right">Leg Elastic</TableHead>
                      <TableHead className="text-right">Cuff Elastic</TableHead>
                      <TableHead className="text-right">Temporary</TableHead>
                      <TableHead className="text-right">Topsheet</TableHead>
                      <TableHead className="text-right">Backsheet</TableHead>
                      <TableHead className="text-right">Frontal</TableHead>
                      <TableHead className="text-right">Ear Attach</TableHead>
                      <TableHead className="text-right">Pulp Fix</TableHead>
                      <TableHead className="text-right">Central</TableHead>
                      <TableHead className="text-right">Release</TableHead>
                      <TableHead className="text-right">Tape on Bag</TableHead>
                      <TableHead className="text-right">Flume Y</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grupo1Data.map((coleta) => (
                      <TableRow key={coleta.id} data-testid={`row-grupo1-${coleta.id}`}>
                        <TableCell className="sticky left-0 bg-card font-mono text-sm">
                          {format(new Date(coleta.dataColeta), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {coleta.linhaProducao}
                        </TableCell>
                        <TableCell className="text-right font-mono">{coleta.velocidadeLinha.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.coreAttach.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.coreWrap.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.surge.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.cuffEnd.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.bead.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.legElastic.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.cuffElastic.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.temporary.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.topsheet.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.backsheet.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.frontal.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.earAttach.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.pulpFix.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.central.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.release.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.tapeOnBag.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.flumeY.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhuma coleta registrada para o Grupo 1</p>
                <p className="text-sm mt-2">Use a aba "Entrada de Dados" para adicionar novas coletas</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="grupo2" className="mt-6">
            {isLoadingGrupo2 ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : grupo2Data && grupo2Data.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-card z-10 min-w-[110px]">Data</TableHead>
                      <TableHead className="min-w-[100px]">Linha</TableHead>
                      <TableHead className="text-right">Velocidade</TableHead>
                      <TableHead className="text-right">Waist Packer</TableHead>
                      <TableHead className="text-right">ISG Elastic</TableHead>
                      <TableHead className="text-right">Waist Elastic</TableHead>
                      <TableHead className="text-right">ISG Side Seal</TableHead>
                      <TableHead className="text-right">Absorvent Fix</TableHead>
                      <TableHead className="text-right">Outer Edge</TableHead>
                      <TableHead className="text-right">Inner</TableHead>
                      <TableHead className="text-right">Bead</TableHead>
                      <TableHead className="text-right">Standing Gather</TableHead>
                      <TableHead className="text-right">Backflim Fix</TableHead>
                      <TableHead className="text-right">OSG Side Seal</TableHead>
                      <TableHead className="text-right">OSG Elástico</TableHead>
                      <TableHead className="text-right">NW Seal Cont</TableHead>
                      <TableHead className="text-right">NW Seal Int Cent</TableHead>
                      <TableHead className="text-right">Out Side Back FLM</TableHead>
                      <TableHead className="text-right">Topsheet Fix</TableHead>
                      <TableHead className="text-right">Core Wrap</TableHead>
                      <TableHead className="text-right">Core Wrap Seal</TableHead>
                      <TableHead className="text-right">Mat Fix</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {grupo2Data.map((coleta) => (
                      <TableRow key={coleta.id} data-testid={`row-grupo2-${coleta.id}`}>
                        <TableCell className="sticky left-0 bg-card font-mono text-sm">
                          {format(new Date(coleta.dataColeta), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {coleta.linhaProducao}
                        </TableCell>
                        <TableCell className="text-right font-mono">{coleta.velocidadeLinha.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.waistPacker.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.isgElastic.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.waistElastic.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.isgSideSeal.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.absorventFix.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.outerEdge.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.inner.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.bead.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.standingGather.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.backflimFix.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.osgSideSeal.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.osgElastico.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.nwSealContLateral.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.nwSealIntCentRal.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.outSideBackFlm.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.topsheetFix.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.coreWrap.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.coreWrapSeal.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono">{coleta.matFix.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhuma coleta registrada para o Grupo 2</p>
                <p className="text-sm mt-2">Use a aba "Entrada de Dados" para adicionar novas coletas</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
