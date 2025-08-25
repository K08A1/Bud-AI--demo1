import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // 验证输入
    if (!childId || !themeId || !contributionType || !content) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
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

    // 检查主题是否活跃
    const theme = await prisma.coCreationTheme.findUnique({
      where: { id: themeId }
    })

    if (!theme || !theme.isActive) {
      return NextResponse.json(
        { error: '共创主题不存在或已结束' },
        { status: 400 }
      )
    }

    // 检查是否已有同类型贡献
    const existingContribution = await prisma.coCreationContribution.findFirst({
      where: {
        childId,
        themeId,
        contributionType
      }
    })

    if (existingContribution) {
      return NextResponse.json(
        { error: '您已提交过此类型的贡献' },
        { status: 400 }
      )
    }

    // 创建贡献
    const contribution = await prisma.coCreationContribution.create({
      data: {
        childId,
        themeId,
        contributionType,
        content,
        submittedAt: new Date()
      }
    })

    // 增加XP
    await prisma.child.update({
      where: { id: childId },
      data: { xp: child.xp + 30 }
    })

    // 检查协作徽章
    await checkCollaborationBadge(childId)

    return NextResponse.json({ contribution })

  } catch (error) {
    console.error('创建共创贡献错误:', error)
    return NextResponse.json(
      { error: '提交失败，请稍后重试' },
      { status: 500 }
    )
  }
}

async function checkCollaborationBadge(childId: string) {
  try {
    const contributionCount = await prisma.coCreationContribution.count({
      where: { childId }
    })

    if (contributionCount >= 5) {
      let badge = await prisma.badge.findUnique({
        where: { name: '共创合作者' }
      })

      if (!badge) {
        badge = await prisma.badge.create({
          data: {
            name: '共创合作者',
            description: '积极参与共创活动',
            icon: '🤝',
            criteria: '贡献5次以上'
          }
        })
      }

      const existingAward = await prisma.badgeAward.findFirst({
        where: { childId, badgeId: badge.id }
      })

      if (!existingAward) {
        await prisma.badgeAward.create({
          data: {
            childId,
            badgeId: badge.id,
            awardedAt: new Date()
          }
        })
      }
    }
  } catch (error) {
    console.error('检查协作徽章错误:', error)
  }
} 