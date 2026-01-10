import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Buscando reservas...')
    
    const reservations = await prisma.reservation.findMany({
      include: {
        room: true,
        guest: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log(`✅ Encontradas ${reservations.length} reservas`)
    
    // Log para debug - mostrar reservas do site
    const siteReservations = reservations.filter(r => r.source === 'site')
    console.log(`📊 Reservas do site: ${siteReservations.length}`)
    if (siteReservations.length > 0) {
      console.log('Primeira reserva do site:', {
        id: siteReservations[0].id,
        status: siteReservations[0].status,
        source: siteReservations[0].source,
        room: siteReservations[0].room?.name || 'null',
        guest: siteReservations[0].guest?.name || 'null',
      })
    }
    
    // Formatar resposta convertendo datas para ISO string e selecionando campos necessários
    const formattedReservations = reservations.map(reservation => {
      // Verificar se relacionamentos existem
      const hasRoom = reservation.room !== null && reservation.room !== undefined
      const hasGuest = reservation.guest !== null && reservation.guest !== undefined
      
      return {
        id: reservation.id,
        checkIn: reservation.checkIn instanceof Date ? reservation.checkIn.toISOString() : String(reservation.checkIn),
        checkOut: reservation.checkOut instanceof Date ? reservation.checkOut.toISOString() : String(reservation.checkOut),
        status: reservation.status,
        totalPrice: reservation.totalPrice,
        basePrice: reservation.basePrice,
        extraPrice: reservation.extraPrice,
        paidAmount: reservation.paidAmount,
        paidPercentage: reservation.paidPercentage,
        remainingAmount: reservation.remainingAmount,
        minimumPayment: reservation.minimumPayment,
        source: reservation.source || 'admin',
        createdAt: reservation.createdAt instanceof Date ? reservation.createdAt.toISOString() : String(reservation.createdAt),
        room: hasRoom ? {
          id: reservation.room.id,
          number: reservation.room.number,
          name: reservation.room.name,
        } : null,
        guest: hasGuest ? {
          id: reservation.guest.id,
          name: reservation.guest.name,
          email: reservation.guest.email,
          phone: reservation.guest.phone,
        } : null,
      }
    })
    
    return NextResponse.json(formattedReservations)
  } catch (error: any) {
    console.error('❌ Error fetching reservations:', error)
    console.error('Detalhes:', error.message, error.stack)
    return NextResponse.json(
      { error: 'Erro ao buscar reservas', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const totalPrice = data.totalPrice || (data.basePrice || 0) + (data.extraPrice || 0)
    const minimumPayment = totalPrice * 0.5
    const initialStatus = data.status || 'pending_payment'

    // Se criar como confirmada pelo admin, pode ter pagamento inicial
    const paidAmount = data.paidAmount || 0
    const paidPercentage = totalPrice > 0 ? (paidAmount / totalPrice) * 100 : 0
    const remainingAmount = totalPrice - paidAmount

    // Validar se status confirmado requer pagamento mínimo
    if (initialStatus === 'confirmed' && paidAmount < minimumPayment) {
      return NextResponse.json(
        {
          error: `Para confirmar a reserva, é necessário pagar no mínimo ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(minimumPayment)}`,
        },
        { status: 400 }
      )
    }

    const reservation = await prisma.reservation.create({
      data: {
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        adults: data.adults || 2,
        children: data.children || 0,
        status: initialStatus,
        totalPrice: totalPrice,
        basePrice: data.basePrice || totalPrice,
        extraPrice: data.extraPrice || 0,
        minimumPayment: minimumPayment,
        paidAmount: paidAmount,
        paidPercentage: Math.round(paidPercentage * 100) / 100,
        remainingAmount: remainingAmount,
        notes: data.notes || null,
        source: data.source || 'admin',
        rulesAcceptedAt: data.rulesAccepted ? new Date() : (data.source === 'admin' ? null : undefined),
        roomId: data.roomId,
        guestId: data.guestId,
      },
      include: {
        room: true,
        guest: true,
      },
    })

    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json(
      { error: 'Erro ao criar reserva' },
      { status: 500 }
    )
  }
}

