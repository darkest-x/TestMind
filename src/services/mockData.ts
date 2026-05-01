import { Project, TestCase, TestReport } from '../types'

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: '电商平台 API',
    description: '电子商务平台的后端服务接口',
    repositoryUrl: 'https://github.com/darkest-x/ecommerce-api',
    language: 'TypeScript',
    testCases: [],
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-05-01T08:00:00Z'
  },
  {
    id: 'project-2',
    name: '用户认证服务',
    description: 'JWT 认证系统，包含登录、注册、权限验证',
    repositoryUrl: 'https://github.com/darkest-x/auth-service',
    language: 'Node.js',
    testCases: [],
    createdAt: '2024-02-20T14:45:00Z',
    updatedAt: '2024-04-28T16:30:00Z'
  },
  {
    id: 'project-3',
    name: '数据分析工具',
    description: '数据处理和可视化工具集',
    repositoryUrl: 'https://github.com/darkest-x/data-analysis',
    language: 'Python',
    testCases: [],
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-04-25T11:20:00Z'
  }
]

export const mockTestCases: TestCase[] = [
  {
    id: 'test-1',
    name: '用户登录验证',
    description: '测试用户登录功能，包括正常、异常情况',
    type: 'unit',
    status: 'passed',
    code: `describe('User Login', () => {
  test('should return valid token for correct credentials', () => {
    const result = login('user@example.com', 'password123')
    expect(result.token).toBeDefined()
  })
  
  test('should throw error for invalid password', () => {
    expect(() => login('user@example.com', 'wrong')).toThrow()
  })
})`,
    createdAt: '2024-05-01T08:15:00Z',
    updatedAt: '2024-05-01T08:15:00Z',
    tags: ['authentication', 'unit'],
    projectId: 'project-1'
  },
  {
    id: 'test-2',
    name: 'API 响应时间测试',
    description: '测试 API 响应时间是否在合理范围内',
    type: 'api',
    status: 'passed',
    code: `describe('API Performance', () => {
  test('should respond within 200ms', async () => {
    const start = Date.now()
    await api.get('/users')
    const end = Date.now()
    expect(end - start).toBeLessThan(200)
  })
})`,
    createdAt: '2024-05-01T08:20:00Z',
    updatedAt: '2024-05-01T08:20:00Z',
    tags: ['api', 'performance'],
    projectId: 'project-1'
  },
  {
    id: 'test-3',
    name: '空值边界测试',
    description: '测试各种空值、边界情况的处理',
    type: 'boundary',
    status: 'pending',
    code: `describe('Boundary Tests', () => {
  test('should handle empty input', () => {
    expect(processInput('')).toBeDefined()
  })
  
  test('should handle null input', () => {
    expect(() => processInput(null)).not.toThrow()
  })
  
  test('should handle max length input', () => {
    const longInput = 'x'.repeat(10000)
    expect(processInput(longInput)).toBeDefined()
  })
})`,
    createdAt: '2024-05-01T08:25:00Z',
    updatedAt: '2024-05-01T08:25:00Z',
    tags: ['boundary', 'edge-case'],
    projectId: 'project-1'
  },
  {
    id: 'test-4',
    name: 'JWT 签名验证',
    description: '测试 JWT 令牌的签名和验证逻辑',
    type: 'unit',
    status: 'passed',
    code: `describe('JWT Authentication', () => {
  test('should sign and verify token', () => {
    const token = signToken({ userId: 1 })
    const payload = verifyToken(token)
    expect(payload.userId).toBe(1)
  })
})`,
    createdAt: '2024-04-28T10:00:00Z',
    updatedAt: '2024-04-28T10:00:00Z',
    tags: ['jwt', 'auth'],
    projectId: 'project-2'
  },
  {
    id: 'test-5',
    name: '分页 API 测试',
    description: '测试分页接口的各种边界情况',
    type: 'api',
    status: 'running',
    code: `describe('Pagination API', () => {
  test('should return first page by default', async () => {
    const result = await api.get('/users')
    expect(result.page).toBe(1)
  })
  
  test('should handle page size 0', async () => {
    const result = await api.get('/users?limit=0')
    expect(result.items).toHaveLength(0)
  })
})`,
    createdAt: '2024-04-25T15:30:00Z',
    updatedAt: '2024-04-25T15:30:00Z',
    tags: ['api', 'pagination'],
    projectId: 'project-1'
  }
]

export const mockTestReports: TestReport[] = [
  {
    id: 'report-1',
    projectId: 'project-1',
    totalTests: 156,
    passed: 142,
    failed: 8,
    skipped: 6,
    coverage: 85.3,
    duration: 45.2,
    createdAt: '2024-05-01T08:00:00Z',
    testCases: []
  },
  {
    id: 'report-2',
    projectId: 'project-2',
    totalTests: 89,
    passed: 85,
    failed: 2,
    skipped: 2,
    coverage: 91.2,
    duration: 23.8,
    createdAt: '2024-04-28T16:00:00Z',
    testCases: []
  }
]

export const mockDashboardStats = {
  totalProjects: 5,
  totalTestCases: 342,
  totalReports: 128,
  avgCoverage: 87.5,
  recentTests: [
    { name: '电商平台 API', count: 156, passed: 142, date: '今天' },
    { name: '用户认证服务', count: 89, passed: 85, date: '昨天' },
    { name: '数据分析工具', count: 67, passed: 62, date: '2天前' },
    { name: '支付系统', count: 30, passed: 28, date: '3天前' }
  ]
}
