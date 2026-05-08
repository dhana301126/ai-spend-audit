export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export type ToolName =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf'

export interface ToolEntry {
  tool: ToolName
  plan: string
  seats: number
  monthlySpend: number
}

export interface AuditInput {
  tools: ToolEntry[]
  teamSize: number
  useCase: UseCase
}

export interface ToolRecommendation {
  tool: ToolName
  currentPlan: string
  currentSpend: number
  recommendedAction: string
  recommendedPlan?: string
  estimatedSavings: number
  reason: string
}

export interface AuditResult {
  id: string
  input: AuditInput
  recommendations: ToolRecommendation[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  summary: string
  createdAt: string
}