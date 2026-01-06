import { NextRequest, NextResponse } from 'next/server'
import { getAvailableRooms } from '@/lib/availability'
import { parseRoomData } from '@/lib/room-helpers'
import { validateDates } from '@/lib/date-helpers'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const checkIn = searchParams.get('checkIn')
    const checkOut = searchParams.get('checkOut')

    if (!checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'checkIn e checkOut são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar datas usando helper (valida formato, passado, e ordem)
    const validation = validateDates(checkIn, checkOut)

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'Datas inválidas' },
        { status: 400 }
      )
    }

    if (!validation.checkInDate || !validation.checkOutDate) {
      return NextResponse.json(
        { error: 'Erro ao processar datas' },
        { status: 400 }
      )
    }

    // Verificar disponibilidade (usa datas normalizadas, horários aplicados internamente)
    const availableRooms = await getAvailableRooms(
      validation.checkInDate,
      validation.checkOutDate
    )

    // Converter JSON strings para arrays
    const parsedRooms = availableRooms.map(parseRoomData)

    return NextResponse.json(parsedRooms)
  } catch (error) {
    console.error('Error checking availability:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar disponibilidade' },
      { status: 500 }
    )
  }
}

