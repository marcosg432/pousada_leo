import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isRoomAvailable } from '@/lib/availability'
import { validateDates } from '@/lib/date-helpers'
import { differenceInDays, startOfDay } from 'date-fns'
import { calculateReservationPrice } from '@/lib/pricing'
import { applyCheckInTime, applyCheckOutTime } from '@/lib/checkin-checkout'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validações básicas
    if (!data.checkIn || !data.checkOut || !data.roomId || !data.guest) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    if (!data.guest.name || !data.guest.phone) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar aceite das regras
    if (!data.rulesAccepted) {
      return NextResponse.json(
        { error: 'É necessário aceitar as Regras e Políticas da Hospedagem para fazer a reserva' },
        { status: 400 }
      )
    }

    // Validar datas usando helper
    const validation = validateDates(data.checkIn, data.checkOut)

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

    // Aplicar horários de check-in/check-out
    const checkIn = applyCheckInTime(validation.checkInDate)
    const checkOut = applyCheckOutTime(validation.checkOutDate)

    // Verificar disponibilidade
    const available = await isRoomAvailable(data.roomId, checkIn, checkOut)
    if (!available) {
      return NextResponse.json(
        { error: 'Quarto não está disponível para o período selecionado' },
        { status: 400 }
      )
    }

    // Buscar quarto para calcular preço
    const room = await prisma.room.findUnique({
      where: { id: data.roomId },
    })

    if (!room) {
      return NextResponse.json(
        { error: 'Quarto não encontrado' },
        { status: 404 }
      )
    }

    // Validar capacidade do quarto
    const adults = data.adults || 2
    const children = data.children || 0
    const childrenAges: number[] = data.childrenAges || []
    
    // Validar se o número de idades corresponde ao número de crianças
    if (children > 0 && childrenAges.length > 0 && childrenAges.length !== children) {
      return NextResponse.json(
        { error: 'O número de idades informadas não corresponde ao número de crianças' },
        { status: 400 }
      )
    }
    
    const totalPeople = adults + children
    
    if (totalPeople > room.capacity) {
      return NextResponse.json(
        { error: `Este quarto acomoda no máximo ${room.capacity} pessoas. Você selecionou ${totalPeople} pessoas.` },
        { status: 400 }
      )
    }

    // Calcular número de noites corretamente
    // Para hospedagem: check-in 08/01 e check-out 11/01 = 3 noites
    // Usar startOfDay para garantir cálculo correto baseado apenas nas datas
    const checkInDay = startOfDay(checkIn)
    const checkOutDay = startOfDay(checkOut)
    const nights = differenceInDays(checkOutDay, checkInDay)
    
    if (nights <= 0) {
      return NextResponse.json(
        { error: 'O check-out deve ser posterior ao check-in' },
        { status: 400 }
      )
    }
    
    // Calcular preços com nova lógica (base + extras)
    // Considera idades das crianças: crianças até 5 anos não pagam
    const pricing = calculateReservationPrice(
      room.price,
      nights,
      adults,
      children,
      50,
      childrenAges
    )

    if (pricing.totalPrice <= 0) {
      return NextResponse.json(
        { error: 'Erro ao calcular o preço da reserva. Verifique os dados do quarto.' },
        { status: 500 }
      )
    }

    // Criar ou buscar hóspede
    let guest = await prisma.guest.findFirst({
      where: {
        phone: data.guest.phone,
      },
    })

    if (!guest) {
      guest = await prisma.guest.create({
        data: {
          name: data.guest.name,
          phone: data.guest.phone,
          email: data.guest.email || null,
          notes: data.guest.notes || null,
        },
      })
    } else {
      // Atualizar dados do hóspede se necessário
      guest = await prisma.guest.update({
        where: { id: guest.id },
        data: {
          name: data.guest.name,
          email: data.guest.email || guest.email,
          notes: data.guest.notes || guest.notes,
        },
      })
    }

    // Calcular valores de pagamento
    const minimumPayment = pricing.totalPrice * 0.5

    // Preparar dados da reserva
    const reservationData = {
      checkIn: checkIn,
      checkOut: checkOut,
      adults: adults,
      children: children,
      status: 'pending_payment' as const,
      totalPrice: pricing.totalPrice,
      basePrice: pricing.basePrice,
      extraPrice: pricing.extraPrice || 0,
      minimumPayment: minimumPayment,
      paidAmount: 0,
      paidPercentage: 0,
      remainingAmount: pricing.totalPrice,
      notes: data.notes || null,
      source: 'site' as const,
      rulesAcceptedAt: data.rulesAccepted ? new Date() : null,
      roomId: data.roomId,
      guestId: guest.id,
    }

    // Log para debug (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      console.log('Creating reservation with data:', {
        ...reservationData,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      })
    }

    // Criar reserva (usar datas com horários aplicados)
    console.log('📝 Criando reserva com dados:', {
      ...reservationData,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
    })
    
    const reservation = await prisma.reservation.create({
      data: reservationData,
      include: {
        room: {
          select: {
            id: true,
            number: true,
            name: true,
          },
        },
        guest: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    })

    console.log('✅ Reserva criada com sucesso:', {
      id: reservation.id,
      status: reservation.status,
      source: reservation.source,
      totalPrice: reservation.totalPrice,
      guest: reservation.guest.name,
      room: reservation.room.name,
    })

    // Disparar mensagem de reserva criada (aguardando pagamento)
    try {
      const { onReservationCreated } = await import('@/lib/message-service')
      await onReservationCreated(reservation.id)
    } catch (error) {
      console.error('Erro ao enviar mensagem de reserva criada:', error)
      // Não falha a criação da reserva se o envio de mensagem falhar
    }

    // Formatar resposta para garantir compatibilidade
    const responseData = {
      ...reservation,
      checkIn: reservation.checkIn instanceof Date ? reservation.checkIn.toISOString() : reservation.checkIn,
      checkOut: reservation.checkOut instanceof Date ? reservation.checkOut.toISOString() : reservation.checkOut,
      createdAt: reservation.createdAt instanceof Date ? reservation.createdAt.toISOString() : reservation.createdAt,
      updatedAt: reservation.updatedAt instanceof Date ? reservation.updatedAt.toISOString() : reservation.updatedAt,
      rulesAcceptedAt: reservation.rulesAcceptedAt instanceof Date ? reservation.rulesAcceptedAt.toISOString() : reservation.rulesAcceptedAt,
    }

    return NextResponse.json(responseData, { status: 201 })
  } catch (error: any) {
    console.error('Error creating reservation:', error)
    
    // Retornar mensagem de erro mais específica
    let errorMessage = 'Erro ao criar reserva'
    
    if (error.code === 'P2002') {
      errorMessage = 'Já existe uma reserva com esses dados'
    } else if (error.code === 'P2003') {
      errorMessage = 'Quarto ou hóspede não encontrado'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

