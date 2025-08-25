import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  role: string
}

// 生成JWT令牌
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

// 验证JWT令牌
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

// 加密密码
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// 验证密码
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// 从请求中获取用户信息
export async function getUserFromRequest(request: NextRequest): Promise<JWTPayload | null> {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  
  const token = authHeader.substring(7)
  return verifyToken(token)
}

// 验证手机号格式
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^1[3-9]\d{9}$/
  return phoneRegex.test(phone)
}

// 生成验证码
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// 验证码存储（实际应用中应使用Redis）
const verificationCodes = new Map<string, { code: string; expires: number }>()

// 保存验证码
export function saveVerificationCode(phone: string, code: string): void {
  verificationCodes.set(phone, {
    code,
    expires: Date.now() + 5 * 60 * 1000, // 5分钟过期
  })
}

// 验证验证码
export function verifyCode(phone: string, code: string): boolean {
  const stored = verificationCodes.get(phone)
  
  if (!stored) {
    return false
  }
  
  if (Date.now() > stored.expires) {
    verificationCodes.delete(phone)
    return false
  }
  
  if (stored.code !== code) {
    return false
  }
  
  verificationCodes.delete(phone)
  return true
} 