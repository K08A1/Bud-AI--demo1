import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromRequest } from '@/lib/auth'
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

    const body = await request.json()
    const { taskId, submission, message, previousMessages, childId } = body

    // 验证输入
    if (!taskId || !message || !childId) {
      return NextResponse.json(
        { error: '请提供完整信息' },
        { status: 400 }
      )
    }

    // 验证孩子档案归属
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        userId: user.userId,
      },
    })

    if (!child) {
      return NextResponse.json(
        { error: '孩子档案不存在' },
        { status: 404 }
      )
    }

    // 获取任务信息
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    })

    if (!task) {
      return NextResponse.json(
        { error: '任务不存在' },
        { status: 404 }
      )
    }

    // 查找或创建陪练会话
    let coachSession = await prisma.coachSession.findFirst({
      where: {
        taskRecord: {
          taskId,
          childId,
        },
      },
    })

    if (!coachSession) {
      // 创建新的陪练会话
      const taskRecord = await prisma.taskRecord.findFirst({
        where: {
          taskId,
          childId,
          status: 'IN_PROGRESS',
        },
      })

      if (!taskRecord) {
        return NextResponse.json(
          { error: '任务记录不存在' },
          { status: 404 }
        )
      }

      coachSession = await prisma.coachSession.create({
        data: {
          taskRecordId: taskRecord.id,
          messages: [],
          turnCount: 0,
        },
      })
    }

    // 构建对话历史
    const messages = [
      ...previousMessages,
      { role: 'user', content: message },
    ]

    // 调用AI陪练
    const coachResponse = await coachConversation(
      task.description,
      submission || '',
      messages
    )

    // 更新陪练会话
    const updatedMessages = [
      ...messages,
      { role: 'assistant', content: coachResponse.response },
    ]

    await prisma.coachSession.update({
      where: { id: coachSession.id },
      data: {
        messages: updatedMessages,
        turnCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({
      response: coachResponse.response,
      suggestions: coachResponse.suggestions,
      encouragement: coachResponse.encouragement,
      turnCount: coachSession.turnCount + 1,
    })
  } catch (error) {
    console.error('Coach conversation error:', error)
    return NextResponse.json(
      { error: '陪练对话失败，请稍后重试' },
      { status: 500 }
    )
  }
}

// 获取陪练历史
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
    const taskId = searchParams.get('taskId')
    const childId = searchParams.get('childId')

    if (!taskId || !childId) {
      return NextResponse.json(
        { error: '请提供任务ID和孩子ID' },
        { status: 400 }
      )
    }

    // 验证孩子档案归属
    const child = await prisma.child.findFirst({
      where: {
        id: childId,
        userId: user.userId,
      },
    })

    if (!child) {
      return NextResponse.json(
        { error: '孩子档案不存在' },
        { status: 404 }
      )
    }

    // 获取陪练会话
    const coachSession = await prisma.coachSession.findFirst({
      where: {
        taskRecord: {
          taskId,
          childId,
        },
      },
    })

    if (!coachSession) {
      return NextResponse.json({
        messages: [],
        turnCount: 0,
      })
    }

    return NextResponse.json({
      messages: coachSession.messages,
      turnCount: coachSession.turnCount,
    })
  } catch (error) {
    console.error('Get coach session error:', error)
    return NextResponse.json(
      { error: '获取陪练历史失败' },
      { status: 500 }
    )
  }
} 