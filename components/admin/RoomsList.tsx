'use client'

import { Search, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function RoomsList() {
  const [search, setSearch] = useState('')

  // Dados mockados - em produção viriam da API
  const rooms = [
    {
      id: '1',
      number: '101',
      name: 'Suíte 1',
      capacity: 5,
      price: 200,
      status: 'available',
    },
    {
      id: '2',
      number: '102',
      name: 'Suíte 2',
      capacity: 6,
      price: 200,
      status: 'available',
    },
    {
      id: '3',
      number: '205',
      name: 'Suíte 3',
      capacity: 5,
      price: 190,
      status: 'occupied',
    },
    {
      id: '4',
      number: '104',
      name: 'Suíte 4',
      capacity: 5,
      price: 190,
      status: 'available',
    },
  ]

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
    }
    return colors[status] || colors.available
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: 'Disponível',
      occupied: 'Ocupado',
      maintenance: 'Manutenção',
    }
    return labels[status] || status
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar quartos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Preço
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{room.number}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{room.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{room.capacity} pessoas</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    R$ {room.price.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      room.status
                    )}`}
                  >
                    {getStatusLabel(room.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <button className="text-primary hover:text-primary-dark">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

