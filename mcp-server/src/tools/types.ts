import type { ZodSchema } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export interface ToolDefinition<Args = any> {
  name: string;
  description: string;
  schema: ZodSchema<Args>;
  handler: (args: Args, ctx: unknown) => Promise<unknown>;
  /** Optional additional metadata */
  requiredRole?: "reader" | "user" | "admin";
}

export type RegisterTool = (
  server: McpServer,
  tool: ToolDefinition,
) => void; 