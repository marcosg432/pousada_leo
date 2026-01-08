import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseRoomData, prepareRoomData } from '@/lib/room-helpers'

export async function GET(request: NextRequest) {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        number: 'asc',
      },
    })

    // Converter JSON strings para arrays
    const parsedRooms = rooms.map(parseRoomData)

    // Ordenar por nome para garantir ordem correta: Suíte 1, 2, 3, 4
    const sortedRooms = parsedRooms.sort((a, b) => {
      // Extrair número do nome (ex: "Suíte 1" -> 1, "Suíte 2" -> 2)
      const numA = parseInt(a.name.match(/\d+/)?.[0] || '999')
      const numB = parseInt(b.name.match(/\d+/)?.[0] || '999')
      return numA - numB
    })

    return NextResponse.json(sortedRooms)
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar quartos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Converter arrays para JSON strings (SQLite)
    const roomData = prepareRoomData({
      number: data.number,
      name: data.name,
      description: data.description,
      capacity: data.capacity || 2,
      price: data.price,
      type: data.type || null, // frente, fundos
      amenities: data.amenities || [],
      images: data.images || [],
      status: data.status || 'available',
    })

    const room = await prisma.room.create({
      data: roomData,
    })

    // Retornar com arrays parseados
    return NextResponse.json(parseRoomData(room), { status: 201 })
  } catch (error) {
    console.error('Error creating room:', error)
    return NextResponse.json(
      { error: 'Erro ao criar quarto' },
      { status: 500 }
    )
  }
}

