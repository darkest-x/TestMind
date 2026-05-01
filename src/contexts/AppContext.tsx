import React from 'react'
import { User, Notification, Project } from '../types'

interface AppContextType {
  user: User | null
  notifications: Notification[]
  isLoading: boolean
  setUser: (user: User | null) => void
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (id: string) => void
}

const AppContext = React.createContext<AppContextType | undefined>(undefined)

interface AppProviderProps {
  children: React.ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>({
    id: 'user-1',
    name: '李四',
    email: 'lisi@example.com',
    avatar: 'https://i.pravatar.cc/150?img=44',
    role: 'admin'
  })
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: 'notif-1',
      type: 'success',
      message: '测试用例生成完成！已创建 156 个测试用例',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'notif-2',
      type: 'info',
      message: '项目覆盖率已达到 85%',
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ])
  const [isLoading, setIsLoading] = React.useState(false)

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev])
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  return (
    <AppContext.Provider
      value={{
        user,
        notifications,
        isLoading,
        setUser,
        addNotification,
        markNotificationAsRead
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = React.useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
