import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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

    const body = await request.json()
    const { themeId, childId, content, type } = body

    // 验证输入
    if (!themeId || !childId || !content || !type) {
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

    // 验证主题是否存在且活跃
    const theme = await prisma.coCreationTheme.findUnique({
      where: { id: themeId },
    })

    if (!theme) {
      return NextResponse.json(
        { error: '创作主题不存在' },
        { status: 404 }
      )
    }

    if (!theme.isActive) {
      return NextResponse.json(
        { error: '该主题已结束' },
        { status: 400 }
      )
    }

    // 检查是否已经贡献过
    const existingContribution = await prisma.coCreationContribution.findFirst({
      where: {
        themeId,
        childId,
        type,
      },
    })

    if (existingContribution) {
      return NextResponse.json(
        { error: '您已经贡献过此类内容' },
        { status: 400 }
      )
    }

    // 创建贡献记录
    const contribution = await prisma.coCreationContribution.create({
      data: {
        themeId,
        childId,
        content,
        type,
      },
    })

    // 更新孩子的XP（共创贡献奖励）
    await prisma.child.update({
      where: { id: childId },
      data: {
        xp: {
          increment: 30, // 共创贡献奖励30 XP
        },
      },
    })

    // 检查并颁发协作徽章
    await checkCollaborationBadge(childId)

    return NextResponse.json({
      contribution,
      message: '贡献成功！',
      xpEarned: 30,
    })
  } catch (error) {
    console.error('Create contribution error:', error)
    return NextResponse.json(
      { error: '贡献失败，请稍后重试' },
      { status: 500 }
    )
  }
}

// 检查并颁发协作徽章
async function checkCollaborationBadge(childId: string) {
  try {
    // 统计共创贡献数量
    const contributionCount = await prisma.coCreationContribution.count({
      where: { childId },
    })

    // 如果达到5次贡献，颁发协作徽章
    if (contributionCount >= 5) {
      await awardBadgeIfNotExists(childId, 'collaboration_master')
    }
  } catch (error) {
    console.error('Check collaboration badge error:', error)
  }
}

async function awardBadgeIfNotExists(childId: string, badgeCode: string) {
  try {
    // 查找或创建徽章定义
    let badge = await prisma.badge.findFirst({
      where: { 
        name: badgeCode,
      },
    })

    if (!badge) {
      // 创建徽章定义
      const badgeInfo = getBadgeInfo(badgeCode)
      badge = await prisma.badge.create({
        data: badgeInfo,
      })
    }

    // 检查是否已经拥有
    const existing = await prisma.badgeAward.findUnique({
      where: {
        childId_badgeId: {
          childId,
          badgeId: badge.id,
        },
      },
    })

    if (!existing) {
      // 颁发徽章
      await prisma.badgeAward.create({
        data: {
          childId,
          badgeId: badge.id,
        },
      })
    }
  } catch (error) {
    console.error('Award badge error:', error)
  }
}

function getBadgeInfo(badgeCode: string) {
  const badges: Record<string, any> = {
    collaboration_master: {
      name: 'collaboration_master',
      description: '共创合作者',
      iconUrl: '🤝',
      category: 'COLLABORATION',
      criteria: { type: 'contributions', value: 5 },
    },
  }

  return badges[badgeCode] || badges.collaboration_master
} 