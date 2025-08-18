import { type User, type InsertUser, type CallLog, type InsertCallLog, type DeliverySettings, type InsertDeliverySettings, type AiConfiguration, type InsertAiConfiguration } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Call logs
  getCallLogs(): Promise<CallLog[]>;
  getCallLog(id: string): Promise<CallLog | undefined>;
  createCallLog(callLog: InsertCallLog): Promise<CallLog>;
  updateCallLog(id: string, updates: Partial<CallLog>): Promise<CallLog | undefined>;
  
  // Delivery settings
  getDeliverySettings(): Promise<DeliverySettings | undefined>;
  updateDeliverySettings(settings: InsertDeliverySettings): Promise<DeliverySettings>;
  
  // AI configuration
  getAiConfiguration(): Promise<AiConfiguration | undefined>;
  updateAiConfiguration(config: InsertAiConfiguration): Promise<AiConfiguration>;
  
  // Stats
  getCallStats(): Promise<{
    totalCalls: number;
    successfulDeliveries: number;
    averageDuration: number;
    successRate: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private callLogs: Map<string, CallLog>;
  private deliverySettings: DeliverySettings | undefined;
  private aiConfiguration: AiConfiguration | undefined;

  constructor() {
    this.users = new Map();
    this.callLogs = new Map();
    
    // Initialize default settings
    this.deliverySettings = {
      id: randomUUID(),
      defaultInstructions: "Please leave the package at the main gate. The security guard will collect it. For any issues, please call the emergency contact.",
      emergencyContacts: ["+91 98765 43210"],
      allowCod: true,
      requireOtp: false,
      escalationThreshold: 3,
      updatedAt: new Date(),
    };
    
    this.aiConfiguration = {
      id: randomUUID(),
      voiceModel: "alloy",
      language: "hi-en",
      responseSpeed: "normal",
      personalityTone: "friendly",
      hindiProficiency: 80,
      updatedAt: new Date(),
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCallLogs(): Promise<CallLog[]> {
    return Array.from(this.callLogs.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getCallLog(id: string): Promise<CallLog | undefined> {
    return this.callLogs.get(id);
  }

  async createCallLog(insertCallLog: InsertCallLog): Promise<CallLog> {
    const id = randomUUID();
    const callLog: CallLog = {
      ...insertCallLog,
      id,
      createdAt: new Date(),
      endedAt: null,
      duration: insertCallLog.duration || null,
      callerName: insertCallLog.callerName || null,
      transcript: insertCallLog.transcript || null,
      deliveryInstructions: insertCallLog.deliveryInstructions || null,
      verificationRequired: insertCallLog.verificationRequired || null,
      otpProvided: insertCallLog.otpProvided || null,
      codAmount: insertCallLog.codAmount || null,
      packageId: insertCallLog.packageId || null,
    };
    this.callLogs.set(id, callLog);
    return callLog;
  }

  async updateCallLog(id: string, updates: Partial<CallLog>): Promise<CallLog | undefined> {
    const callLog = this.callLogs.get(id);
    if (!callLog) return undefined;
    
    const updatedCallLog = { ...callLog, ...updates };
    this.callLogs.set(id, updatedCallLog);
    return updatedCallLog;
  }

  async getDeliverySettings(): Promise<DeliverySettings | undefined> {
    return this.deliverySettings;
  }

  async updateDeliverySettings(settings: InsertDeliverySettings): Promise<DeliverySettings> {
    if (!this.deliverySettings) {
      throw new Error('Delivery settings not initialized');
    }
    this.deliverySettings = {
      ...this.deliverySettings,
      ...settings,
      emergencyContacts: settings.emergencyContacts || this.deliverySettings.emergencyContacts,
      updatedAt: new Date(),
    };
    return this.deliverySettings;
  }

  async getAiConfiguration(): Promise<AiConfiguration | undefined> {
    return this.aiConfiguration;
  }

  async updateAiConfiguration(config: InsertAiConfiguration): Promise<AiConfiguration> {
    if (!this.aiConfiguration) {
      throw new Error('AI configuration not initialized');
    }
    this.aiConfiguration = {
      ...this.aiConfiguration,
      ...config,
      updatedAt: new Date(),
    };
    return this.aiConfiguration;
  }

  async getCallStats(): Promise<{
    totalCalls: number;
    successfulDeliveries: number;
    averageDuration: number;
    successRate: number;
  }> {
    const logs = Array.from(this.callLogs.values());
    const totalCalls = logs.length;
    const successfulDeliveries = logs.filter(log => log.status === 'completed').length;
    const completedCalls = logs.filter(log => log.duration !== null);
    const averageDuration = completedCalls.length > 0 
      ? completedCalls.reduce((sum, log) => sum + (log.duration || 0), 0) / completedCalls.length
      : 0;
    const successRate = totalCalls > 0 ? (successfulDeliveries / totalCalls) * 100 : 0;
    
    return {
      totalCalls,
      successfulDeliveries,
      averageDuration,
      successRate,
    };
  }
}

export const storage = new MemStorage();
