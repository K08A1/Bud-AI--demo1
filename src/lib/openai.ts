import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// 5C能力维度定义
export const ABILITIES = {
  expression: '表达力',
  logic: '逻辑力',
  exploration: '探究力',
  creativity: '创造力',
  habit: '习惯力',
} as const

export type AbilityType = keyof typeof ABILITIES

export interface AbilityScores {
  expression: number
  logic: number
  exploration: number
  creativity: number
  habit: number
}

// AI诊断评估
export async function performInitialAssessment(
  childAge: number,
  responses: string[]
): Promise<{
  scores: AbilityScores
  analysis: string
  suggestions: string[]
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `你是一位专业的儿童教育专家，擅长评估和培养儿童的五项核心能力（5C）：
          1. 表达力：清晰、完整、有条理地表达想法
          2. 逻辑力：有条理地思考，理解因果关系
          3. 探究力：保持好奇心，主动提问和探索
          4. 创造力：有独特想法，富有想象力
          5. 习惯力：坚持完成任务，养成良好习惯
          
          请根据孩子的回答，给出1-5分的评分，并提供友善、鼓励的分析和建议。
          输出JSON格式。`,
        },
        {
          role: 'user',
          content: `孩子年龄：${childAge}岁
          回答内容：${responses.join('\n')}
          
          请评估孩子的5C能力，给出评分（1-5分）、分析（50字以内）和3条改进建议。`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    
    return {
      scores: {
        expression: result.scores?.expression || 3,
        logic: result.scores?.logic || 3,
        exploration: result.scores?.exploration || 3,
        creativity: result.scores?.creativity || 3,
        habit: result.scores?.habit || 3,
      },
      analysis: result.analysis || '孩子表现很棒，继续加油！',
      suggestions: result.suggestions || ['多练习表达', '培养好奇心', '坚持每日挑战'],
    }
  } catch (error) {
    console.error('AI assessment error:', error)
    // 返回默认评估
    return {
      scores: {
        expression: 3,
        logic: 3,
        exploration: 3,
        creativity: 3,
        habit: 3,
      },
      analysis: '孩子表现很棒，继续努力！',
      suggestions: ['每天坚持练习', '多思考为什么', '大胆表达想法'],
    }
  }
}

// 生成个性化任务
export async function generatePersonalizedTask(
  childAge: number,
  ability: AbilityType,
  difficulty: number,
  interests: string[]
): Promise<{
  title: string
  description: string
  prompt: string
  constraints: string[]
  expectedMinutes: number
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `你是一位儿童教育专家，需要为孩子设计有趣的学习任务。
          任务要求：
          1. 适合${childAge}岁孩子
          2. 重点培养${ABILITIES[ability]}
          3. 难度${difficulty}级（1-5级）
          4. 融入孩子的兴趣：${interests.join('、')}
          5. 避免使用学科化词汇
          6. 任务时长5-10分钟
          
          输出JSON格式的任务内容。`,
        },
        {
          role: 'user',
          content: '请生成一个有趣的学习任务。',
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    
    return {
      title: result.title || '今日挑战',
      description: result.description || '完成一个有趣的任务',
      prompt: result.prompt || '请开始你的创作',
      constraints: result.constraints || [],
      expectedMinutes: result.expectedMinutes || 10,
    }
  } catch (error) {
    console.error('Task generation error:', error)
    // 返回默认任务
    return {
      title: '故事接龙',
      description: '续写一个有趣的故事',
      prompt: '小兔子在森林里迷路了，请续写接下来的故事...',
      constraints: ['包含至少一个转折', '描述小兔子的心情'],
      expectedMinutes: 10,
    }
  }
}

