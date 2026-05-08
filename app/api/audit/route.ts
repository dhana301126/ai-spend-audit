import { NextRequest, NextResponse } from 'next/server'
import { runAudit } from '@/lib/auditEngine'
import { AuditInput } from '@/types'

export const auditStore: Record<string, object> = {}

export async function POST(req: NextRequest) {
  try {
    const input: AuditInput = await req.json()

    if (!input.tools || input.tools.length === 0) {
      return NextResponse.json({ error: 'No tools provided' }, { status: 400 })
    }

    const result = runAudit(input)

    auditStore[result.id] = result

    return NextResponse.json({ id: result.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id || !auditStore[id]) {
    return NextResponse.json({ error: 'Audit not found' }, { status: 404 })
  }
  return NextResponse.json(auditStore[id])
}