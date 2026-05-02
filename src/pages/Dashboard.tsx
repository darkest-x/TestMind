import React from 'react';
import { Layout } from '../components/layout/Layout';
import { TestCaseIcon, CodeIcon, TrendUpIcon, UserIcon } from '../components/icons';
import { useTheme } from '../contexts/ThemeContext';

export const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  
  const stats = [
    { label: '总测试用例', value: '1,568', icon: TestCaseIcon, color: 'from-blue-500 to-blue-400' },
    { label: '自动化覆盖率', value: '89.1%', icon: TrendUpIcon, color: 'from-green-500 to-green-400' },
    { label: '支持的语言', value: '8', icon: CodeIcon, color: 'from-purple-500 to-purple-400' },
    { label: '测试用户', value: '1,056', icon: UserIcon, color: 'from-orange-500 to-orange-400' },
  ];

  const recentActivity = [
    { id: 1, action: '生成了单元测试', target: 'PaymentGateway.java', time: '5 分钟前', status: 'success' },
    { id: 2, action: '生成了接口测试', target: 'RealTimeChat.go', time: '15 分钟前', status: 'success' },
    { id: 3, action: '生成了边界测试', target: 'main.py', time: '1 小时前', status: 'pending' },
    { id: 4, action: '运行了测试套件', target: '项目 TestMind', time: '2 小时前', status: 'error' },
    { id: 5, action: '导入了测试文件', target: 'UserServiceTest.java', time: '3 小时前', status: 'success' },
    { id: 6, action: '添加了新贡献者', target: 'Chen Jie', time: '4 小时前', status: 'info' },
  ];

  const projects = [
    { id: 1, name: 'DocuForge', progress: 75, status: 'active', type: '前端' },
    { id: 2, name: 'TestMind', progress: 85, status: 'active', type: '多语言' },
    { id: 3, name: 'AuthSystem', progress: 45, status: 'pending', type: '后端' },
    { id: 4, name: 'RealTimeChat', progress: 68, status: 'active', type: '实时' },
  ];

  return (
    <Layout title="仪表板">
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                  <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 最近活动 */}
          <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>最近活动</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <div className={`mt-1 w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                      <span className="font-medium">{activity.action}</span> 针对 {activity.target}
                    </p>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 项目进度 */}
          <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>项目进度</h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className={`p-4 rounded-lg transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{project.name}</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{project.type}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      project.status === 'active' 
                        ? theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                        : theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status === 'active' ? '进行中' : '待处理'}
                    </span>
                  </div>
                  <div className={`w-full rounded-full h-2 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <p className={`text-xs mt-1 text-right ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{project.progress}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className={`rounded-xl shadow-sm border p-6 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>快速操作</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className={`p-4 border-2 border-dashed rounded-lg transition-all text-center ${
              theme === 'dark'
                ? 'border-gray-600 hover:border-blue-500 hover:bg-blue-900/20'
                : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
            }`}>
              <TestCaseIcon className={`w-8 h-8 mx-auto mb-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>生成单元测试</p>
            </button>
            <button className={`p-4 border-2 border-dashed rounded-lg transition-all text-center ${
              theme === 'dark'
                ? 'border-gray-600 hover:border-green-500 hover:bg-green-900/20'
                : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
            }`}>
              <CodeIcon className={`w-8 h-8 mx-auto mb-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>生成接口测试</p>
            </button>
            <button className={`p-4 border-2 border-dashed rounded-lg transition-all text-center ${
              theme === 'dark'
                ? 'border-gray-600 hover:border-purple-500 hover:bg-purple-900/20'
                : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
            }`}>
              <TrendUpIcon className={`w-8 h-8 mx-auto mb-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>生成边界测试</p>
            </button>
            <button className={`p-4 border-2 border-dashed rounded-lg transition-all text-center ${
              theme === 'dark'
                ? 'border-gray-600 hover:border-orange-500 hover:bg-orange-900/20'
                : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50'
            }`}>
              <UserIcon className={`w-8 h-8 mx-auto mb-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`} />
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>导入测试文件</p>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