// AI陪练对话
export async function coachConversation(
  taskContent: string,
  submission: string,
  previousMessages: any[] = []
): Promise<{
  response: string
  suggestions: string[]
  encouragement: string
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `你是一位温柔耐心的AI陪练老师，专门辅导儿童完成学习任务。
          交流原则：
          1. 使用简单、亲切的语言
          2. 每次回复不超过3句话
          3. 先肯定孩子的努力，再给出引导
          4. 通过提问引导思考，而不是直接给答案
          5. 鼓励孩子自己发现和改进
          
          任务内容：${taskContent}`,
        },
        ...previousMessages,
        {
          role: 'user',
          content: submission,
        },
      ],
      temperature: 0.7,
    })

    const response = completion.choices[0].message.content || ''
    
    // 解析回复内容
    return {
      response: response.slice(0, 150), // 限制长度
      suggestions: [
        '可以再详细描述一下',
        '试着加入更多细节',
        '想想还有什么可能',
      ],
      encouragement: '你做得很棒，继续加油！',
    }
  } catch (error) {
    console.error('Coach conversation error:', error)
    return {
      response: '你的想法很有创意！能再详细说说吗？',
      suggestions: ['补充更多细节', '解释你的想法'],
      encouragement: '继续努力，你可以的！',
    }
  }
}

// 评估任务完成情况
export async function evaluateTaskSubmission(
  task: any,
  submission: string,
  timeSpent: number
): Promise<{
  scores: AbilityScores
  feedback: string
  suggestions: string[]
  exemplarAnswer: string
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `你是一位专业的儿童教育评估专家。
          请根据孩子的任务完成情况，评估5C能力表现：
          1. 表达力（1-5分）：语言是否清晰完整
          2. 逻辑力（1-5分）：思路是否有条理
          3. 探究力（1-5分）：是否展现好奇心和探索精神
          4. 创造力（1-5分）：是否有独特想法
          5. 习惯力（1-5分）：是否认真完成任务
          
          任务要求：${task.description}
          用时：${Math.round(timeSpent / 60)}分钟`,
        },
        {
          role: 'user',
          content: `孩子的回答：${submission}
          
          请给出5C评分、鼓励性反馈（50字内）、3条改进建议和一个示例答案（100-150字）。
          输出JSON格式。`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    
    return {
      scores: {
        expression: result.scores?.expression || 3,
        logic: result.scores?.logic || 3,
        exploration: result.scores?.exploration || 3,
        creativity: result.scores?.creativity || 3,
        habit: result.scores?.habit || 3,
      },
      feedback: result.feedback || '完成得很好，继续保持！',
      suggestions: result.suggestions || ['可以更详细一些', '试着多思考', '表达更完整'],
      exemplarAnswer: result.exemplarAnswer || '这是一个很好的回答示例...',
    }
  } catch (error) {
    console.error('Evaluation error:', error)
    return {
      scores: {
        expression: 3,
        logic: 3,
        exploration: 3,
        creativity: 3,
        habit: 3,
      },
      feedback: '你完成得很认真，继续努力！',
      suggestions: ['继续保持', '多加练习', '大胆尝试'],
      exemplarAnswer: '参考答案：可以从多个角度思考这个问题...',
    }
  }
}

// 生成周报内容
export async function generateWeeklyReport(
  childData: any,
  weeklyStats: any
): Promise<{
  summary: string
  insights: any
  suggestions: string[]
  recommendedGames: string[]
}> {
  try {
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: `你是一位儿童教育专家，需要为家长生成周报。
          周报要求：
          1. 语言亲切、易懂
          2. 突出孩子的进步和亮点
          3. 给出具体可行的建议
          4. 推荐适合的家庭游戏`,
        },
        {
          role: 'user',
          content: `孩子本周数据：
          完成任务：${weeklyStats.tasksCompleted}次
          平均得分：${weeklyStats.averageScore}
          进步最大：${weeklyStats.mostImproved}
          需要加强：${weeklyStats.needsWork}
          
          请生成周报内容。`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    
    return {
      summary: result.summary || '孩子本周表现出色！',
      insights: result.insights || {},
      suggestions: result.suggestions || ['继续保持良好习惯', '多鼓励孩子', '一起完成家庭游戏'],
      recommendedGames: result.recommendedGames || ['故事接龙', '科学小实验'],
    }
  } catch (error) {
    console.error('Weekly report generation error:', error)
    return {
      summary: '孩子本周学习认真，进步明显！',
      insights: {
        highlights: ['坚持完成任务', '创造力提升'],
        improvements: ['表达更完整', '逻辑更清晰'],
      },
      suggestions: ['继续鼓励', '增加互动', '保持节奏'],
      recommendedGames: ['家庭故事会', '逻辑游戏'],
    }
  }
} 