import { db } from "./db";
import { 
  type User, 
  type InsertUser, 
  type Equipment, 
  type InsertEquipment,
  type EquipmentEmbedding,
  type InsertEquipmentEmbedding,
  users,
  equipment,
  equipmentEmbeddings
} from "@shared/schema";
import { randomUUID } from "crypto";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllEquipment(): Promise<Equipment[]>;
  getEquipmentById(id: string): Promise<Equipment | undefined>;
  createEquipment(data: InsertEquipment): Promise<Equipment>;
  createEquipmentBulk(data: InsertEquipment[]): Promise<Equipment[]>;
  deleteAllEquipment(): Promise<void>;
  
  createEquipmentEmbedding(data: InsertEquipmentEmbedding): Promise<EquipmentEmbedding>;
  searchEquipmentByEmbedding(embedding: number[], limit?: number): Promise<Equipment[]>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllEquipment(): Promise<Equipment[]> {
    return await db.select().from(equipment);
  }

  async getEquipmentById(id: string): Promise<Equipment | undefined> {
    const result = await db.select().from(equipment).where(eq(equipment.id, id));
    return result[0];
  }

  async createEquipment(data: InsertEquipment): Promise<Equipment> {
    const result = await db.insert(equipment).values(data).returning();
    return result[0];
  }

  async createEquipmentBulk(data: InsertEquipment[]): Promise<Equipment[]> {
    if (data.length === 0) return [];
    const result = await db.insert(equipment).values(data).returning();
    return result;
  }

  async deleteAllEquipment(): Promise<void> {
    await db.delete(equipment);
  }

  async createEquipmentEmbedding(data: InsertEquipmentEmbedding): Promise<EquipmentEmbedding> {
    const result = await db.insert(equipmentEmbeddings).values(data).returning();
    return result[0];
  }

  async searchEquipmentByEmbedding(embedding: number[], limit: number = 5): Promise<Equipment[]> {
    const embeddingStr = `[${embedding.join(',')}]`;
    
    const result = await db.execute(sql`
      SELECT e.*
      FROM ${equipment} e
      JOIN ${equipmentEmbeddings} ee ON e.id = ee.equipment_id
      ORDER BY ee.embedding <-> ${embeddingStr}::vector
      LIMIT ${limit}
    `);
    
    return result.rows as Equipment[];
  }
}

export const storage = new DbStorage();
