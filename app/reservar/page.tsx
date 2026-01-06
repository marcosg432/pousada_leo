'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import WhatsAppButton from '@/components/site/WhatsAppButton'
import { Calendar, Users, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { validateDates, formatISODate, getTodayNormalized, parseISODate } from '@/lib/date-helpers'
import { differenceInDays } from 'date-fns'
import { calculateReservationPrice, formatCurrency } from '@/lib/pricing'
import { validatePayment } from '@/lib/payment-helpers'
import { getCheckInOutMessage } from '@/lib/checkin-checkout'

interface Room {
  id: string
  number: string
  name: string
  description: string | null
  capacity: number
  price: number
  amenities: string[]
  images: string[]
}

export default function ReservarPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Dados do formulário
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestNotes, setGuestNotes] = useState('')

  // Quartos disponíveis
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [loadingRooms, setLoadingRooms] = useState(false)

  // Reserva criada
  const [reservationId, setReservationId] = useState<string | null>(null)
  const [reservationData, setReservationData] = useState<any>(null)
  
  // Dados de pagamento
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<string>('pix')
  const [processingPayment, setProcessingPayment] = useState(false)
  
  // Aceite das regras
  const [rulesAccepted, setRulesAccepted] = useState(false)

  // Data mínima para inputs (hoje)
  const minDate = formatISODate(getTodayNormalized())

  // Atualizar data mínima do check-out quando check-in mudar
  useEffect(() => {
    if (checkIn) {
      const checkInDate = new Date(checkIn + 'T00:00:00')
      const nextDay = new Date(checkInDate)
      nextDay.setDate(nextDay.getDate() + 1)
      
      // Se check-out for anterior ou igual ao check-in, ajustar
      if (checkOut) {
        const checkOutDate = new Date(checkOut + 'T00:00:00')
        if (checkOutDate <= checkInDate) {
          setCheckOut(formatISODate(nextDay))
        }
      }
    }
  }, [checkIn])

  const handleCheckAvailability = async () => {
    setError(null)

    // Validar datas
    const validation = validateDates(checkIn, checkOut)
    
    if (!validation.valid) {
      setError(validation.error || 'Erro ao validar datas')
      return
    }

    if (!validation.checkInDate || !validation.checkOutDate) {
      setError('Selecione datas válidas para verificar disponibilidade')
      return
    }

    setLoadingRooms(true)

    try {
      const checkInISO = formatISODate(validation.checkInDate)
      const checkOutISO = formatISODate(validation.checkOutDate)

      const response = await fetch(
        `/api/availability?checkIn=${checkInISO}&checkOut=${checkOutISO}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao verificar disponibilidade')
      }

      if (data.length === 0) {
        setError('Não há quartos disponíveis para o período selecionado')
        setAvailableRooms([])
      } else {
        setAvailableRooms(data)
        setStep(2)
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao verificar disponibilidade')
    } finally {
      setLoadingRooms(false)
    }
  }

  const handleSelectRoom = (room: Room) => {
    // Validar capacidade do quarto
    const totalPeople = adults + children
    if (totalPeople > room.capacity) {
      setError(`Este quarto acomoda no máximo ${room.capacity} pessoas. Você selecionou ${totalPeople} pessoas.`)
      return
    }
    
    setSelectedRoom(room)
    setStep(3)
  }

  const handleSubmitReservation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!guestName || !guestPhone) {
      setError('Nome e telefone são obrigatórios')
      return
    }

    if (!selectedRoom) {
      setError('Selecione um quarto')
      return
    }

    setLoading(true)
    setError(null)

    // Validar datas novamente antes de enviar
    const validation = validateDates(checkIn, checkOut)
    if (!validation.valid || !validation.checkInDate || !validation.checkOutDate) {
      setError(validation.error || 'Datas inválidas')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/reservations/site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkIn: formatISODate(validation.checkInDate),
          checkOut: formatISODate(validation.checkOutDate),
          adults,
          children,
          roomId: selectedRoom.id,
          guest: {
            name: guestName,
            phone: guestPhone,
            email: guestEmail || null,
            notes: guestNotes || null,
          },
          notes: guestNotes || null,
          rulesAccepted: rulesAccepted,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Mostrar mensagem de erro mais específica
        const errorMessage = data.error || 'Erro ao criar reserva'
        const details = data.details ? `\n\nDetalhes: ${data.details}` : ''
        throw new Error(errorMessage + details)
      }

      setReservationId(data.id)
      setReservationData(data)
      // Calcular valor mínimo sugerido (50% do total)
      const minimumPayment = data.totalPrice * 0.5
      setPaymentAmount(minimumPayment)
      setStep(4) // Ir para etapa de pagamento
    } catch (err: any) {
      setError(err.message || 'Erro ao criar reserva')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reservationId || !reservationData) {
      setError('Reserva não encontrada')
      return
    }

    // Validar pagamento
    const validation = validatePayment(
      paymentAmount,
      reservationData.totalPrice,
      reservationData.paidAmount || 0
    )

    if (!validation.valid) {
      setError(validation.error || 'Valor de pagamento inválido')
      return
    }

    setProcessingPayment(true)
    setError(null)

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservationId,
          amount: paymentAmount,
          method: paymentMethod,
          status: 'completed', // Assumindo que o pagamento é confirmado
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }

      // Atualizar dados da reserva
      setReservationData(data.reservation)
      setStep(5) // Ir para confirmação
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento')
    } finally {
      setProcessingPayment(false)
    }
  }

  const phone = process.env.NEXT_PUBLIC_WHATSAPP || '21964154637'
  const formattedPhone = phone.replace(/\D/g, '')

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden mt-20 bg-gradient-to-br from-primary to-primary-dark">
        <div className="relative z-10 text-center px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Fazer Reserva</h1>
          <p className="text-xl text-white/90">
            Escolha suas datas e encontre o quarto perfeito
          </p>
        </div>
      </section>

      {/* Formulário de Reserva */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step 1: Seleção de Datas */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Escolha suas datas
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                {getCheckInOutMessage()}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => {
                      setCheckIn(e.target.value)
                      setError(null)
                    }}
                    min={minDate}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => {
                      setCheckOut(e.target.value)
                      setError(null)
                    }}
                    min={
                      checkIn
                        ? formatISODate(
                            new Date(new Date(checkIn + 'T00:00:00').getTime() + 24 * 60 * 60 * 1000)
                          )
                        : minDate
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                    disabled={!checkIn}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="inline w-4 h-4 mr-2" />
                    Adultos
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={adults}
                    onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crianças
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={children}
                    onChange={(e) => setChildren(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckAvailability}
                disabled={loadingRooms || !checkIn || !checkOut}
                className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loadingRooms ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verificando disponibilidade...
                  </>
                ) : (
                  <>
                    Verificar Disponibilidade
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 2: Seleção de Quarto */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Quartos Disponíveis
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-primary hover:text-primary-dark font-medium"
                >
                  Alterar datas
                </button>
              </div>

              {availableRooms.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    Não há quartos disponíveis para o período selecionado
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="text-primary hover:text-primary-dark font-medium"
                  >
                    Tentar outras datas
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableRooms.map((room) => {
                    const checkInDate = parseISODate(checkIn)
                    const checkOutDate = parseISODate(checkOut)
                    const nights = checkInDate && checkOutDate 
                      ? differenceInDays(checkOutDate, checkInDate)
                      : 0
                    
                    // Calcular preços com nova lógica
                    const pricing = calculateReservationPrice(
                      room.price,
                      nights,
                      adults,
                      children
                    )

                    return (
                      <div
                        key={room.id}
                        className="border border-gray-200 rounded-lg p-6 hover:border-primary transition"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden">
                            {room.images && room.images.length > 0 ? (
                              <img
                                src={room.images[0]}
                                alt={room.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Sem imagem
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {room.name}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {room.description || 'Quarto confortável e acolhedor'}
                            </p>

                            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                              <span>Capacidade: {room.capacity} pessoas</span>
                              <span>•</span>
                              <span>{formatCurrency(room.price)}/noite</span>
                              <span>•</span>
                              <span className="font-semibold text-primary">
                                {nights} {nights === 1 ? 'noite' : 'noites'}
                              </span>
                            </div>

                            {/* Aviso se exceder capacidade */}
                            {adults + children > room.capacity && (
                              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                ⚠️ Este quarto acomoda no máximo {room.capacity} pessoas. Você selecionou {adults + children} pessoas.
                              </div>
                            )}

                            {/* Detalhamento de preços */}
                            <div className="mb-4 p-4 bg-gray-50 rounded-lg text-sm">
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    {nights} {nights === 1 ? 'diária' : 'diárias'} (até 2 pessoas)
                                  </span>
                                  <span className="font-medium">{formatCurrency(pricing.basePrice)}</span>
                                </div>
                                {pricing.extraPrice > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Pessoas extras ({adults + children - 2} × R$ 50,00 × {nights} {nights === 1 ? 'dia' : 'dias'})
                                    </span>
                                    <span className="font-medium">{formatCurrency(pricing.extraPrice)}</span>
                                  </div>
                                )}
                                <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
                                  <span className="font-semibold text-gray-900">Total</span>
                                  <span className="font-bold text-primary text-lg">{formatCurrency(pricing.totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Valor para confirmação (50%)</span>
                                  <span>{formatCurrency(pricing.totalPrice * 0.5)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-primary">
                                  {formatCurrency(pricing.totalPrice)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Confirmação: {formatCurrency(pricing.totalPrice * 0.5)}
                                </p>
                              </div>
                              <button
                                onClick={() => handleSelectRoom(room)}
                                disabled={adults + children > room.capacity}
                                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {adults + children > room.capacity 
                                  ? `Capacidade máxima: ${room.capacity} pessoas`
                                  : 'Reservar este quarto'
                                }
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Dados do Hóspede */}
          {step === 3 && selectedRoom && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-6">
                <button
                  onClick={() => setStep(2)}
                  className="text-primary hover:text-primary-dark font-medium mb-4"
                >
                  ← Voltar para seleção de quartos
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                  Seus Dados
                </h2>
                <p className="text-gray-600 mt-2">
                  Preencha seus dados para finalizar a reserva
                </p>
              </div>

              <form onSubmit={handleSubmitReservation} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea
                    value={guestNotes}
                    onChange={(e) => setGuestNotes(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Alguma observação especial?"
                  />
                </div>

                {/* Resumo das Regras */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">📋 Regras e Políticas da Hospedagem</h3>
                  <ul className="text-sm text-gray-700 space-y-1 mb-3 list-disc list-inside">
                    <li>Check-in a partir das 14h | Check-out até 12h</li>
                    <li>Pagamento de 50% no momento da reserva</li>
                    <li>Restante do pagamento no check-in</li>
                    <li>Cancelamento gratuito no mesmo dia</li>
                    <li>Reembolso apenas com 7 dias de antecedência</li>
                  </ul>
                  <a
                    href="/regras"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-dark text-sm font-medium underline"
                  >
                    Ler regras completas →
                  </a>
                </div>

                {/* Checkbox de aceite */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="rulesAccepted"
                    checked={rulesAccepted}
                    onChange={(e) => {
                      setRulesAccepted(e.target.checked)
                      setError(null)
                    }}
                    required
                    className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="rulesAccepted" className="text-sm text-gray-700 cursor-pointer">
                    <span className="text-red-500">*</span> Li e concordo com as{' '}
                    <a
                      href="/regras"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary-dark font-medium underline"
                    >
                      Regras e Políticas da Hospedagem
                    </a>
                  </label>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !rulesAccepted}
                  className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando reserva...
                    </>
                  ) : (
                    <>
                      Confirmar Reserva
                      <CheckCircle size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 4: Pagamento */}
          {step === 4 && reservationData && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-6">
                <button
                  onClick={() => setStep(3)}
                  className="text-primary hover:text-primary-dark font-medium mb-4"
                >
                  ← Voltar
                </button>
                <h2 className="text-2xl font-bold text-gray-900">
                  Pagamento Inicial
                </h2>
                <p className="text-gray-600 mt-2">
                  Para confirmar sua reserva, é necessário pagar no mínimo 50% do valor total
                </p>
              </div>

              {/* Resumo da Reserva */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Resumo da Reserva</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quarto:</span>
                    <span className="font-medium">{reservationData.room.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">
                      {new Date(reservationData.checkIn).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">
                      {new Date(reservationData.checkOut).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Valor Total:</span>
                    <span className="text-primary">
                      {formatCurrency(reservationData.totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm pt-1">
                    <span className="text-gray-600">Valor Mínimo (50%):</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(reservationData.minimumPayment || reservationData.totalPrice * 0.5)}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor do Pagamento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={reservationData.minimumPayment || reservationData.totalPrice * 0.5}
                    max={reservationData.totalPrice}
                    value={paymentAmount}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      setPaymentAmount(value)
                      setError(null)
                    }}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mínimo: {formatCurrency(reservationData.minimumPayment || reservationData.totalPrice * 0.5)} | 
                    Máximo: {formatCurrency(reservationData.totalPrice)}
                  </p>
                  {paymentAmount > 0 && paymentAmount < (reservationData.minimumPayment || reservationData.totalPrice * 0.5) && (
                    <p className="text-sm text-red-600 mt-1">
                      ⚠️ Para confirmar a reserva, é necessário pagar no mínimo 50% do valor total.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forma de Pagamento <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="pix">PIX</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="debit_card">Cartão de Débito</option>
                    <option value="bank_transfer">Transferência Bancária</option>
                    <option value="boleto">Boleto</option>
                    <option value="cash">Dinheiro</option>
                  </select>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={processingPayment || paymentAmount < (reservationData.minimumPayment || reservationData.totalPrice * 0.5)}
                  className="w-full bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processingPayment ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processando pagamento...
                    </>
                  ) : (
                    <>
                      Confirmar Pagamento
                      <CheckCircle size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 5: Confirmação */}
          {step === 5 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {reservationData?.status === 'confirmed' 
                  ? 'Reserva Confirmada!' 
                  : 'Reserva Criada com Sucesso!'}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {reservationData?.status === 'confirmed'
                  ? 'Sua reserva foi confirmada. Aguardamos você no check-in!'
                  : 'Sua solicitação de reserva foi recebida. Complete o pagamento mínimo para confirmação.'}
              </p>
              {reservationData && (
                <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor Total:</span>
                      <span className="font-semibold">{formatCurrency(reservationData.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor Pago:</span>
                      <span className="font-semibold text-green-600">
                        {formatCurrency(reservationData.paidAmount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor Restante:</span>
                      <span className="font-semibold">
                        {formatCurrency(reservationData.remainingAmount || reservationData.totalPrice)}
                      </span>
                    </div>
                    {reservationData.paidPercentage > 0 && (
                      <div className="flex justify-between pt-2 border-t">
                        <span className="text-gray-600">Percentual Pago:</span>
                        <span className="font-semibold">{reservationData.paidPercentage.toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <p className="text-sm text-gray-500 mb-8">
                ID da reserva: {reservationId}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={`https://wa.me/${formattedPhone}?text=Olá! Acabei de fazer uma reserva (ID: ${reservationId}). Gostaria de confirmar os detalhes.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition inline-flex items-center justify-center gap-2"
                >
                  Falar no WhatsApp
                </a>
                <button
                  onClick={() => {
                    setStep(1)
                    setReservationId(null)
                    setSelectedRoom(null)
                    setGuestName('')
                    setGuestPhone('')
                    setGuestEmail('')
                    setGuestNotes('')
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-lg font-semibold transition"
                >
                  Fazer Nova Reserva
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}

