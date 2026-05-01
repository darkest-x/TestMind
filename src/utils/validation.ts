// 验证工具函数

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const isValidProjectName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100
}

export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0
}
