'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { ArrowLeft, Calendar, User, Home, DollarSign, FileText, CreditCard, Mail, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'
import { getStatusColor, getStatusLabel } from '@/lib/reservation-helpers'
import Link from 'next/link'

interface Reservation {
  id: string
  checkIn: string
  checkOut: string
  adults: number
  children: number
  status: string
  totalPrice: number
  basePrice: number
  extraPrice: number
  paidAmount?: number
  paidPercentage?: number
  remainingAmount?: number
  minimumPayment?: number
  notes: string | null
  source: string
  cancelledAt: string | null
  cancelledReason: string | null
  rulesAcceptedAt?: string | null
  createdAt: string
  room: {
    id: string
    number: string
    name: string
  }
  guest: {
    id: string
    name: string
    email: string | null
    phone: string
  }
  payments: Array<{
    id: string
    amount: number
    method: string
    status: string
    paidAt: string | null
  }>
  messages?: Array<{
    id: string
    type: string
    channel: string
    status: string
    recipient: string
    subject: string | null
    content: string
    errorMessage?: string | null
    sentAt: string
  }>
}

export default function ReservationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [cancelledReason, setCancelledReason] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState<string>('pix')
  const [processingPayment, setProcessingPayment] = useState(false)
  const [resendingMessage, setResendingMessage] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchReservation()
    }
  }, [params.id])

  const fetchReservation = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reservations/${params.id}`)
      if (!response.ok) throw new Error('Erro ao carregar reserva')
      const data = await response.json()
      setReservation(data)
    } catch (err) {
      setError('Erro ao carregar reserva')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async () => {
    if (!reservation || !newStatus) return

    try {
      setUpdating(true)
      const response = await fetch(`/api/reservations/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          cancelledReason: newStatus === 'cancelled' ? cancelledReason : null,
        }),
      })

      if (!response.ok) throw new Error('Erro ao atualizar status')

      const updatedReservation = await response.json()
      setReservation(updatedReservation)
      setShowStatusModal(false)
      setNewStatus('')
      setCancelledReason('')
    } catch (err) {
      alert('Erro ao atualizar status da reserva')
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  const handleResendMessage = async (messageType: string) => {
    if (!reservation) return

    try {
      setResendingMessage(messageType)
      const response = await fetch(`/api/messages/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: messageType,
          channel: 'email',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao reenviar mensagem')
      }

      // Recarregar reserva para atualizar histórico
      await fetchReservation()
    } catch (err: any) {
      alert(err.message || 'Erro ao reenviar mensagem')
    } finally {
      setResendingMessage(null)
    }
  }

  const openStatusModal = (status: string) => {
    setNewStatus(status)
    setShowStatusModal(true)
    if (status === 'cancelled' && reservation?.cancelledReason) {
      setCancelledReason(reservation.cancelledReason)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Carregando reserva...</p>
        </div>
      </div>
    )
  }

  if (error || !reservation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Reserva não encontrada'}</p>
          <Link
            href="/admin/reservas"
            className="text-primary hover:text-primary-dark font-medium"
          >
            Voltar para reservas
          </Link>
        </div>
      </div>
    )
  }

  const totalPaid = reservation.paidAmount || reservation.payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const remaining = reservation.remainingAmount !== undefined 
    ? reservation.remainingAmount 
    : reservation.totalPrice - totalPaid

  const paidPercentage = reservation.paidPercentage !== undefined
    ? reservation.paidPercentage
    : reservation.totalPrice > 0 ? (totalPaid / reservation.totalPrice) * 100 : 0

  const minimumPayment = reservation.minimumPayment || reservation.totalPrice * 0.5

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reservation || !paymentAmount || paymentAmount <= 0) return

    try {
      setProcessingPayment(true)
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationId: reservation.id,
          amount: paymentAmount,
          method: paymentMethod,
          status: 'completed',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Erro ao registrar pagamento')
        return
      }

      const data = await response.json()
      setReservation(data.reservation)
      setShowPaymentModal(false)
      setPaymentAmount(0)
      setPaymentMethod('pix')
    } catch (err) {
      alert('Erro ao registrar pagamento')
      console.error(err)
    } finally {
      setProcessingPayment(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/reservas"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalhes da Reserva</h1>
            <p className="text-gray-600">ID: {reservation.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(
              reservation.status
            )}`}
          >
            {getStatusLabel(reservation.status)}
          </span>
        </div>
      </div>

      {/* Status Actions */}
      {reservation.status !== 'cancelled' && reservation.status !== 'checked_out' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Alterar Status</h2>
          <div className="flex flex-wrap gap-3">
            {reservation.status === 'pending' && (
              <>
                <button
                  onClick={() => openStatusModal('confirmed')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Confirmar Reserva
                </button>
                <button
                  onClick={() => openStatusModal('cancelled')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Cancelar Reserva
                </button>
              </>
            )}
            {reservation.status === 'pending_payment' && (
              <>
                <button
                  onClick={() => openStatusModal('cancelled')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Cancelar Reserva
                </button>
              </>
            )}
            {reservation.status === 'confirmed' && (
              <>
                <button
                  onClick={() => openStatusModal('checked_in')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Fazer Check-in
                </button>
                <button
                  onClick={() => openStatusModal('cancelled')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Cancelar Reserva
                </button>
              </>
            )}
            {reservation.status === 'checked_in' && (
              <button
                onClick={() => openStatusModal('checked_out')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Fazer Check-out
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guest Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">Hóspede</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="text-base font-medium text-gray-900">{reservation.guest.name}</p>
            </div>
            {reservation.guest.email && (
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base text-gray-900">{reservation.guest.email}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Telefone</p>
              <p className="text-base text-gray-900">{reservation.guest.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Origem</p>
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                {reservation.source === 'site' ? 'Site' : 'Admin'}
              </span>
            </div>
          </div>
        </div>

        {/* Room Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Home className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">Quarto</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Número</p>
              <p className="text-base font-medium text-gray-900">Quarto {reservation.room.number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nome</p>
              <p className="text-base text-gray-900">{reservation.room.name}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">Datas</h2>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Check-in</p>
              <p className="text-base font-medium text-gray-900">
                {format(new Date(reservation.checkIn), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-out</p>
              <p className="text-base font-medium text-gray-900">
                {format(new Date(reservation.checkOut), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hóspedes</p>
              <p className="text-base text-gray-900">
                {reservation.adults} adulto(s) e {reservation.children} criança(s)
              </p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">Valores</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Preço base</p>
              <p className="text-base font-medium text-gray-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(reservation.basePrice)}
              </p>
            </div>
            {reservation.extraPrice > 0 && (
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Pessoas extras</p>
                <p className="text-base font-medium text-gray-900">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(reservation.extraPrice)}
                </p>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between">
              <p className="text-base font-semibold text-gray-900">Total</p>
              <p className="text-lg font-bold text-primary">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(reservation.totalPrice)}
              </p>
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Valor Mínimo (50%)</p>
                <p className="text-sm font-medium text-orange-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(minimumPayment)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Valor Pago</p>
                <p className="text-sm font-semibold text-green-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(totalPaid)}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Percentual Pago</p>
                <p className="text-sm font-semibold">
                  {paidPercentage.toFixed(1)}%
                </p>
              </div>
              {remaining > 0 && (
                <div className="flex justify-between">
                  <p className="text-sm text-gray-500">Valor Restante</p>
                  <p className="text-sm font-semibold text-red-600">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(remaining)}
                  </p>
                </div>
              )}
            </div>
            {reservation.status === 'pending_payment' && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    setPaymentAmount(Math.max(0, remaining))
                    setShowPaymentModal(true)
                  }}
                  className="w-full bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition"
                >
                  Registrar Pagamento
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payments */}
      {reservation.payments.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">Pagamentos</h2>
          </div>
          <div className="space-y-3">
            {reservation.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(payment.amount)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {payment.method} • {payment.status === 'completed' ? 'Pago' : 'Pendente'}
                    {payment.paidAt && ` em ${format(new Date(payment.paidAt), 'dd/MM/yyyy', { locale: ptBR })}`}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    payment.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {payment.status === 'completed' ? 'Pago' : 'Pendente'}
                </span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between">
              <p className="text-sm text-gray-500">Total pago</p>
              <p className="text-base font-semibold text-gray-900">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(totalPaid)}
              </p>
            </div>
            {remaining > 0 && (
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Restante</p>
                <p className="text-base font-semibold text-red-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(remaining)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {reservation.notes && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">Observações</h2>
          </div>
          <p className="text-gray-700 whitespace-pre-wrap">{reservation.notes}</p>
        </div>
      )}

      {/* Rules Acceptance */}
      {reservation.source === 'site' && (
        <div className={`rounded-xl shadow-md p-6 ${
          reservation.rulesAcceptedAt 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <FileText className={`w-5 h-5 ${reservation.rulesAcceptedAt ? 'text-green-600' : 'text-yellow-600'}`} />
            <h2 className="text-lg font-semibold text-gray-900">Aceite das Regras</h2>
          </div>
          {reservation.rulesAcceptedAt ? (
            <div>
              <p className="text-sm text-gray-700 mb-2">
                ✅ Hóspede aceitou as Regras e Políticas da Hospedagem
              </p>
              <p className="text-xs text-gray-600">
                Aceito em: {format(new Date(reservation.rulesAcceptedAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
          ) : (
            <p className="text-sm text-yellow-700">
              ⚠️ Hóspede não aceitou as regras (reserva criada pelo admin)
            </p>
          )}
        </div>
      )}

      {/* Message History */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">Histórico de Mensagens</h2>
          </div>
        </div>

        {reservation.messages && reservation.messages.length > 0 ? (
          <div className="space-y-3">
            {reservation.messages.map((message) => (
              <div
                key={message.id}
                className={`border rounded-lg p-4 ${
                  message.status === 'sent'
                    ? 'bg-green-50 border-green-200'
                    : message.status === 'failed'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {message.status === 'sent' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : message.status === 'failed' ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900">
                      {message.type === 'reservation_created' && 'Reserva Criada'}
                      {message.type === 'payment_confirmed' && 'Pagamento Confirmado'}
                      {message.type === 'reservation_confirmed' && 'Reserva Confirmada'}
                      {message.type === 'checkin_reminder' && 'Lembrete Check-in'}
                      {message.type === 'checkin_completed' && 'Check-in Realizado'}
                      {message.type === 'reservation_cancelled' && 'Reserva Cancelada'}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({message.channel === 'email' ? 'E-mail' : 'WhatsApp'})
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(message.sentAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                {message.subject && (
                  <p className="text-sm font-medium text-gray-700 mb-1">{message.subject}</p>
                )}
                <p className="text-xs text-gray-600 whitespace-pre-wrap line-clamp-3">
                  {message.content}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  Para: {message.recipient}
                </div>
                {message.status === 'failed' && (
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-xs text-red-600">
                      Erro: {message.errorMessage || 'Erro desconhecido'}
                    </div>
                    <button
                      onClick={() => handleResendMessage(message.type)}
                      disabled={resendingMessage === message.id}
                      className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1 disabled:opacity-50"
                    >
                      {resendingMessage === message.id ? (
                        <>
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3" />
                          Reenviar
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            Nenhuma mensagem enviada ainda
          </p>
        )}
      </div>

      {/* Cancellation Info */}
      {reservation.status === 'cancelled' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-red-900 mb-2">Reserva Cancelada</h2>
          {reservation.cancelledAt && (
            <p className="text-sm text-red-700 mb-2">
              Cancelada em: {format(new Date(reservation.cancelledAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
          )}
          {reservation.cancelledReason && (
            <div>
              <p className="text-sm font-medium text-red-900 mb-1">Motivo:</p>
              <p className="text-sm text-red-700">{reservation.cancelledReason}</p>
            </div>
          )}
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowStatusModal(false)
            setNewStatus('')
            setCancelledReason('')
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {newStatus === 'cancelled' ? 'Cancelar Reserva' : 'Alterar Status'}
            </h3>
            {newStatus === 'cancelled' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo do cancelamento (opcional)
                  </label>
                  <textarea
                    value={cancelledReason}
                    onChange={(e) => setCancelledReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={4}
                    placeholder="Digite o motivo do cancelamento..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowStatusModal(false)
                      setNewStatus('')
                      setCancelledReason('')
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleStatusChange}
                    disabled={updating}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
                  >
                    {updating ? 'Cancelando...' : 'Confirmar Cancelamento'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-700">
                  Tem certeza que deseja alterar o status da reserva para{' '}
                  <strong>{getStatusLabel(newStatus)}</strong>?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowStatusModal(false)
                      setNewStatus('')
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleStatusChange}
                    disabled={updating}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium disabled:opacity-50"
                  >
                    {updating ? 'Atualizando...' : 'Confirmar'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && reservation && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowPaymentModal(false)
            setPaymentAmount(0)
          }}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Registrar Pagamento</h3>
            <form onSubmit={handleAddPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor do Pagamento *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  max={remaining}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Restante: {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(remaining)}
                </p>
                {paymentAmount > 0 && paymentAmount < minimumPayment - totalPaid && (
                  <p className="text-sm text-orange-600 mt-1">
                    ⚠️ Para confirmar a reserva, é necessário pagar no mínimo {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(minimumPayment)}. Faltam {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(minimumPayment - totalPaid)}.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Forma de Pagamento *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="pix">PIX</option>
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="debit_card">Cartão de Débito</option>
                  <option value="bank_transfer">Transferência Bancária</option>
                  <option value="boleto">Boleto</option>
                  <option value="cash">Dinheiro</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false)
                    setPaymentAmount(0)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={processingPayment || paymentAmount <= 0 || paymentAmount > remaining}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium disabled:opacity-50"
                >
                  {processingPayment ? 'Registrando...' : 'Registrar Pagamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

