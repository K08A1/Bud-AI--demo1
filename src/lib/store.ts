import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 用户信息
interface User {
  id: string
  phone: string
  role: string
  children?: Child[]
}

// 孩子信息
interface Child {
  id: string
  nickname: string
  grade: string
  interests: string[]
  avatarUrl?: string
  level: number
  xp: number
  streak: number
  globalTitle: string
  expressionScore: number
  logicScore: number
  explorationScore: number
  creativityScore: number
  habitScore: number
}

// 应用状态
interface AppState {
  // 用户相关
  user: User | null
  currentChild: Child | null
  token: string | null
  
  // 操作方法
  setUser: (user: User | null) => void
  setCurrentChild: (child: Child | null) => void
  setToken: (token: string | null) => void
  logout: () => void
  
  // UI状态
  isLoading: boolean
  setLoading: (loading: boolean) => void
  
  // 任务相关
  currentTask: any | null
  setCurrentTask: (task: any) => void
  
  // 通知
  notifications: any[]
  addNotification: (notification: any) => void
  removeNotification: (id: string) => void
  
  // 学习进度
  todayProgress: {
    mainTaskCompleted: boolean
    microTaskCompleted: boolean
    xpEarned: number
  }
  updateTodayProgress: (progress: Partial<AppState['todayProgress']>) => void
}

// 创建Store
export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // 初始状态
      user: null,
      currentChild: null,
      token: null,
      isLoading: false,
      currentTask: null,
      notifications: [],
      todayProgress: {
        mainTaskCompleted: false,
        microTaskCompleted: false,
        xpEarned: 0,
      },
      
      // 用户操作
      setUser: (user) => set({ user }),
      setCurrentChild: (child) => set({ currentChild: child }),
      setToken: (token) => set({ token }),
      logout: () => set({ 
        user: null, 
        currentChild: null, 
        token: null,
        currentTask: null,
        todayProgress: {
          mainTaskCompleted: false,
          microTaskCompleted: false,
          xpEarned: 0,
        }
      }),
      
      // UI操作
      setLoading: (loading) => set({ isLoading: loading }),
      
      // 任务操作
      setCurrentTask: (task) => set({ currentTask: task }),
      
      // 通知操作
      addNotification: (notification) => 
        set((state) => ({ 
          notifications: [...state.notifications, { ...notification, id: Date.now().toString() }] 
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        })),
      
      // 进度操作
      updateTodayProgress: (progress) =>
        set((state) => ({
          todayProgress: { ...state.todayProgress, ...progress }
        })),
    }),
    {
      name: 'bud-ai-storage', // localStorage key
      partialize: (state) => ({ // 只持久化部分数据
        user: state.user,
        currentChild: state.currentChild,
        token: state.token,
      }),
    }
  )
)

// 导出hooks
export const useUser = () => useStore((state) => state.user)
export const useCurrentChild = () => useStore((state) => state.currentChild)
export const useToken = () => useStore((state) => state.token)
export const useIsLoading = () => useStore((state) => state.isLoading)
export const useTodayProgress = () => useStore((state) => state.todayProgress) 