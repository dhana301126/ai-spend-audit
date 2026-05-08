import { AuditInput, AuditResult, ToolRecommendation } from '@/types'

const PRICING: Record<string, Record<string, number>> = {
  cursor: {
    hobby: 0,
    pro: 20,
    business: 40,
    enterprise: 100,
  },
  'github-copilot': {
    individual: 10,
    business: 19,
    enterprise: 39,
  },
  claude: {
    free: 0,
    pro: 20,
    max: 100,
    team: 30,
    enterprise: 60,
    api: 0,
  },
  chatgpt: {
    free: 0,
    plus: 20,
    team: 30,
    enterprise: 60,
    api: 0,
  },
  'anthropic-api': { direct: 0 },
  'openai-api': { direct: 0 },
  gemini: {
    free: 0,
    pro: 20,
    ultra: 300,
    api: 0,
  },
  windsurf: {
    free: 0,
    pro: 15,
    team: 35,
  },
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10)
}

export function runAudit(input: AuditInput): AuditResult {
  const recommendations: ToolRecommendation[] = []

  for (const entry of input.tools) {
    const { tool, plan, seats, monthlySpend } = entry
    const planPricing = PRICING[tool] || {}
    const expectedPerSeat = planPricing[plan.toLowerCase()] ?? monthlySpend / seats
    const expectedTotal = expectedPerSeat * seats
    let estimatedSavings = 0
    let recommendedAction = 'No change needed'
    let recommendedPlan = plan
    let reason = 'Your current plan looks appropriate for your team size and usage.'

    // Check if overpaying vs expected price
    if (monthlySpend > expectedTotal * 1.1) {
      estimatedSavings = monthlySpend - expectedTotal
      recommendedAction = 'Review your billing — you may be on a higher tier than needed'
      reason = `You're paying $${monthlySpend}/mo but expected cost for ${seats} seats on ${plan} is $${expectedTotal}/mo.`
    }

    // Check if team is too small for team/enterprise plan
    if ((plan.toLowerCase() === 'team' || plan.toLowerCase() === 'business') && seats <= 2) {
      const individualPrice = planPricing['individual'] || planPricing['pro'] || planPricing['plus']
      if (individualPrice) {
        const individualTotal = individualPrice * seats
        if (individualTotal < monthlySpend) {
          estimatedSavings = Math.max(estimatedSavings, monthlySpend - individualTotal)
          recommendedPlan = 'Individual/Pro'
          recommendedAction = `Downgrade to Individual or Pro plan`
          reason = `With only ${seats} seat(s), a team plan is overkill. Individual plans would cost $${individualTotal}/mo vs $${monthlySpend}/mo.`
        }
      }
    }

    // Coding use case: suggest Cursor over expensive alternatives
    if (input.useCase === 'coding' && tool === 'chatgpt' && monthlySpend >= 20) {
      estimatedSavings = Math.max(estimatedSavings, monthlySpend - 20 * seats)
      recommendedAction = 'Switch to Cursor Pro for coding'
      reason = `For coding, Cursor Pro ($20/seat/mo) is purpose-built and more cost-effective than ChatGPT for your use case.`
    }

    // Writing use case: Claude Pro is cheaper than ChatGPT Team
    if (input.useCase === 'writing' && tool === 'chatgpt' && plan.toLowerCase() === 'team') {
      const claudeSavings = monthlySpend - 20 * seats
      if (claudeSavings > 0) {
        estimatedSavings = Math.max(estimatedSavings, claudeSavings)
        recommendedAction = 'Switch to Claude Pro for writing tasks'
        reason = `Claude Pro ($20/seat/mo) is excellent for writing and cheaper than ChatGPT Team ($30/seat/mo).`
      }
    }

    recommendations.push({
      tool,
      currentPlan: plan,
      currentSpend: monthlySpend,
      recommendedAction,
      recommendedPlan,
      estimatedSavings: Math.round(estimatedSavings),
      reason,
    })
  }

  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.estimatedSavings, 0)

  return {
    id: generateId(),
    input,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    summary: '',
    createdAt: new Date().toISOString(),
  }
}