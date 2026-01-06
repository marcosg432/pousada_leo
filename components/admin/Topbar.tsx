'use client'

import { useEffect, useState } from 'react'
import { Bell, User, Menu } from 'lucide-react'

interface TopbarProps {
  onMenuClick: () => void
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <header className="bg-white shadow-sm h-14 md:h-16 flex items-center justify-between px-4 md:px-6 lg:pl-72">
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <h1 className="text-lg md:text-xl font-semibold text-gray-900">
          Painel Administrativo
        </h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
          <Bell className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </div>
          <span className="hidden sm:inline text-xs md:text-sm font-medium text-gray-700">
            {user?.name || 'Usuário'}
          </span>
        </div>
      </div>
    </header>
  )
}



