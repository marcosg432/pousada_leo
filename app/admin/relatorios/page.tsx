export default function RelatoriosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        <p className="text-gray-600 mt-2">Análises e relatórios da pousada</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Relatório de Ocupação</h2>
          <p className="text-gray-600 mb-4">
            Visualize a taxa de ocupação por período
          </p>
          <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition">
            Gerar Relatório
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Relatório Financeiro</h2>
          <p className="text-gray-600 mb-4">
            Análise de receitas e faturamento
          </p>
          <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition">
            Gerar Relatório
          </button>
        </div>
      </div>
    </div>
  )
}



