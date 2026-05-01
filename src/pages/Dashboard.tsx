import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Brain, 
  FileCode, 
  CheckCircle, 
  BarChart3, 
  Sparkles, 
  ChevronRight,
  PlayCircle,
  Clock,
  Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { useApp } from '../contexts/AppContext'
import { testService } from '../services/testService'

const chartData = [
  { name: '周一', tests: 45, coverage: 78 },
  { name: '周二', tests: 62, coverage: 81 },
  { name: '周三', tests: 78, coverage: 83 },
  { name: '周四', tests: 55, coverage: 84 },
  { name: '周五', tests: 90, coverage: 86 },
  { name: '周六', tests: 35, coverage: 85 },
  { name: '周日', tests: 42, coverage: 87.5 },
]

const recentTests = [
  { 
    id: 1, 
    name: '用户登录单元测试', 
    type: 'unit' as const, 
    status: 'passed' as const, 
    time: '2分钟前',
    project: '电商平台 API'
  },
  { 
    id: 2, 
    name: '分页接口边界测试', 
    type: 'boundary' as const, 
    status: 'running' as const, 
    time: '5分钟前',
    project: '电商平台 API'
  },
  { 
    id: 3, 
    name: 'JWT 认证 API 测试', 
    type: 'api' as const, 
    status: 'passed' as const, 
    time: '15分钟前',
    project: '用户认证服务'
  },
  { 
    id: 4, 
    name: '数据处理空值测试', 
    type: 'boundary' as const, 
    status: 'failed' as const, 
    time: '30分钟前',
    project: '数据分析工具'
  },
]

const quickActions = [
  {
    title: '生成单元测试',
    description: '为您的代码自动生成单元测试',
    icon: FileCode,
    color: 'from-blue-500 to-blue-600',
    path: '/generate?type=unit'
  },
  {
    title: '生成 API 测试',
    description: '自动测试 RESTful API 接口',
    icon: Zap,
    color: 'from-green-500 to-green-600',
    path: '/generate?type=api'
  },
  {
    title: '生成边界测试',
    description: '智能生成边界和极限情况测试',
    icon: Sparkles,
    color: 'from-purple-500 to-purple-600',
    path: '/generate?type=boundary'
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'passed': return 'text-green-600 bg-green-50'
    case 'failed': return 'text-red-600 bg-red-50'
    case 'running': return 'text-yellow-600 bg-yellow-50'
    case 'pending': return 'text-gray-600 bg-gray-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'unit': return '单元测试'
    case 'api': return '接口测试'
    case 'boundary': return '边界测试'
    default: return type
  }
}

export const Dashboard: React.FC = () => {
  const { user } = useApp()
  const [stats, setStats] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const loadStats = async () => {
      const data = await testService.getDashboardStats()
      setStats(data)
      setLoading(false)
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            欢迎回来，{user?.name}！
          </h1>
          <p className="text-gray-600">
            这是您的测试生成管理仪表盘，查看最新的测试情况和统计数据
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: '总项目数', value: stats?.totalProjects || 0, icon: FileCode, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: '测试用例', value: stats?.totalTestCases || 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: '测试报告', value: stats?.totalReports || 0, icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: '平均覆盖率', value: `${stats?.avgCoverage || 0}%`, icon: Brain, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">测试用例生成趋势</h3>
                  <p className="text-sm text-gray-600">近 7 天测试生成和覆盖率变化</p>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorTests" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="tests" 
                      stroke="#0ea5e9" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorTests)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="coverage" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="transparent" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Recent Tests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">最近测试</h3>
                  <p className="text-sm text-gray-600">您最近运行和生成的测试用例</p>
                </div>
                <Link
                  to="/projects"
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  查看全部
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-4">
                {recentTests.map((test) => (
                  <div
                    key={test.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        test.type === 'unit' ? 'bg-blue-100' :
                        test.type === 'api' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        {test.type === 'unit' ? <FileCode className="w-5 h-5 text-blue-600" /> :
                         test.type === 'api' ? <Zap className="w-5 h-5 text-green-600" /> :
                         <Sparkles className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{test.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{test.project}</span>
                          <span>•</span>
                          <span>{getTypeLabel(test.type)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {test.time}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                        {test.status === 'passed' ? '通过' :
                         test.status === 'failed' ? '失败' :
                         test.status === 'running' ? '运行中' :
                         '待处理'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">快速操作</h3>
                <p className="text-sm text-gray-600">使用 AI 快速生成测试用例</p>
              </div>
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={index}
                      to={action.path}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-500">{action.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                    </Link>
                  )
                })}
              </div>
            </motion.div>

            {/* AI Usage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">AI 测试生成</h3>
                  <p className="text-primary-100 text-sm">智能分析您的代码</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>本月 Token 使用</span>
                    <span className="font-medium">680,000 / 1,000,000</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{ width: '68%' }}></div>
                  </div>
                </div>
                <p className="text-sm text-primary-100">
                  测试用例组合爆炸消耗了大量 token 😅
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
