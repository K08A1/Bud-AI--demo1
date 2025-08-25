import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const { childId, themeId, contributionType, content } = await request.json()

    if (!childId || !themeId || !contributionType || !content) {
      return NextResponse.json(
        { error: '请提供完整信息' },
        { status: 400 }
      )
    }

    // 简化的贡献创建（实际应用中会保存到数据库）
    const contribution = {
      id: 'temp-id',
      childId,
      themeId,
      type: contributionType,
      content,
      createdAt: new Date()
    }

    return NextResponse.json({ contribution })

  } catch (error) {
    console.error('创建共创贡献错误:', error)
    return NextResponse.json(
      { error: '提交失败，请稍后重试' },
      { status: 500 }
    )
  }
} 