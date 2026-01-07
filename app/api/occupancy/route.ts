import { NextRequest, NextResponse } from 'next/server'
import { getOccupancyGrid } from '@/lib/occupancy'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Se não fornecido, usar mês atual
    const now = new Date()
    const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const start = startDate ? new Date(startDate) : defaultStart
    const end = endDate ? new Date(endDate) : defaultEnd

    if (start >= end) {
      return NextResponse.json(
        { error: 'Data final deve ser posterior à data inicial' },
        { status: 400 }
      )
    }

    const occupancyGrid = await getOccupancyGrid(start, end)

    return NextResponse.json(occupancyGrid)
  } catch (error) {
    console.error('Error fetching occupancy grid:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar ocupação' },
      { status: 500 }
    )
  }
}





