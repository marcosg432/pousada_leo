import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'
import WhatsAppButton from '@/components/site/WhatsAppButton'
import { Clock, DollarSign, CreditCard, AlertTriangle, Bed, UtensilsCrossed, Cigarette, Dog, Calendar, Car, Coffee } from 'lucide-react'

export default function RegrasPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[300px] flex items-center justify-center overflow-hidden mt-20 bg-gradient-to-br from-primary to-primary-dark">
        <div className="relative z-10 text-center px-4 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Regras e Políticas da Hospedagem</h1>
          <p className="text-xl text-white/90">
            Conheça nossas regras para uma estadia tranquila
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-12">
            
            {/* Horários */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">🕑 HORÁRIOS</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                O horário de entrada é a partir das 14h e o check-out até o meio-dia.
              </p>
            </div>

            {/* Preços */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">💰 PREÇOS</h2>
              </div>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  O valor é definido pela quantidade de pessoas.
                </p>
                <p>
                  Trabalhamos com um valor mínimo para até duas pessoas.
                </p>
                <p>
                  Para mais de duas pessoas no mesmo quarto, será cobrado o valor base + R$ 50 por pessoa extra por dia.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <p className="font-semibold mb-2">Exemplo:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>R$ 200 para até duas pessoas</li>
                    <li>3 pessoas: R$ 250</li>
                    <li>4 pessoas: R$ 300</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Reserva */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">🛎️ RESERVA</h2>
              </div>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  Para reservar, é necessário o pagamento de 50% do valor total no momento da reserva.
                </p>
                <p>
                  O hóspede pode reservar a qualquer momento enquanto o quarto estiver disponível.
                </p>
              </div>
            </div>

            {/* Pagamento */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">💳 PAGAMENTO</h2>
              </div>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  A confirmação da reserva pode ser feita via Pix, boleto, depósito, transferência bancária ou cartão de crédito (via link de pagamento).
                </p>
                <p>
                  Para reservas de datas próximas, serão aceitas apenas formas de pagamento com confirmação no mesmo dia.
                </p>
                <p>
                  O restante do pagamento deve ser feito no check-in.
                </p>
                <p>
                  No check-in, só serão aceitas formas de pagamento com confirmação imediata: Pix, cartão ou dinheiro.
                </p>
              </div>
            </div>

            {/* Atenção Pagamento */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900">⚠️ ATENÇÃO (PAGAMENTO)</h2>
              </div>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  Pagamentos via cartão de crédito possuem acréscimo de 5%.
                </p>
                <p>
                  Parcelamentos possuem juros adicionais.
                </p>
                <p>
                  Essas taxas são da operadora e não são repassadas para a pousada.
                </p>
                <p className="font-semibold">
                  O pagamento de confirmação é o que garante a reserva e evita bloqueios indevidos.
                </p>
              </div>
            </div>

            {/* Os Quartos */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Bed className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">🛏️ OS QUARTOS</h2>
              </div>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  Os quartos não são compartilhados.
                </p>
                <p className="font-semibold">Todos possuem:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Cama de casal e beliche</li>
                  <li>Frigobar</li>
                  <li>Micro-ondas</li>
                  <li>Ar-condicionado</li>
                  <li>Ventilador</li>
                  <li>TV com Netflix</li>
                  <li>Wi-Fi</li>
                  <li>Banheiro privativo</li>
                  <li>Chuveiro quente</li>
                  <li>Jarra elétrica</li>
                </ul>
                <p>
                  Quartos da frente: janela para a rua
                </p>
                <p>
                  Quartos dos fundos: janela para o corredor
                </p>
              </div>
            </div>

            {/* Roupas de Cama e Limpeza */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Bed className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">🧺 ROUPAS DE CAMA E LIMPEZA</h2>
              </div>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  Os quartos possuem roupas de cama, toalhas e cobertas.
                </p>
                <p>
                  Limpeza durante a estadia deve ser solicitada com antecedência.
                </p>
                <p>
                  O serviço ocorre entre 12h e 14h e custa R$ 30.
                </p>
                <p>
                  Troca apenas de roupas de cama e toalhas é gratuita.
                </p>
                <p>
                  Danos permanentes poderão gerar cobrança.
                </p>
              </div>
            </div>

            {/* Comidas e Bebidas */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <UtensilsCrossed className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">🍽️ COMIDAS E BEBIDAS</h2>
              </div>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  A pousada não oferece comida ou bebida.
                </p>
                <p>
                  O frigobar permanece ligado e vazio.
                </p>
                <p>
                  O hóspede pode trazer e consumir o que quiser no quarto.
                </p>
                <p>
                  Há restaurantes e delivery na cidade, inclusive iFood.
                </p>
              </div>
            </div>

            {/* Fumantes */}
            <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Cigarette className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">🚭 FUMANTES</h2>
              </div>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  Não é permitido fumar nos quartos.
                </p>
                <p>
                  Há área específica para fumantes.
                </p>
                <p className="font-semibold">
                  Multa de R$ 50 em caso de descumprimento.
                </p>
                <p>
                  Persistência pode gerar cancelamento da estadia sem reembolso.
                </p>
                <p>
                  A regra vale também para incensos, narguiles, vapers e similares.
                </p>
              </div>
            </div>

            {/* Pets */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Dog className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">🐾 PETS</h2>
              </div>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  Aceitamos apenas cães de pequeno porte e fêmea.
                </p>
                <p>
                  Outros animais devem ser consultados previamente.
                </p>
              </div>
            </div>

            {/* Cancelamento e Reagendamento */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">📅 CANCELAMENTO E REAGENDAMENTO</h2>
              </div>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  Reservas sem pagamento de confirmação podem ser canceladas pela pousada.
                </p>
                <p>
                  Reservas confirmadas são reembolsáveis apenas se canceladas com até 7 dias de antecedência.
                </p>
                <p>
                  Cancelamento no mesmo dia da reserva é gratuito.
                </p>
                <p className="font-semibold">Reagendamentos:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Apenas uma vez</li>
                  <li>Dentro do prazo</li>
                  <li>Sujeitos à disponibilidade</li>
                  <li>Podem ter reajuste de valor</li>
                </ul>
              </div>
            </div>

            {/* Estacionamento */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Car className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">🚗 ESTACIONAMENTO</h2>
              </div>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  A pousada não possui estacionamento próprio.
                </p>
                <p>
                  Há estacionamento público gratuito rotativo em frente.
                </p>
                <p>
                  Há estacionamentos pagos próximos.
                </p>
                <p>
                  Para quem vai à Ilha Grande, recomenda-se estacionamento pago.
                </p>
              </div>
            </div>

            {/* Café da Manhã */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Coffee className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">🍞 CAFÉ DA MANHÃ</h2>
              </div>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  A pousada não oferece café da manhã.
                </p>
                <p>
                  Os quartos possuem frigobar, micro-ondas e jarra elétrica.
                </p>
                <p>
                  Comércio próximo disponível.
                </p>
              </div>
            </div>

            {/* Booking */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">🌐 BOOKING</h2>
              </div>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  Cancelamentos de reservas feitas pelo Booking devem ser feitos pelo próprio Booking.
                </p>
                <p>
                  Reservas não canceladas permanecem ativas e bloqueiam o quarto.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  )
}

