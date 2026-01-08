'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // Não proteger a rota de login
    if (pathname === '/admin/login') {
      setIsAuthenticated(true)
      setIsLoading(false)
      setHasChecked(true)
      return
    }

    // Verificar autenticação apenas no cliente e apenas uma vez
    if (typeof window !== 'undefined' && !hasChecked) {
      const user = localStorage.getItem('user')
      if (!user) {
        setIsLoading(false)
        setHasChecked(true)
        router.replace('/admin/login')
        return
      } else {
        setIsAuthenticated(true)
        setIsLoading(false)
        setHasChecked(true)
      }
    } else if (typeof window === 'undefined') {
      // No servidor, apenas marcar como não autenticado
      setIsLoading(false)
      setHasChecked(true)
    }
  }, [router, pathname, hasChecked])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null
  }

  return <>{children}</>
}

