export default function OccupancyChart() {
  // Dados mockados - em produção viriam da API
  const occupancyData = [
    { month: 'Jan', value: 65 },
    { month: 'Fev', value: 72 },
    { month: 'Mar', value: 68 },
    { month: 'Abr', value: 80 },
    { month: 'Mai', value: 75 },
    { month: 'Jun', value: 78 },
  ]

  const maxValue = 100

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Taxa de Ocupação</h2>
      <div className="space-y-4">
        {occupancyData.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">{item.month}</span>
              <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}



