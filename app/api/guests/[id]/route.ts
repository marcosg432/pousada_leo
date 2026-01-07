import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const guest = await prisma.guest.findUnique({
      where: { id: params.id },
      include: {
        reservations: {
          select: {
            id: true,
            checkIn: true,
            checkOut: true,
            status: true,
            totalPrice: true,
            room: {
              select: {
                number: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!guest) {
      return NextResponse.json(
        { error: 'Hóspede não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(guest)
  } catch (error) {
    console.error('Error fetching guest:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar hóspede' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()

    const guest = await prisma.guest.update({
      where: { id: params.id },
      data: {
        name: data.name,
        email: data.email || null,
        phone: data.phone,
        document: data.document || null,
        address: data.address || null,
        notes: data.notes || null,
      },
    })

    return NextResponse.json(guest)
  } catch (error) {
    console.error('Error updating guest:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar hóspede' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se o hóspede tem reservas
    const guest = await prisma.guest.findUnique({
      where: { id: params.id },
      include: {
        reservations: {
          where: {
            status: {
              not: 'cancelled',
            },
          },
        },
      },
    })

    if (!guest) {
      return NextResponse.json(
        { error: 'Hóspede não encontrado' },
        { status: 404 }
      )
    }

    // Se tiver reservas ativas, não permitir deletar
    if (guest.reservations.length > 0) {
      return NextResponse.json(
        { 
          error: 'Não é possível deletar hóspede com reservas ativas. Cancele as reservas primeiro.' 
        },
        { status: 400 }
      )
    }

    await prisma.guest.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Hóspede deletado com sucesso' })
  } catch (error) {
    console.error('Error deleting guest:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar hóspede' },
      { status: 500 }
    )
  }
}




