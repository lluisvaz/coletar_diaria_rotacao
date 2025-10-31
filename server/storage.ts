import { 
  type ColetaGrupo1, 
  type ColetaGrupo2, 
  type InsertColetaGrupo1, 
  type InsertColetaGrupo2,
  type AuthConfig 
} from "@shared/schema";

export interface IStorage {
  getAccessCode(): Promise<string>;
  verifyAccessCode(code: string): Promise<boolean>;
  getColetasGrupo1(): Promise<ColetaGrupo1[]>;
  getColetasGrupo2(): Promise<ColetaGrupo2[]>;
  getColetaGrupo1(id: number): Promise<ColetaGrupo1 | undefined>;
  getColetaGrupo2(id: number): Promise<ColetaGrupo2 | undefined>;
  createColetaGrupo1(coleta: InsertColetaGrupo1): Promise<ColetaGrupo1 | null>;
  createColetaGrupo2(coleta: InsertColetaGrupo2): Promise<ColetaGrupo2 | null>;
  updateColetaGrupo1(id: number, coleta: Partial<InsertColetaGrupo1>): Promise<ColetaGrupo1 | undefined>;
  updateColetaGrupo2(id: number, coleta: Partial<InsertColetaGrupo2>): Promise<ColetaGrupo2 | undefined>;
  deleteColetaGrupo1(id: number): Promise<boolean>;
  deleteColetaGrupo2(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private accessCode: string;
  private coletasGrupo1: Map<number, ColetaGrupo1>;
  private coletasGrupo2: Map<number, ColetaGrupo2>;
  private nextIdGrupo1: number;
  private nextIdGrupo2: number;

  constructor() {
    this.accessCode = "UFHPC@2025";
    this.coletasGrupo1 = new Map();
    this.coletasGrupo2 = new Map();
    this.nextIdGrupo1 = 1;
    this.nextIdGrupo2 = 1;
  }

  async getAccessCode(): Promise<string> {
    return this.accessCode;
  }

  async verifyAccessCode(code: string): Promise<boolean> {
    return code === this.accessCode;
  }

  async getColetasGrupo1(): Promise<ColetaGrupo1[]> {
    return Array.from(this.coletasGrupo1.values()).sort((a, b) => {
      const dateCompare = new Date(b.dataColeta).getTime() - new Date(a.dataColeta).getTime();
      if (dateCompare !== 0) return dateCompare;
      return (b.id || 0) - (a.id || 0);
    });
  }

  async getColetasGrupo2(): Promise<ColetaGrupo2[]> {
    return Array.from(this.coletasGrupo2.values()).sort((a, b) => {
      const dateCompare = new Date(b.dataColeta).getTime() - new Date(a.dataColeta).getTime();
      if (dateCompare !== 0) return dateCompare;
      return (b.id || 0) - (a.id || 0);
    });
  }

  async getColetaGrupo1(id: number): Promise<ColetaGrupo1 | undefined> {
    return this.coletasGrupo1.get(id);
  }

  async getColetaGrupo2(id: number): Promise<ColetaGrupo2 | undefined> {
    return this.coletasGrupo2.get(id);
  }

  async createColetaGrupo1(insertColeta: InsertColetaGrupo1): Promise<ColetaGrupo1 | null> {
    // Verificação atômica de duplicata
    const duplicata = Array.from(this.coletasGrupo1.values()).find(
      c => c.dataColeta === insertColeta.dataColeta && c.linhaProducao === insertColeta.linhaProducao
    );
    
    if (duplicata) {
      return null; // Já existe registro para essa linha nessa data
    }
    
    const id = this.nextIdGrupo1++;
    const coleta: ColetaGrupo1 = {
      ...insertColeta,
      sku: insertColeta.sku || '',
      pesoSacolaVarpe: insertColeta.pesoSacolaVarpe || 0,
      parametroPainel: insertColeta.parametroPainel ?? null,
      acrisson: insertColeta.acrisson ?? null,
      id,
      createdAt: new Date().toISOString(),
    };
    this.coletasGrupo1.set(id, coleta);
    return coleta;
  }

  async createColetaGrupo2(insertColeta: InsertColetaGrupo2): Promise<ColetaGrupo2 | null> {
    // Verificação atômica de duplicata
    const duplicata = Array.from(this.coletasGrupo2.values()).find(
      c => c.dataColeta === insertColeta.dataColeta && c.linhaProducao === insertColeta.linhaProducao
    );
    
    if (duplicata) {
      return null; // Já existe registro para essa linha nessa data
    }
    
    const id = this.nextIdGrupo2++;
    const coleta: ColetaGrupo2 = {
      ...insertColeta,
      sku: insertColeta.sku || '',
      pesoSacolaVarpe: insertColeta.pesoSacolaVarpe || 0,
      parametroPainel: insertColeta.parametroPainel ?? null,
      acrisson: insertColeta.acrisson ?? null,
      id,
      createdAt: new Date().toISOString(),
    };
    this.coletasGrupo2.set(id, coleta);
    return coleta;
  }

  async updateColetaGrupo1(id: number, updates: Partial<InsertColetaGrupo1>): Promise<ColetaGrupo1 | undefined> {
    const existing = this.coletasGrupo1.get(id);
    if (!existing) return undefined;
    
    const updated: ColetaGrupo1 = {
      ...existing,
      ...updates,
      id,
      createdAt: existing.createdAt,
    };
    this.coletasGrupo1.set(id, updated);
    return updated;
  }

  async updateColetaGrupo2(id: number, updates: Partial<InsertColetaGrupo2>): Promise<ColetaGrupo2 | undefined> {
    const existing = this.coletasGrupo2.get(id);
    if (!existing) return undefined;
    
    const updated: ColetaGrupo2 = {
      ...existing,
      ...updates,
      id,
      createdAt: existing.createdAt,
    };
    this.coletasGrupo2.set(id, updated);
    return updated;
  }

  async deleteColetaGrupo1(id: number): Promise<boolean> {
    return this.coletasGrupo1.delete(id);
  }

  async deleteColetaGrupo2(id: number): Promise<boolean> {
    return this.coletasGrupo2.delete(id);
  }
}

export const storage = new MemStorage();
