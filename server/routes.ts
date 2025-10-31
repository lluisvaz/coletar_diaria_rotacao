import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertColetaGrupo1Schema, insertColetaGrupo2Schema } from "@shared/schema";
import { z } from "zod";
import { formatInTimeZone } from "date-fns-tz";

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.status(401).json({ error: "Não autenticado" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/auth/verify - Verifica o código de acesso
  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        res.status(400).json({ error: "Código de acesso não fornecido" });
        return;
      }
      
      const isValid = await storage.verifyAccessCode(code);
      
      if (isValid) {
        req.session.authenticated = true;
        res.json({ success: true });
      } else {
        res.status(401).json({ error: "Código de acesso inválido" });
      }
    } catch (error) {
      console.error("Erro ao verificar código de acesso:", error);
      res.status(500).json({ error: "Erro ao verificar código" });
    }
  });

  // GET /api/auth/status - Verifica se está autenticado
  app.get("/api/auth/status", async (req, res) => {
    res.json({ authenticated: !!req.session.authenticated });
  });

  // POST /api/auth/logout - Faz logout
  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ error: "Erro ao fazer logout" });
      } else {
        res.json({ success: true });
      }
    });
  });

  // GET /api/coleta/grupo1 - Retorna todas as coletas do Grupo 1
  app.get("/api/coleta/grupo1", requireAuth, async (_req, res) => {
    try {
      const coletas = await storage.getColetasGrupo1();
      res.json(coletas);
    } catch (error) {
      console.error("Erro ao buscar coletas do Grupo 1:", error);
      res.status(500).json({ error: "Erro ao buscar coletas" });
    }
  });

  // GET /api/coleta/grupo2 - Retorna todas as coletas do Grupo 2
  app.get("/api/coleta/grupo2", requireAuth, async (_req, res) => {
    try {
      const coletas = await storage.getColetasGrupo2();
      res.json(coletas);
    } catch (error) {
      console.error("Erro ao buscar coletas do Grupo 2:", error);
      res.status(500).json({ error: "Erro ao buscar coletas" });
    }
  });

  // POST /api/coleta/grupo1 - Salva uma nova coleta do Grupo 1
  app.post("/api/coleta/grupo1", requireAuth, async (req, res) => {
    try {
      const validatedData = insertColetaGrupo1Schema.parse(req.body);
      
      // Validar se a data é hoje (usar fuso horário de São Paulo)
      const hoje = formatInTimeZone(new Date(), "America/Sao_Paulo", "yyyy-MM-dd");
      if (validatedData.dataColeta !== hoje) {
        res.status(400).json({ 
          error: "Só é permitido registrar dados do dia atual" 
        });
        return;
      }
      
      // Tentar criar a coleta com verificação atômica de duplicata
      const coleta = await storage.createColetaGrupo1(validatedData);
      
      if (!coleta) {
        res.status(409).json({ 
          error: `A linha ${validatedData.linhaProducao} já possui registro para o dia ${new Date(validatedData.dataColeta).toLocaleDateString('pt-BR')}.` 
        });
        return;
      }
      
      res.status(201).json(coleta);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: "Dados inválidos", 
          details: error.errors 
        });
      } else {
        console.error("Erro ao criar coleta do Grupo 1:", error);
        res.status(500).json({ error: "Erro ao salvar coleta" });
      }
    }
  });

  // POST /api/coleta/grupo2 - Salva uma nova coleta do Grupo 2
  app.post("/api/coleta/grupo2", requireAuth, async (req, res) => {
    try {
      const validatedData = insertColetaGrupo2Schema.parse(req.body);
      
      // Validar se a data é hoje (usar fuso horário de São Paulo)
      const hoje = formatInTimeZone(new Date(), "America/Sao_Paulo", "yyyy-MM-dd");
      if (validatedData.dataColeta !== hoje) {
        res.status(400).json({ 
          error: "Só é permitido registrar dados do dia atual" 
        });
        return;
      }
      
      // Tentar criar a coleta com verificação atômica de duplicata
      const coleta = await storage.createColetaGrupo2(validatedData);
      
      if (!coleta) {
        res.status(409).json({ 
          error: `A linha ${validatedData.linhaProducao} já possui registro para o dia ${new Date(validatedData.dataColeta).toLocaleDateString('pt-BR')}.` 
        });
        return;
      }
      
      res.status(201).json(coleta);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: "Dados inválidos", 
          details: error.errors 
        });
      } else {
        console.error("Erro ao criar coleta do Grupo 2:", error);
        res.status(500).json({ error: "Erro ao salvar coleta" });
      }
    }
  });

  // PUT /api/coleta/grupo1/:id - Atualiza uma coleta do Grupo 1
  app.put("/api/coleta/grupo1/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertColetaGrupo1Schema.partial().parse(req.body);
      const coleta = await storage.updateColetaGrupo1(id, validatedData);
      
      if (!coleta) {
        res.status(404).json({ error: "Coleta não encontrada" });
        return;
      }
      
      res.json(coleta);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: "Dados inválidos", 
          details: error.errors 
        });
      } else {
        console.error("Erro ao atualizar coleta do Grupo 1:", error);
        res.status(500).json({ error: "Erro ao atualizar coleta" });
      }
    }
  });

  // PUT /api/coleta/grupo2/:id - Atualiza uma coleta do Grupo 2
  app.put("/api/coleta/grupo2/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertColetaGrupo2Schema.partial().parse(req.body);
      const coleta = await storage.updateColetaGrupo2(id, validatedData);
      
      if (!coleta) {
        res.status(404).json({ error: "Coleta não encontrada" });
        return;
      }
      
      res.json(coleta);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: "Dados inválidos", 
          details: error.errors 
        });
      } else {
        console.error("Erro ao atualizar coleta do Grupo 2:", error);
        res.status(500).json({ error: "Erro ao atualizar coleta" });
      }
    }
  });

  // DELETE /api/coleta/grupo1/:id - Remove uma coleta do Grupo 1
  app.delete("/api/coleta/grupo1/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteColetaGrupo1(id);
      
      if (!deleted) {
        res.status(404).json({ error: "Coleta não encontrada" });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar coleta do Grupo 1:", error);
      res.status(500).json({ error: "Erro ao deletar coleta" });
    }
  });

  // DELETE /api/coleta/grupo2/:id - Remove uma coleta do Grupo 2
  app.delete("/api/coleta/grupo2/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteColetaGrupo2(id);
      
      if (!deleted) {
        res.status(404).json({ error: "Coleta não encontrada" });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Erro ao deletar coleta do Grupo 2:", error);
      res.status(500).json({ error: "Erro ao deletar coleta" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
