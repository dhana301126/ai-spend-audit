import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { auditId, totalMonthlySavings, totalAnnualSavings, tools, useCase } = await req.json()

    let summary = ''

    try {
      const message = await client.messages.create({
        model: 'claude-opus-4-5',
        max_tokens: 200,
        messages: [
          {
            role: 'user',
            content: `You are an AI spend analyst. Write a 80-100 word personalized summary for a startup audit report.
            
The startup uses these AI tools: ${tools.join(', ')}.
Their primary use case is: ${useCase}.
We identified $${totalMonthlySavings}/month ($${totalAnnualSavings}/year) in potential savings.

Write a friendly, specific, actionable summary. Start with their situation, mention the savings opportunity, and end with encouragement. No bullet points, just a paragraph.`,
          },
        ],
      })

      summary = message.content[0].type === 'text' ? message.content[0].text : ''
    } catch (apiError) {
      console.error('Anthropic API error:', apiError)
      // Fallback summary if API fails
      summary = `Based on your AI tool usage for ${useCase} tasks, we've identified $${totalMonthlySavings}/month in potential savings — that's $${totalAnnualSavings}/year. By optimizing your current subscriptions and switching to better-fit plans, your team can significantly reduce AI spend without sacrificing productivity. These savings can be redirected toward growth initiatives that matter most to your business.`
    }

    // Update the audit record with the summary
    await supabase
      .from('audits')
      .update({ summary })
      .eq('id', auditId)

    return NextResponse.json({ summary })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
  }
}