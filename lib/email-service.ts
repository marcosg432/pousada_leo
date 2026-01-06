// Serviço de envio de e-mails
// Preparado para integração futura com serviços como SendGrid, Resend, etc.

import { getMessageTemplate, MessageType, MessageVariables } from './message-templates'

export interface EmailOptions {
  to: string
  subject: string
  content: string
  from?: string
}

/**
 * Envia um e-mail
 * Por enquanto, apenas registra no console (modo desenvolvimento)
 * TODO: Integrar com serviço de e-mail real (SendGrid, Resend, etc.)
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    // Em desenvolvimento, apenas log
    if (process.env.NODE_ENV === 'development') {
      console.log('\n📧 ===== EMAIL ENVIADO =====')
      console.log('Para:', options.to)
      console.log('Assunto:', options.subject)
      console.log('Conteúdo:')
      console.log(options.content)
      console.log('===========================\n')
      return { success: true }
    }

    // Em produção, aqui seria a integração real
    // Exemplo com Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: options.from || 'noreply@pousadaleo.com',
    //   to: options.to,
    //   subject: options.subject,
    //   html: options.content.replace(/\n/g, '<br>'),
    // })

    // Por enquanto, simula sucesso
    return { success: true }
  } catch (error: any) {
    console.error('Erro ao enviar e-mail:', error)
    return {
      success: false,
      error: error.message || 'Erro desconhecido ao enviar e-mail',
    }
  }
}

/**
 * Envia mensagem de reserva usando template
 */
export async function sendReservationMessage(
  type: MessageType,
  vars: MessageVariables,
  recipientEmail: string
): Promise<{ success: boolean; error?: string }> {
  const template = getMessageTemplate(type, vars)
  
  return sendEmail({
    to: recipientEmail,
    subject: template.subject,
    content: template.content,
  })
}

