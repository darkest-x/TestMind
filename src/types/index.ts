export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user'
}

export interface TestCase {
  id: string
  name: string
  description: string
  type: 'unit' | 'api' | 'boundary'
  status: 'pending' | 'running' | 'passed' | 'failed'
  code: string
  createdAt: string
  updatedAt: string
  tags: string[]
  projectId: string
}

export interface Project {
  id: string
  name: string
  description: string
  repositoryUrl: string
  language: string
  testCases: TestCase[]
  createdAt: string
  updatedAt: string
}

export interface GenerationConfig {
  testType: 'unit' | 'api' | 'boundary'
  coverageTarget: number
  complexity: 'low' | 'medium' | 'high'
  language: string
  framework: string
}

export interface TestReport {
  id: string
  projectId: string
  totalTests: number
  passed: number
  failed: number
  skipped: number
  coverage: number
  duration: number
  createdAt: string
  testCases: TestCase[]
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  read: boolean
  createdAt: string
}
