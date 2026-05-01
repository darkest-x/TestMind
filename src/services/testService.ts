import { Project, TestCase, TestReport, GenerationConfig } from '../types'
import { mockProjects, mockTestCases, mockTestReports, mockDashboardStats } from './mockData'

export const testService = {
  async getProjects(): Promise<Project[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockProjects
  },

  async getProject(id: string): Promise<Project | undefined> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockProjects.find(p => p.id === id)
  },

  async getTestCases(projectId?: string): Promise<TestCase[]> {
    await new Promise(resolve => setTimeout(resolve, 400))
    if (projectId) {
      return mockTestCases.filter(t => t.projectId === projectId)
    }
    return mockTestCases
  },

  async getTestCase(id: string): Promise<TestCase | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockTestCases.find(t => t.id === id)
  },

  async getTestReports(projectId?: string): Promise<TestReport[]> {
    await new Promise(resolve => setTimeout(resolve, 600))
    if (projectId) {
      return mockTestReports.filter(r => r.projectId === projectId)
    }
    return mockTestReports
  },

  async getDashboardStats() {
    await new Promise(resolve => setTimeout(resolve, 700))
    return mockDashboardStats
  },

  async generateTestCases(
    code: string,
    config: GenerationConfig
  ): Promise<TestCase[]> {
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const newTests: TestCase[] = [
      {
        id: `test-${Date.now()}-1`,
        name: '基础功能测试',
        description: '测试核心功能是否正常工作',
        type: config.testType,
        status: 'pending',
        code: `// Auto-generated test case
describe('Generated Tests', () => {
  test('basic functionality', () => {
    // Test logic here
  })
})`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['ai-generated', config.testType],
        projectId: 'project-1'
      }
    ]
    
    return newTests
  },

  async createProject(project: Omit<Project, 'id' | 'testCases' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 800))
    return {
      ...project,
      id: `project-${Date.now()}`,
      testCases: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },

  async runTests(testCaseIds: string[]): Promise<TestReport> {
    await new Promise(resolve => setTimeout(resolve, 2000))
    return {
      id: `report-${Date.now()}`,
      projectId: 'project-1',
      totalTests: testCaseIds.length,
      passed: Math.floor(testCaseIds.length * 0.9),
      failed: Math.floor(testCaseIds.length * 0.08),
      skipped: Math.floor(testCaseIds.length * 0.02),
      coverage: 85.5,
      duration: 15.3,
      createdAt: new Date().toISOString(),
      testCases: []
    }
  }
}
