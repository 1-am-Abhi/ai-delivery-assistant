import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const callLogs = pgTable("call_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phoneNumber: text("phone_number").notNull(),
  callerName: text("caller_name"),
  status: text("status").notNull(), // 'completed', 'in_progress', 'failed', 'escalated'
  duration: integer("duration"), // in seconds
  transcript: text("transcript"),
  deliveryInstructions: text("delivery_instructions"),
  verificationRequired: boolean("verification_required").default(false),
  otpProvided: text("otp_provided"),
  codAmount: integer("cod_amount"),
  packageId: text("package_id"),
  createdAt: timestamp("created_at").defaultNow(),
  endedAt: timestamp("ended_at"),
});

export const deliverySettings = pgTable("delivery_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  defaultInstructions: text("default_instructions").notNull(),
  emergencyContacts: json("emergency_contacts").$type<string[]>(),
  allowCod: boolean("allow_cod").default(true),
  requireOtp: boolean("require_otp").default(false),
  escalationThreshold: integer("escalation_threshold").default(3), // minutes
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiConfiguration = pgTable("ai_configuration", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voiceModel: text("voice_model").default("alloy"),
  language: text("language").default("hi-en"), // Hindi-English mix
  responseSpeed: text("response_speed").default("normal"),
  personalityTone: text("personality_tone").default("friendly"),
  hindiProficiency: integer("hindi_proficiency").default(80), // percentage
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCallLogSchema = createInsertSchema(callLogs).omit({
  id: true,
  createdAt: true,
  endedAt: true,
});

export const insertDeliverySettingsSchema = createInsertSchema(deliverySettings).omit({
  id: true,
  updatedAt: true,
});

export const insertAiConfigurationSchema = createInsertSchema(aiConfiguration).omit({
  id: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CallLog = typeof callLogs.$inferSelect;
export type InsertCallLog = z.infer<typeof insertCallLogSchema>;
export type DeliverySettings = typeof deliverySettings.$inferSelect;
export type InsertDeliverySettings = z.infer<typeof insertDeliverySettingsSchema>;
export type AiConfiguration = typeof aiConfiguration.$inferSelect;
export type InsertAiConfiguration = z.infer<typeof insertAiConfigurationSchema>;
