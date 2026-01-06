'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import {
  LayoutDashboard,
  Calendar,
  Grid3x3,
  Bed,
  Users,
  FileText,
  Settings,
  LogOut,
} from 'lucide-react'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/reservas', label: 'Reservas', icon: Calendar },
  { href: '/admin/calendario', label: 'Calendário', icon: Grid3x3 },
  { href: '/admin/quartos', label: 'Quartos', icon: Bed },
  { href: '/admin/hospedes', label: 'Hóspedes', icon: Users },
  { href: '/admin/relatorios', label: 'Relatórios', icon: FileText },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.href = '/admin/login'
  }

  const handleLinkClick = () => {
    // Fechar sidebar ao clicar em um link no mobile
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-white shadow-lg min-h-screen flex-col fixed left-0 top-0 z-30">
        <div className="p-4 md:p-6 border-b">
          <div className="flex items-center">
            <img
              src="/logo/logo.png"
              alt="Pousada do Leô"
              className="h-24 md:h-32 w-auto object-contain"
            />
          </div>
          <p className="text-xs md:text-sm text-gray-600 mt-2">Painel Administrativo</p>
        </div>

        <nav className="p-2 md:p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition text-sm md:text-base ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-2 md:p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full transition text-sm md:text-base"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <img
              src="/logo/logo.png"
              alt="Pousada do Leô"
              className="h-20 w-auto object-contain"
            />
            <p className="text-xs text-gray-600 mt-1">Painel Administrativo</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}

