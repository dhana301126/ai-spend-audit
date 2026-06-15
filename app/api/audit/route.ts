import { NextRequest, NextResponse } from 'next/server'
import { runAudit } from '@/lib/auditEngine'
import { AuditInput } from '@/types'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const input: AuditInput = await req.json()

    if (!input.tools || input.tools.length === 0) {
      return NextResponse.json({ error: 'No tools provided' }, { status: 400 })
    }

    const result = runAudit(input)

    try {
      await supabase.from('audits').insert({
        id: result.id,
        input: result.input,
        recommendations: result.recommendations,
        total_monthly_savings: result.totalMonthlySavings,
        total_annual_savings: result.totalAnnualSavings,
        summary: '',
      })
    } catch (dbError) {
      console.error('DB error:', dbError)
    }

    // Return both id AND full result so sessionStorage can cache it
    return NextResponse.json({ 
      id: result.id, 
      result: {
        id: result.id,
        input: result.input,
        recommendations: result.recommendations,
        totalMonthlySavings: result.totalMonthlySavings,
        totalAnnualSavings: result.totalAnnualSavings,
        summary: '',
        createdAt: result.createdAt,
      }
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'No id' }, { status: 400 })

  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
  }

  return NextResponse.json({
    id: data.id,
    input: data.input,
    recommendations: data.recommendations,
    totalMonthlySavings: data.total_monthly_savings,
    totalAnnualSavings: data.total_annual_savings,
    summary: data.summary,
    createdAt: data.created_at,
  })
}