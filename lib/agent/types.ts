// =============================================
// AI Agent Worker — Type Definitions
// =============================================

export interface TaskAnalysis {
  canHandle: boolean;
  difficulty: "easy" | "medium" | "hard";
  estimatedDays: number;
  suggestedPrice: number;
  reason: string;
  approach: string; // Brief description of how agent would tackle this
}

export interface GeneratedBid {
  coverLetter: string;
  amount: number;
  estimatedDays: number;
}

export interface TaskResult {
  content: string;       // Generated content (markdown)
  summary: string;       // Brief summary of what was done
  fileUrl?: string;      // URL of generated file in MinIO (if applicable)
}

export interface AgentCycleResult {
  scanned: number;
  analyzed: number;
  bidded: number;
  executed: number;
  skipped: number;
  errors: string[];
}

export interface RevisionRequest {
  orderId: string;
  taskId: string;
  originalContent: string;
  revisionNote: string;
  chatHistory: { sender: string; content: string }[];
}
