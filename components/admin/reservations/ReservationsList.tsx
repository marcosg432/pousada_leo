'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Search, Filter, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getStatusColor, getStatusLabel } from '@/lib/reservation-helpers'

interface Reservation {
  id: string
  guest: {
    name: string
  } | null
  room: {
    number: string
  } | null
  checkIn: string
  checkOut: string
  status: string
  totalPrice: number
  paidAmount?: number
  paidPercentage?: number
  remainingAmount?: number
  minimumPayment?: number
  source?: string
  createdAt: string
}

export default function ReservationsList() {
  const [search, setSearch] = useState('')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/reservations')
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
        console.error('Erro na resposta:', response.status, errorData)
        throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Reservas recebidas:', data.length, data)
      setReservations(data)
    } catch (err: any) {
      console.error('Erro ao carregar reservas:', err)
      setError(err.message || 'Erro ao carregar reservas')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, guestName: string, roomNumber: string) => {
    if (
      !confirm(
        `Tem certeza que deseja deletar a reserva de ${guestName} no Quarto ${roomNumber}?\n\nEsta ação não pode ser desfeita.`
      )
    ) {
      return
    }

    try {
      setDeletingId(id)
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || 'Erro ao deletar reserva')
        return
      }

      // Atualizar lista
      await fetchReservations()
    } catch (err) {
      alert('Erro ao deletar reserva')
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredReservations = reservations.filter((reservation) => {
    if (!reservation.guest || !reservation.room) {
      // Se algum relacionamento estiver quebrado, ainda mostrar a reserva
      return true
    }
    return (
      reservation.guest.name.toLowerCase().includes(search.toLowerCase()) ||
      reservation.room.number.toLowerCase().includes(search.toLowerCase())
    )
  })

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Carregando reservas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchReservations}
            className="text-primary hover:text-primary-dark font-medium"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 md:p-6 border-b">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
            <input
              type="text"
              placeholder="Buscar reservas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 md:pl-10 pr-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button 
            onClick={fetchReservations}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm md:text-base"
            title="Atualizar lista de reservas"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Atualizar</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm md:text-base">
            <Filter className="w-4 h-4 md:w-5 md:h-5" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="p-12 text-center">
          <p className="text-gray-500 mb-4">
            {search ? 'Nenhuma reserva encontrada' : 'Nenhuma reserva cadastrada'}
          </p>
          {!search && (
            <div className="space-y-2">
              <Link
                href="/admin/reservas/nova"
                className="inline-block text-primary hover:text-primary-dark font-medium mr-4"
              >
                Criar primeira reserva →
              </Link>
              <button
                onClick={fetchReservations}
                className="inline-block text-gray-600 hover:text-gray-800 font-medium border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Atualizar lista
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hóspede
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Quarto
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Check-in
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Check-out
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Valor Total
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Pagamento
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
              {filteredReservations.map((reservation) => {
                // Verificar se é uma nova reserva do site (últimos 7 dias)
                const createdAt = new Date(reservation.createdAt)
                const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                const isNewSiteReservation =
                  reservation.source === 'site' &&
                  (reservation.status === 'pending' || reservation.status === 'pending_payment' || reservation.status === 'confirmed') &&
                  createdAt > sevenDaysAgo

                return (
                  <tr
                    key={reservation.id}
                    className={`hover:bg-gray-50 ${
                      isNewSiteReservation ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                    }`}
                  >
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-xs md:text-sm font-medium text-gray-900">
                            {reservation.guest?.name || 'Hóspede não encontrado'}
                          </div>
                          {isNewSiteReservation && (
                            <span className="px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">
                              NOVO
                            </span>
                          )}
                          {reservation.source === 'site' && (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                              SITE
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          {reservation.room ? `Quarto ${reservation.room.number}` : 'Quarto não encontrado'} • {format(new Date(reservation.checkIn), 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                      </div>
                    </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-xs md:text-sm text-gray-900">
                      {reservation.room ? `Quarto ${reservation.room.number}` : 'Quarto não encontrado'}
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-xs md:text-sm text-gray-900">
                      {format(new Date(reservation.checkIn), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-xs md:text-sm text-gray-900">
                      {format(new Date(reservation.checkOut), 'dd/MM/yyyy', { locale: ptBR })}
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-xs md:text-sm font-semibold text-gray-900">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(reservation.totalPrice)}
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap hidden xl:table-cell">
                    <div className="text-xs md:text-sm">
                      <div className="font-medium text-gray-900">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(reservation.paidAmount || 0)}
                      </div>
                      {reservation.paidPercentage !== undefined && reservation.paidPercentage > 0 && (
                        <div className="text-xs text-gray-500">
                          {reservation.paidPercentage.toFixed(1)}% pago
                        </div>
                      )}
                      {reservation.remainingAmount !== undefined && reservation.remainingAmount > 0 && (
                        <div className="text-xs text-orange-600">
                          Restante: {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(reservation.remainingAmount)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        reservation.status
                      )}`}
                    >
                      {getStatusLabel(reservation.status)}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/reservas/${reservation.id}`}
                        className="text-primary hover:text-primary-dark"
                      >
                        <span className="hidden sm:inline">Ver detalhes</span>
                        <span className="sm:hidden">Ver</span>
                      </Link>
                      <button
                        onClick={() =>
                          handleDelete(
                            reservation.id,
                            reservation.guest?.name || 'Hóspede desconhecido',
                            reservation.room?.number || 'N/A'
                          )
                        }
                        disabled={deletingId === reservation.id}
                        className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                        title="Deletar reserva"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

