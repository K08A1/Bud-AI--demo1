import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json()

    // 验证输入
    if (!phone || !password) {
      return NextResponse.json(
        { error: '请填写手机号和密码' },
        { status: 400 }
      )
    }

    // 简化的用户验证（实际应用中会查询数据库）
    // 这里使用模拟数据，实际应该查询数据库
    const mockUser = {
      id: 'temp-user-id',
      phone,
      role: 'PARENT',
      children: [],
      lastLoginAt: new Date()
    }

    // 简化的密码验证（实际应用中会验证真实密码）
    if (password !== '123456') { // 模拟密码
      return NextResponse.json(
        { error: '手机号或密码错误' },
        { status: 401 }
      )
    }

    // 生成JWT token
    const token = generateToken({ userId: mockUser.id, role: mockUser.role })

    // 返回用户信息
    const userWithoutPassword = {
      id: mockUser.id,
      phone: mockUser.phone,
      role: mockUser.role,
      children: mockUser.children,
      lastLoginAt: mockUser.lastLoginAt
    }

    return NextResponse.json({
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    )
  }
} 