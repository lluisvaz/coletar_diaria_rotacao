import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ColetaGrupo1, type ColetaGrupo2 } from "@shared/schema";

interface ModalEdicaoColetaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coleta: (ColetaGrupo1 | ColetaGrupo2) | null;
  grupo: 1 | 2 | null;
  onSalvar: (dados: any) => void;
  isPending: boolean;
}

export default function ModalEdicaoColeta({
  open,
  onOpenChange,
  coleta,
  grupo,
  onSalvar,
  isPending,
}: ModalEdicaoColetaProps) {
  if (!coleta || !grupo) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dados: any = {
      id: coleta.id,
      dataColeta: coleta.dataColeta,
      linhaProducao: coleta.linhaProducao,
      sku: formData.get("sku"),
    };

    if (grupo === 1) {
      const c = coleta as ColetaGrupo1;
      dados.pesoSacolaVarpe = Number(formData.get("pesoSacolaVarpe"));
      if (["L80", "L81", "L82", "L83"].includes(coleta.linhaProducao)) {
        dados.parametroPainel = Number(formData.get("parametroPainel"));
        dados.acrisson = Number(formData.get("acrisson"));
      }
      dados.velocidadeLinha = Number(formData.get("velocidadeLinha"));
      dados.coreAttach = Number(formData.get("coreAttach"));
      dados.coreWrap = Number(formData.get("coreWrap"));
      dados.surge = Number(formData.get("surge"));
      dados.cuffEnd = Number(formData.get("cuffEnd"));
      dados.bead = Number(formData.get("bead"));
      dados.legElastic = Number(formData.get("legElastic"));
      dados.cuffElastic = Number(formData.get("cuffElastic"));
      dados.temporary = Number(formData.get("temporary"));
      dados.topsheet = Number(formData.get("topsheet"));
      dados.backsheet = Number(formData.get("backsheet"));
      dados.frontal = Number(formData.get("frontal"));
      dados.earAttach = Number(formData.get("earAttach"));
      dados.pulpFix = Number(formData.get("pulpFix"));
      dados.central = Number(formData.get("central"));
      dados.release = Number(formData.get("release"));
      dados.tapeOnBag = Number(formData.get("tapeOnBag"));
      dados.filme1x1 = Number(formData.get("filme1x1"));
    } else {
      const c = coleta as ColetaGrupo2;
      dados.pesoSacolaVarpe = Number(formData.get("pesoSacolaVarpe"));
      dados.parametroPainel = Number(formData.get("parametroPainel"));
      dados.acrisson = Number(formData.get("acrisson"));
      dados.velocidadeLinha = Number(formData.get("velocidadeLinha"));
      dados.waistPacker = Number(formData.get("waistPacker"));
      dados.isgElastic = Number(formData.get("isgElastic"));
      dados.waistElastic = Number(formData.get("waistElastic"));
      dados.isgSideSeal = Number(formData.get("isgSideSeal"));
      dados.absorventFix = Number(formData.get("absorventFix"));
      dados.outerEdge = Number(formData.get("outerEdge"));
      dados.inner = Number(formData.get("inner"));
      dados.bead = Number(formData.get("bead"));
      dados.standingGather = Number(formData.get("standingGather"));
      dados.backflimFix = Number(formData.get("backflimFix"));
      dados.osgSideSeal = Number(formData.get("osgSideSeal"));
      dados.osgElastico = Number(formData.get("osgElastico"));
      dados.nwSealContLateral = Number(formData.get("nwSealContLateral"));
      dados.nwSealIntCentRal = Number(formData.get("nwSealIntCentRal"));
      dados.outSideBackFlm = Number(formData.get("outSideBackFlm"));
      dados.topsheetFix = Number(formData.get("topsheetFix"));
      dados.coreWrap = Number(formData.get("coreWrap"));
      dados.coreWrapSeal = Number(formData.get("coreWrapSeal"));
      dados.matFix = Number(formData.get("matFix"));
    }

    onSalvar(dados);
  };

  const isGrupo1 = grupo === 1;
  const coletaG1 = isGrupo1 ? (coleta as ColetaGrupo1) : null;
  const coletaG2 = !isGrupo1 ? (coleta as ColetaGrupo2) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Registro</DialogTitle>
          <DialogDescription>
            {coleta.linhaProducao} - {coleta.sku}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku" className="text-blue-600 dark:text-blue-400">SKU</Label>
              <Input id="sku" name="sku" defaultValue={coleta.sku} required />
            </div>
            {isGrupo1 && coletaG1 && (
              <>
                <div className="space-y-2">
                  <Label className="text-blue-600 dark:text-blue-400">Peso Sacola Varpe</Label>
                  <Input type="number" name="pesoSacolaVarpe" defaultValue={coletaG1.pesoSacolaVarpe} required />
                </div>
                {["L80", "L81", "L82", "L83"].includes(coleta.linhaProducao) && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-blue-600 dark:text-blue-400">Parâmetro do Painel</Label>
                      <Input type="number" name="parametroPainel" defaultValue={coletaG1.parametroPainel ?? 0} required />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-blue-600 dark:text-blue-400">Acrisson</Label>
                      <Input type="number" name="acrisson" defaultValue={coletaG1.acrisson ?? 0} required />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label>Velocidade Linha</Label>
                  <Input type="number" name="velocidadeLinha" defaultValue={coletaG1.velocidadeLinha} required />
                </div>
                <div className="space-y-2">
                  <Label>Core Attach</Label>
                  <Input type="number" name="coreAttach" defaultValue={coletaG1.coreAttach} required />
                </div>
                <div className="space-y-2">
                  <Label>Core Wrap</Label>
                  <Input type="number" name="coreWrap" defaultValue={coletaG1.coreWrap} required />
                </div>
                <div className="space-y-2">
                  <Label>Surge</Label>
                  <Input type="number" name="surge" defaultValue={coletaG1.surge} required />
                </div>
                <div className="space-y-2">
                  <Label>Cuff End</Label>
                  <Input type="number" name="cuffEnd" defaultValue={coletaG1.cuffEnd} required />
                </div>
                <div className="space-y-2">
                  <Label>Bead</Label>
                  <Input type="number" name="bead" defaultValue={coletaG1.bead} required />
                </div>
                <div className="space-y-2">
                  <Label>Leg Elastic</Label>
                  <Input type="number" name="legElastic" defaultValue={coletaG1.legElastic} required />
                </div>
                <div className="space-y-2">
                  <Label>Cuff Elastic</Label>
                  <Input type="number" name="cuffElastic" defaultValue={coletaG1.cuffElastic} required />
                </div>
                <div className="space-y-2">
                  <Label>Temporary</Label>
                  <Input type="number" name="temporary" defaultValue={coletaG1.temporary} required />
                </div>
                <div className="space-y-2">
                  <Label>Topsheet</Label>
                  <Input type="number" name="topsheet" defaultValue={coletaG1.topsheet} required />
                </div>
                <div className="space-y-2">
                  <Label>Backsheet</Label>
                  <Input type="number" name="backsheet" defaultValue={coletaG1.backsheet} required />
                </div>
                <div className="space-y-2">
                  <Label>Frontal</Label>
                  <Input type="number" name="frontal" defaultValue={coletaG1.frontal} required />
                </div>
                <div className="space-y-2">
                  <Label>Ear Attach</Label>
                  <Input type="number" name="earAttach" defaultValue={coletaG1.earAttach} required />
                </div>
                <div className="space-y-2">
                  <Label>Pulp Fix</Label>
                  <Input type="number" name="pulpFix" defaultValue={coletaG1.pulpFix} required />
                </div>
                <div className="space-y-2">
                  <Label>Central</Label>
                  <Input type="number" name="central" defaultValue={coletaG1.central} required />
                </div>
                <div className="space-y-2">
                  <Label>Release</Label>
                  <Input type="number" name="release" defaultValue={coletaG1.release} required />
                </div>
                <div className="space-y-2">
                  <Label>Tape On Bag</Label>
                  <Input type="number" name="tapeOnBag" defaultValue={coletaG1.tapeOnBag} required />
                </div>
                <div className="space-y-2">
                  <Label>Filme 1x1</Label>
                  <Input type="number" name="filme1x1" defaultValue={coletaG1.filme1x1} required />
                </div>
              </>
            )}
            {!isGrupo1 && coletaG2 && (
              <>
                <div className="space-y-2">
                  <Label className="text-blue-600 dark:text-blue-400">Peso Sacola Varpe</Label>
                  <Input type="number" name="pesoSacolaVarpe" defaultValue={coletaG2.pesoSacolaVarpe} required />
                </div>
                <div className="space-y-2">
                  <Label className="text-blue-600 dark:text-blue-400">Parâmetro do Painel</Label>
                  <Input type="number" name="parametroPainel" defaultValue={coletaG2.parametroPainel ?? 0} required />
                </div>
                <div className="space-y-2">
                  <Label className="text-blue-600 dark:text-blue-400">Acrisson</Label>
                  <Input type="number" name="acrisson" defaultValue={coletaG2.acrisson ?? 0} required />
                </div>
                <div className="space-y-2">
                  <Label>Velocidade Linha</Label>
                  <Input type="number" name="velocidadeLinha" defaultValue={coletaG2.velocidadeLinha} required />
                </div>
                <div className="space-y-2">
                  <Label>Waist Packer</Label>
                  <Input type="number" name="waistPacker" defaultValue={coletaG2.waistPacker} required />
                </div>
                <div className="space-y-2">
                  <Label>ISG Elastic</Label>
                  <Input type="number" name="isgElastic" defaultValue={coletaG2.isgElastic} required />
                </div>
                <div className="space-y-2">
                  <Label>Waist Elastic</Label>
                  <Input type="number" name="waistElastic" defaultValue={coletaG2.waistElastic} required />
                </div>
                <div className="space-y-2">
                  <Label>ISG Side Seal</Label>
                  <Input type="number" name="isgSideSeal" defaultValue={coletaG2.isgSideSeal} required />
                </div>
                <div className="space-y-2">
                  <Label>Absorvent Fix</Label>
                  <Input type="number" name="absorventFix" defaultValue={coletaG2.absorventFix} required />
                </div>
                <div className="space-y-2">
                  <Label>Outer Edge</Label>
                  <Input type="number" name="outerEdge" defaultValue={coletaG2.outerEdge} required />
                </div>
                <div className="space-y-2">
                  <Label>Inner</Label>
                  <Input type="number" name="inner" defaultValue={coletaG2.inner} required />
                </div>
                <div className="space-y-2">
                  <Label>Bead</Label>
                  <Input type="number" name="bead" defaultValue={coletaG2.bead} required />
                </div>
                <div className="space-y-2">
                  <Label>Standing Gather</Label>
                  <Input type="number" name="standingGather" defaultValue={coletaG2.standingGather} required />
                </div>
                <div className="space-y-2">
                  <Label>Backflim Fix</Label>
                  <Input type="number" name="backflimFix" defaultValue={coletaG2.backflimFix} required />
                </div>
                <div className="space-y-2">
                  <Label>OSG Side Seal</Label>
                  <Input type="number" name="osgSideSeal" defaultValue={coletaG2.osgSideSeal} required />
                </div>
                <div className="space-y-2">
                  <Label>OSG Elastico</Label>
                  <Input type="number" name="osgElastico" defaultValue={coletaG2.osgElastico} required />
                </div>
                <div className="space-y-2">
                  <Label>NW Seal Cont Lateral</Label>
                  <Input type="number" name="nwSealContLateral" defaultValue={coletaG2.nwSealContLateral} required />
                </div>
                <div className="space-y-2">
                  <Label>NW Seal Int Cent Ral</Label>
                  <Input type="number" name="nwSealIntCentRal" defaultValue={coletaG2.nwSealIntCentRal} required />
                </div>
                <div className="space-y-2">
                  <Label>Out Side Back Flm</Label>
                  <Input type="number" name="outSideBackFlm" defaultValue={coletaG2.outSideBackFlm} required />
                </div>
                <div className="space-y-2">
                  <Label>Topsheet Fix</Label>
                  <Input type="number" name="topsheetFix" defaultValue={coletaG2.topsheetFix} required />
                </div>
                <div className="space-y-2">
                  <Label>Core Wrap</Label>
                  <Input type="number" name="coreWrap" defaultValue={coletaG2.coreWrap} required />
                </div>
                <div className="space-y-2">
                  <Label>Core Wrap Seal</Label>
                  <Input type="number" name="coreWrapSeal" defaultValue={coletaG2.coreWrapSeal} required />
                </div>
                <div className="space-y-2">
                  <Label>Mat Fix</Label>
                  <Input type="number" name="matFix" defaultValue={coletaG2.matFix} required />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
