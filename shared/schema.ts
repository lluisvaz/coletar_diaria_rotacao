import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const coletaGrupo1 = pgTable("coleta_grupo1", {
  id: integer("id").primaryKey(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  dataColeta: text("data_coleta").notNull(),
  linhaProducao: text("linha_producao").notNull(),
  sku: text("sku").notNull().default(''),
  pesoSacolaVarpe: real("peso_sacola_varpe").notNull().default(0),
  parametroPainel: real("parametro_painel").default(0),
  acrisson: real("acrisson").default(0),
  velocidadeLinha: real("velocidade_linha").notNull(),
  coreAttach: real("core_attach").notNull(),
  coreWrap: real("core_wrap").notNull(),
  surge: real("surge").notNull(),
  cuffEnd: real("cuff_end").notNull(),
  bead: real("bead").notNull(),
  legElastic: real("leg_elastic").notNull(),
  cuffElastic: real("cuff_elastic").notNull(),
  temporary: real("temporary").notNull(),
  topsheet: real("topsheet").notNull(),
  backsheet: real("backsheet").notNull(),
  frontal: real("frontal").notNull(),
  earAttach: real("ear_attach").notNull(),
  pulpFix: real("pulp_fix").notNull(),
  central: real("central").notNull(),
  release: real("release").notNull(),
  tapeOnBag: real("tape_on_bag").notNull(),
  filme1x1: real("filme_1x1").notNull(),
});

export const coletaGrupo2 = pgTable("coleta_grupo2", {
  id: integer("id").primaryKey(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  dataColeta: text("data_coleta").notNull(),
  linhaProducao: text("linha_producao").notNull(),
  sku: text("sku").notNull().default(''),
  pesoSacolaVarpe: real("peso_sacola_varpe").notNull().default(0),
  parametroPainel: real("parametro_painel").default(0),
  acrisson: real("acrisson").default(0),
  velocidadeLinha: real("velocidade_linha").notNull(),
  waistPacker: real("waist_packer").notNull(),
  isgElastic: real("isg_elastic").notNull(),
  waistElastic: real("waist_elastic").notNull(),
  isgSideSeal: real("isg_side_seal").notNull(),
  absorventFix: real("absorvent_fix").notNull(),
  outerEdge: real("outer_edge").notNull(),
  inner: real("inner").notNull(),
  bead: real("bead").notNull(),
  standingGather: real("standing_gather").notNull(),
  backflimFix: real("backflim_fix").notNull(),
  osgSideSeal: real("osg_side_seal").notNull(),
  osgElastico: real("osg_elastico").notNull(),
  nwSealContLateral: real("nw_seal_cont_lateral").notNull(),
  nwSealIntCentRal: real("nw_seal_int_cent_ral").notNull(),
  outSideBackFlm: real("out_side_back_flm").notNull(),
  topsheetFix: real("topsheet_fix").notNull(),
  coreWrap: real("core_wrap").notNull(),
  coreWrapSeal: real("core_wrap_seal").notNull(),
  matFix: real("mat_fix").notNull(),
});

export const insertColetaGrupo1Schema = createInsertSchema(coletaGrupo1).omit({
  id: true,
  createdAt: true,
});

export const insertColetaGrupo2Schema = createInsertSchema(coletaGrupo2).omit({
  id: true,
  createdAt: true,
});

export type InsertColetaGrupo1 = z.infer<typeof insertColetaGrupo1Schema>;
export type InsertColetaGrupo2 = z.infer<typeof insertColetaGrupo2Schema>;
export type ColetaGrupo1 = typeof coletaGrupo1.$inferSelect;
export type ColetaGrupo2 = typeof coletaGrupo2.$inferSelect;
