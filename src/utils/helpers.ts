// 通用帮助函数

export const formatDate = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatTime = (date: string | Date): string => {
  const d = new Date(date)
  return d.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN')
}

export const getRelativeTime = (date: string | Date): string => {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return formatDate(date)
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ')
}

// 性能优化：防抖函数
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 性能优化：节流函数
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 计算测试覆盖率等级判断
export const getCoverageLevel = (coverage: number): 'excellent' | 'good' | 'fair' | 'poor' => {
  if (coverage >= 90) return 'excellent'
  if (coverage >= 80) return 'good'
  if (coverage >= 70) return 'fair'
  return 'poor'
}

// 获取测试状态颜色映射
export const getStatusColor = (status: string, theme: 'light' | 'dark' = 'light'): string => {
  const colors = {
    passed: theme === 'dark' ? 'text-green-400' : 'text-green-600',
    failed: theme === 'dark' ? 'text-red-400' : 'text-red-600',
    pending: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
    running: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
    skipped: theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
  }
  return colors[status as keyof typeof colors] || colors.pending
}

// 测试类型图标映射
export const getTestTypeIcon = (type: string): string => {
  const icons = {
    unit: '单元',
    api: '接口',
    boundary: '边界',
    e2e: '端到端'
  }
  return icons[type as keyof typeof icons] || '其他'
}
