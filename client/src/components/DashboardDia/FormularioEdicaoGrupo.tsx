import { Input } from "@/components/ui/input";

interface FormularioEdicaoGrupoProps {
  grupo: 1 | 2;
  valoresEditados: any;
  atualizarCampo: (campo: string, valor: any) => void;
}

export function FormularioEdicaoGrupo({ grupo, valoresEditados, atualizarCampo }: FormularioEdicaoGrupoProps) {
  if (grupo === 1) {
    return (
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
            data-testid="input-edit-coreAttach"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Core Wrap</label>
          <Input
            type="number"
            step="0.01"
            value={valoresEditados.coreWrap || 0}
            onChange={(e) => atualizarCampo("coreWrap", parseFloat(e.target.value) || 0)}
            data-testid="input-edit-coreWrap"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Surge</label>
          <Input
            type="number"
            step="0.01"
            value={valoresEditados.surge || 0}
            onChange={(e) => atualizarCampo("surge", parseFloat(e.target.value) || 0)}
            data-testid="input-edit-surge"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Cuff End</label>
          <Input
            type="number"
            step="0.01"
            value={valoresEditados.cuffEnd || 0}
            onChange={(e) => atualizarCampo("cuffEnd", parseFloat(e.target.value) || 0)}
            data-testid="input-edit-cuffEnd"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Frontal</label>
          <Input
            type="number"
            step="0.01"
            value={valoresEditados.frontal || 0}
            onChange={(e) => atualizarCampo("frontal", parseFloat(e.target.value) || 0)}
            data-testid="input-edit-frontal"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Ear Attach</label>
          <Input
            type="number"
            step="0.01"
            value={valoresEditados.earAttach || 0}
            onChange={(e) => atualizarCampo("earAttach", parseFloat(e.target.value) || 0)}
            data-testid="input-edit-earAttach"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Pulp Fix</label>
          <Input
            type="number"
            step="0.01"
            value={valoresEditados.pulpFix || 0}
            onChange={(e) => atualizarCampo("pulpFix", parseFloat(e.target.value) || 0)}
            data-testid="input-edit-pulpFix"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Central</label>
          <Input
            type="number"
            step="0.01"
            value={valoresEditados.central || 0}
            onChange={(e) => atualizarCampo("central", parseFloat(e.target.value) || 0)}
            data-testid="input-edit-central"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Release</label>
          <Input
            type="number"
            step="0.01"
            value={valoresEditados.release || 0}
            onChange={(e) => atualizarCampo("release", parseFloat(e.target.value) || 0)}
            data-testid="input-edit-release"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tape on Bag</label>
          <Input
            type="number"
            step="0.01"
            value={valoresEditados.tapeOnBag || 0}
            onChange={(e) => atualizarCampo("tapeOnBag", parseFloat(e.target.value) || 0)}
            data-testid="input-edit-tapeOnBag"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Filme 1x1</label>
          <Input
            type="number"
            step="0.01"
            value={valoresEditados.filme1x1 || 0}
            onChange={(e) => atualizarCampo("filme1x1", parseFloat(e.target.value) || 0)}
            data-testid="input-edit-filme1x1"
          />
        </div>
      </div>
    );
  }

  return (
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
        <label className="text-sm font-medium">Waist Packer</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.waistPacker || 0}
          onChange={(e) => atualizarCampo("waistPacker", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-waistPacker"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">ISG Elastic</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.isgElastic || 0}
          onChange={(e) => atualizarCampo("isgElastic", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-isgElastic"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Waist Elastic</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.waistElastic || 0}
          onChange={(e) => atualizarCampo("waistElastic", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-waistElastic"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">ISG Side Seal</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.isgSideSeal || 0}
          onChange={(e) => atualizarCampo("isgSideSeal", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-isgSideSeal"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Absorvent Fix</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.absorventFix || 0}
          onChange={(e) => atualizarCampo("absorventFix", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-absorventFix"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Outer Edge</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.outerEdge || 0}
          onChange={(e) => atualizarCampo("outerEdge", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-outerEdge"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Inner</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.inner || 0}
          onChange={(e) => atualizarCampo("inner", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-inner"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Bead</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.bead || 0}
          onChange={(e) => atualizarCampo("bead", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-bead"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Standing Gather</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.standingGather || 0}
          onChange={(e) => atualizarCampo("standingGather", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-standingGather"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Backfilm Fix</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.backflimFix || 0}
          onChange={(e) => atualizarCampo("backflimFix", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-backflimFix"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">OSG Side Seal</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.osgSideSeal || 0}
          onChange={(e) => atualizarCampo("osgSideSeal", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-osgSideSeal"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">OSG Elástico</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.osgElastico || 0}
          onChange={(e) => atualizarCampo("osgElastico", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-osgElastico"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">NW Seal Cont Lateral</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.nwSealContLateral || 0}
          onChange={(e) => atualizarCampo("nwSealContLateral", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-nwSealContLateral"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">NW Seal Int Cent Ral</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.nwSealIntCentRal || 0}
          onChange={(e) => atualizarCampo("nwSealIntCentRal", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-nwSealIntCentRal"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Out Side Back Film</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.outSideBackFlm || 0}
          onChange={(e) => atualizarCampo("outSideBackFlm", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-outSideBackFlm"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Topsheet Fix</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.topsheetFix || 0}
          onChange={(e) => atualizarCampo("topsheetFix", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-topsheetFix"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Core Wrap</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.coreWrap || 0}
          onChange={(e) => atualizarCampo("coreWrap", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-coreWrap"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Core Wrap Seal</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.coreWrapSeal || 0}
          onChange={(e) => atualizarCampo("coreWrapSeal", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-coreWrapSeal"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Mat Fix</label>
        <Input
          type="number"
          step="0.01"
          value={valoresEditados.matFix || 0}
          onChange={(e) => atualizarCampo("matFix", parseFloat(e.target.value) || 0)}
          data-testid="input-edit-matFix"
        />
      </div>
    </div>
  );
}
