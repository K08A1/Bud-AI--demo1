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

    const { childId, taskId, message } = await request.json()

    if (!childId || !taskId || !message) {
      return NextResponse.json(
        { error: '请提供完整信息' },
        { status: 400 }
      )
    }

    // 简化的AI回复（实际应用中会调用OpenAI API）
    const aiResponse = `你好！我是你的AI老师。我看到你发送了："${message}"。这是一个很好的问题，让我们一起来探索吧！`

    return NextResponse.json({ 
      response: aiResponse,
      session: { messages: [], turnCount: 1 }
    })

  } catch (error) {
    console.error('AI陪练错误:', error)
    return NextResponse.json(
      { error: '陪练失败，请稍后重试' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request)
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    return NextResponse.json({ 
      session: { messages: [], turnCount: 0 }
    })

  } catch (error) {
    console.error('获取陪练历史错误:', error)
    return NextResponse.json(
      { error: '获取失败，请稍后重试' },
      { status: 500 }
    )
  }
} 