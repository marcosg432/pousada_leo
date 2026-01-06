'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import ProtectedRoute from '@/components/admin/ProtectedRoute'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Se for a página de login, retornar apenas os children sem layout
  if (isLoginPage) {
    return <>{children}</>
  }

  // Para outras páginas, aplicar o layout protegido
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
            <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
            <main className="flex-1 p-4 md:p-6 overflow-x-hidden">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

