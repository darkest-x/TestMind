import { Notification } from '../types'

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'success',
    message: '电商平台 API 的 156 个测试用例已成功执行完成',
    read: false,
    createdAt: '2024-05-02T10:30:00Z'
  },
  {
    id: 'notif-2',
    type: 'error',
    message: '用户认证服务有 2 个测试用例失败',
    read: false,
    createdAt: '2024-05-02T09:15:00Z'
  },
  {
    id: 'notif-3',
    type: 'info',
    message: '新贡献者 Wang Hong 加入了团队',
    read: true,
    createdAt: '2024-05-01T16:45:00Z'
  },
  {
    id: 'notif-4',
    type: 'warning',
    message: '实时聊天系统的测试覆盖率低于 90%',
    read: true,
    createdAt: '2024-05-01T14:20:00Z'
  },
  {
    id: 'notif-5',
    type: 'success',
    message: '支付网关服务的 112 个测试用例已成功生成',
    read: true,
    createdAt: '2024-05-01T12:00:00Z'
  },
  {
    id: 'notif-6',
    type: 'info',
    message: '测试报告 #145 已成功生成',
    read: true,
    createdAt: '2024-04-30T18:30:00Z'
  }
]

export const getUnreadNotifications = (): number => {
  return mockNotifications.filter(n => !n.read).length
}

export const markNotificationAsRead = (id: string): void => {
  const notification = mockNotifications.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

export const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>): Notification => {
  const newNotification: Notification = {
    ...notification,
    id: `notif-${Date.now()}`,
    createdAt: new Date().toISOString()
  }
  mockNotifications.unshift(newNotification)
  return newNotification
}
