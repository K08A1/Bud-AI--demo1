import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { coachConversation } from '@/lib/openai'

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

    // 验证输入
    if (!childId || !taskId || !message) {
      return NextResponse.json(
        { error: '请提供孩子ID、任务ID和消息' },
        { status: 400 }
      )
    }

    // 验证孩子所有权
    const child = await prisma.child.findFirst({
      where: { id: childId, userId: user.id }
    })

    if (!child) {
      return NextResponse.json(
        { error: '孩子档案不存在' },
        { status: 404 }
      )
    }

    // 查找或创建陪练会话
    let coachSession = await prisma.coachSession.findFirst({
      where: { childId, taskId }
    })

    if (!coachSession) {
      coachSession = await prisma.coachSession.create({
        data: {
          childId,
          taskId,
          messages: [],
          turnCount: 0
        }
      })
    }

    // 构建对话历史
    const conversationHistory = [
      ...coachSession.messages,
      { role: 'user', content: message }
    ]

    // 获取AI回复
    const aiResponse = await coachConversation(
      conversationHistory,
      child.nickname,
      child.grade
    )

    // 更新陪练会话
    const updatedSession = await prisma.coachSession.update({
      where: { id: coachSession.id },
      data: {
        messages: [
          ...conversationHistory,
          { role: 'assistant', content: aiResponse }
        ],
        turnCount: coachSession.turnCount + 1,
        lastActivityAt: new Date()
      }
    })

    return NextResponse.json({ 
      response: aiResponse,
      session: updatedSession
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

    const { searchParams } = new URL(request.url)
    const childId = searchParams.get('childId')
    const taskId = searchParams.get('taskId')

    if (!childId || !taskId) {
      return NextResponse.json(
        { error: '请提供孩子ID和任务ID' },
        { status: 400 }
      )
    }

    // 验证孩子所有权
    const child = await prisma.child.findFirst({
      where: { id: childId, userId: user.id }
    })

    if (!child) {
      return NextResponse.json(
        { error: '孩子档案不存在' },
        { status: 404 }
      )
    }

    // 获取陪练历史
    const coachSession = await prisma.coachSession.findFirst({
      where: { childId, taskId }
    })

    return NextResponse.json({ 
      session: coachSession || { messages: [], turnCount: 0 }
    })

  } catch (error) {
    console.error('获取陪练历史错误:', error)
    return NextResponse.json(
      { error: '获取失败，请稍后重试' },
      { status: 500 }
    )
  }
} 