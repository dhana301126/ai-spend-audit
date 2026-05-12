import { runAudit } from '@/lib/auditEngine'

describe('Audit Engine', () => {
  test('returns optimal for correctly priced plan', () => {
    const result = runAudit({
      tools: [{ tool: 'cursor', plan: 'Pro', seats: 1, monthlySpend: 20 }],
      teamSize: 1,
      useCase: 'coding',
    })
    expect(result.recommendations[0].estimatedSavings).toBe(0)
    expect(result.totalMonthlySavings).toBe(0)
  })

  test('detects overpaying vs expected price', () => {
    const result = runAudit({
      tools: [{ tool: 'cursor', plan: 'Pro', seats: 1, monthlySpend: 50 }],
      teamSize: 1,
      useCase: 'coding',
    })
    expect(result.recommendations[0].estimatedSavings).toBeGreaterThan(0)
  })

  test('recommends downgrade for small team on business plan', () => {
    const result = runAudit({
      tools: [{ tool: 'github-copilot', plan: 'Business', seats: 2, monthlySpend: 38 }],
      teamSize: 2,
      useCase: 'coding',
    })
    expect(result.recommendations[0].estimatedSavings).toBeGreaterThan(0)
  })

  test('calculates annual savings correctly', () => {
    const result = runAudit({
      tools: [{ tool: 'cursor', plan: 'Pro', seats: 1, monthlySpend: 50 }],
      teamSize: 1,
      useCase: 'coding',
    })
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
  })

  test('suggests cursor for coding use case over chatgpt', () => {
    const result = runAudit({
      tools: [{ tool: 'chatgpt', plan: 'Plus', seats: 2, monthlySpend: 40 }],
      teamSize: 2,
      useCase: 'coding',
    })
    expect(result.recommendations[0].recommendedAction).toContain('Cursor')
  })
})