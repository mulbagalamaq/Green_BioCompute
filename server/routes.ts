import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { parse } from "csv-parse/sync";
import type { InsertEquipment } from "@shared/schema";
import { generateEmbedding, createEquipmentDescription } from "./embeddings";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // GET /api/equipment - List all equipment
  app.get("/api/equipment", async (req, res) => {
    try {
      const equipmentList = await storage.getAllEquipment();
      res.json(equipmentList);
    } catch (error) {
      console.error("Error fetching equipment:", error);
      res.status(500).send("Failed to fetch equipment");
    }
  });

  // POST /api/equipment/upload - Upload CSV file
  app.post("/api/equipment/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      const csvContent = req.file.buffer.toString("utf-8");
      
      const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      const equipmentData: InsertEquipment[] = records.map((record: any) => {
        const name = record["Equipment/Process"] || record["name"] || "";
        const category = record["Category"] || record["category"] || "Unknown";
        const type = record["Equipment Type"] || record["type"] || name;
        const carbonFootprint = parseFloat(record["Carbon Footprint (kgCO2e)"] || record["carbon_footprint_kg"] || "0");
        const annualUsage = parseFloat(record["Annual Usage (hours/runs)"] || record["annual_usage_hours"] || "0");
        const annualImpact = parseFloat(record["Annual Carbon Impact (kgCO2e)"] || record["annual_carbon_impact_kg"] || "0");
        const manufacturer = record["Manufacturer"] || record["manufacturer"] || null;
        const hasApi = record["Has API"]?.toLowerCase() === "yes" || record["has_api"] === "true" || false;
        const apiVendor = record["API Vendor"] || record["api_vendor"] || null;

        return {
          name,
          category,
          type,
          manufacturer,
          carbon_footprint_kg: carbonFootprint.toString(),
          annual_usage_hours: annualUsage.toString(),
          annual_carbon_impact_kg: annualImpact.toString(),
          has_api: hasApi,
          api_vendor: apiVendor,
        };
      });

      const created = await storage.createEquipmentBulk(equipmentData);

      console.log(`Generated embeddings for ${created.length} equipment items...`);
      for (const equip of created) {
        const description = createEquipmentDescription(equip);
        const embedding = await generateEmbedding(description);
        
        await storage.createEquipmentEmbedding({
          equipment_id: equip.id,
          embedding: JSON.stringify(embedding),
          text_content: description,
        });
      }

      res.json({ 
        success: true, 
        count: created.length,
        message: `Successfully imported ${created.length} equipment items with embeddings`
      });
    } catch (error) {
      console.error("Error uploading CSV:", error);
      res.status(500).send(error instanceof Error ? error.message : "Failed to upload CSV");
    }
  });

  // POST /api/chat - RAG chat endpoint (to be implemented in task 8)
  app.post("/api/chat", async (req, res) => {
    res.status(501).json({ error: "Chat endpoint not yet implemented" });
  });

  const httpServer = createServer(app);

  return httpServer;
}
