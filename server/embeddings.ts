import { pipeline, env } from "@xenova/transformers";

env.allowLocalModels = false;
env.allowRemoteModels = true;

let embeddingPipeline: any = null;

export async function initEmbeddingModel() {
  if (!embeddingPipeline) {
    console.log("Loading embedding model: all-MiniLM-L6-v2...");
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    console.log("Embedding model loaded successfully");
  }
  return embeddingPipeline;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = await initEmbeddingModel();
  
  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });
  
  return Array.from(output.data) as number[];
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const model = await initEmbeddingModel();
  
  const embeddings: number[][] = [];
  
  for (const text of texts) {
    const output = await model(text, {
      pooling: "mean",
      normalize: true,
    });
    embeddings.push(Array.from(output.data) as number[]);
  }
  
  return embeddings;
}

export function createEquipmentDescription(equipment: {
  name: string;
  category: string;
  type: string;
  manufacturer?: string | null;
  carbon_footprint_kg: string;
  annual_usage_hours: string;
  annual_carbon_impact_kg: string;
  has_api?: boolean | null;
  api_vendor?: string | null;
}): string {
  const parts = [
    `Equipment: ${equipment.name}`,
    `Category: ${equipment.category}`,
    `Type: ${equipment.type}`,
  ];
  
  if (equipment.manufacturer) {
    parts.push(`Manufacturer: ${equipment.manufacturer}`);
  }
  
  parts.push(
    `Carbon footprint: ${equipment.carbon_footprint_kg} kgCO2e`,
    `Annual usage: ${equipment.annual_usage_hours} hours`,
    `Annual carbon impact: ${equipment.annual_carbon_impact_kg} kgCO2e per year`
  );
  
  if (equipment.has_api && equipment.api_vendor) {
    parts.push(`Has API integration available via ${equipment.api_vendor}`);
  }
  
  return parts.join(". ");
}
