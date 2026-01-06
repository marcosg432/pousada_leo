import { Calendar, DollarSign, Bed, TrendingUp } from 'lucide-react'

export default function DashboardStats() {
  const stats = [
    {
      title: 'Reservas do Mês',
      value: '24',
      change: '+12%',
      icon: Calendar,
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Taxa de Ocupação',
      value: '78%',
      change: '+5%',
      icon: Bed,
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent',
    },
    {
      title: 'Faturamento',
      value: 'R$ 45.200',
      change: '+18%',
      icon: DollarSign,
      bgColor: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      title: 'Crescimento',
      value: '12%',
      change: '+3%',
      icon: TrendingUp,
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <span className="text-sm font-semibold text-green-600">
              {stat.change}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">
            {stat.value}
          </h3>
          <p className="text-sm text-gray-600">{stat.title}</p>
        </div>
      ))}
    </div>
  )
}

