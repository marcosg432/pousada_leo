// Sistema de autenticação isolado - preparado para migração futura para NextAuth/JWT
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      // Não retornar password
    },
  })
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  })
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: string = 'admin'
) {
  const hashedPassword = await hashPassword(password)
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  })
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.password)

  if (!isValid) {
    return null
  }

  // Retornar sem password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

// Tipos para facilitar migração futura
export type UserSession = {
  id: string
  email: string
  name: string
  role: string
}

// Helper para validar sessão (preparado para JWT no futuro)
export function validateSession(session: any): session is UserSession {
  return (
    session &&
    typeof session.id === 'string' &&
    typeof session.email === 'string' &&
    typeof session.name === 'string' &&
    typeof session.role === 'string'
  )
}

