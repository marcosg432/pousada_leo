interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ 
  message = 'Carregando...', 
  size = 'md' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className={`inline-block animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}></div>
        {message && <p className="mt-4 text-gray-600">{message}</p>}
      </div>
    </div>
  )
}





