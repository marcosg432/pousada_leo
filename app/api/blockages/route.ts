import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateDates } from '@/lib/date-helpers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')

    const where: any = {}
    if (roomId) {
      where.roomId = roomId
    }

    const blockages = await prisma.roomBlockage.findMany({
      where,
      include: {
        room: {
          select: {
            id: true,
            number: true,
            name: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    })

    return NextResponse.json(blockages)
  } catch (error) {
    console.error('Error fetching blockages:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar bloqueios' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.roomId || !data.startDate || !data.endDate) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    // Validar datas
    const validation = validateDates(data.startDate, data.endDate)
    if (!validation.valid || !validation.checkInDate || !validation.checkOutDate) {
      return NextResponse.json(
        { error: validation.error || 'Datas inválidas' },
        { status: 400 }
      )
    }

    // Verificar se o quarto existe
    const room = await prisma.room.findUnique({
      where: { id: data.roomId },
    })

    if (!room) {
      return NextResponse.json(
        { error: 'Quarto não encontrado' },
        { status: 404 }
      )
    }

    // Criar bloqueio
    const blockage = await prisma.roomBlockage.create({
      data: {
        roomId: data.roomId,
        startDate: validation.checkInDate,
        endDate: validation.checkOutDate,
        reason: data.reason || 'maintenance',
        notes: data.notes || null,
      },
      include: {
        room: {
          select: {
            id: true,
            number: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(blockage, { status: 201 })
  } catch (error) {
    console.error('Error creating blockage:', error)
    return NextResponse.json(
      { error: 'Erro ao criar bloqueio' },
      { status: 500 }
    )
  }
}





