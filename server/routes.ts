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

      console.log(`Generating embeddings for ${created.length} equipment items...`);
      for (const equip of created) {
        const description = createEquipmentDescription(equip);
        const embedding = await generateEmbedding(description);
        
        await storage.createEquipmentEmbedding({
          equipment_id: equip.id,
          embedding: embedding as any,
          text_content: description,
        });
      }
      console.log(`Successfully created ${created.length} equipment items with embeddings`);

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

  // POST /api/chat - RAG chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }

      // Import Groq and embeddings functions
      const Groq = (await import("groq-sdk")).default;
      const { generateEmbedding } = await import("./embeddings");
      
      const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
      });

      // Generate embedding for the question
      const questionEmbedding = await generateEmbedding(question);
      
      // Search for relevant equipment using vector similarity
      const relevantEquipment = await storage.searchEquipmentByEmbedding(questionEmbedding, 5);
      
      // Build context from relevant equipment
      const context = relevantEquipment.map((equip, idx) => 
        `${idx + 1}. ${equip.name} (${equip.category})
   - Type: ${equip.type}
   - Manufacturer: ${equip.manufacturer || "N/A"}
   - Carbon Footprint: ${equip.carbon_footprint_kg} kgCO2e
   - Annual Usage: ${equip.annual_usage_hours} hours
   - Annual Carbon Impact: ${equip.annual_carbon_impact_kg} kgCO2e/year
   - API Available: ${equip.has_api ? `Yes (${equip.api_vendor})` : "No"}`
      ).join("\n\n");

      const systemPrompt = `You are an expert assistant for a laboratory equipment carbon emissions tracking system. 
You help users understand their equipment's environmental impact and provide recommendations for optimization.

Based on the equipment data provided, answer the user's question accurately and concisely. 
If asked for recommendations, prioritize equipment with the highest carbon impact.
If asked about API integration, mention which equipment has API capabilities available.

Available Equipment Data:
${context}

Guidelines:
- Be specific and cite actual equipment names and numbers from the data
- If no relevant equipment is found, say so honestly
- Focus on actionable insights about carbon emissions
- Keep responses clear and professional`;

      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: question,
          },
        ],
        model: "llama-3.1-70b-versatile",
        temperature: 0.7,
        max_tokens: 1024,
      });

      const answer = chatCompletion.choices[0]?.message?.content || "I couldn't generate a response.";

      res.json({ answer, sources: relevantEquipment.length });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to process chat request" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
