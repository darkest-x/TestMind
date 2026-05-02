import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { CodeIcon, PlusIcon, ViewGridIcon, ViewListIcon, FilterIcon, EditIcon, TrashIcon, PlayIcon } from '../components/icons';

interface Project {
  id: number;
  name: string;
  description: string;
  language: string;
  testCases: number;
  coverage: number;
  status: 'active' | 'pending' | 'completed';
  lastUpdated: string;
  author: string;
}

export const Projects: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  const projects: Project[] = [
    {
      id: 1,
      name: 'DocuForge',
      description: '智能文档生成平台，支持多种文档格式自动生成',
      language: 'TypeScript',
      testCases: 1234,
      coverage: 87.5,
      status: 'active',
      lastUpdated: '2 分钟前',
      author: 'Admin User',
    },
    {
      id: 2,
      name: 'AuthSystem',
      description: '企业级身份认证系统，支持 OAuth2、JWT 等',
      language: 'Java',
      testCases: 856,
      coverage: 76.3,
      status: 'active',
      lastUpdated: '15 分钟前',
      author: 'John Doe',
    },
    {
      id: 3,
      name: 'UserService',
      description: '用户管理微服务，提供用户 CRUD 操作',
      language: 'Go',
      testCases: 432,
      coverage: 92.1,
      status: 'completed',
      lastUpdated: '1 小时前',
      author: 'Mike Chen',
    },
    {
      id: 4,
      name: 'DataProcessor',
      description: '大数据处理流水线，支持实时数据处理',
      language: 'Python',
      testCases: 234,
      coverage: 68.9,
      status: 'pending',
      lastUpdated: '2 小时前',
      author: 'Jane Smith',
    },
    {
      id: 5,
      name: 'AnalyticsAPI',
      description: '数据分析 API，提供多种数据统计功能',
      language: 'Rust',
      testCases: 567,
      coverage: 81.2,
      status: 'active',
      lastUpdated: '3 小时前',
      author: 'Sarah Wilson',
    },
    {
      id: 6,
      name: 'NotificationService',
      description: '通知服务，支持邮件、短信、推送等多种渠道',
      language: 'PHP',
      testCases: 189,
      coverage: 59.4,
      status: 'pending',
      lastUpdated: '5 小时前',
      author: 'Admin User',
    },
  ];

  const languages = ['all', 'TypeScript', 'Java', 'Go', 'Python', 'Rust', 'PHP'];

  const filteredProjects = projects.filter((project) => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesLanguage = languageFilter === 'all' || project.language === languageFilter;
    return matchesStatus && matchesLanguage;
  });

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
    };
    const labels = {
      active: '进行中',
      pending: '待处理',
      completed: '已完成',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return 'text-green-600';
    if (coverage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Layout title="项目管理">
      <div className="space-y-6">
        {/* 工具栏 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">所有状态</option>
                <option value="active">进行中</option>
                <option value="pending">待处理</option>
                <option value="completed">已完成</option>
              </select>
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === 'all' ? '所有语言' : lang}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ViewGridIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ViewListIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="w-5 h-5" />
              <span>新建项目</span>
            </button>
          </div>
        </div>

        {/* 网格视图 */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
                      <CodeIcon className="w-6 h-6 text-white" />
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">编程语言</span>
                      <span className="font-medium text-gray-900">{project.language}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">测试用例</span>
                      <span className="font-medium text-gray-900">{project.testCases.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">覆盖率</span>
                      <span className={`font-medium ${getCoverageColor(project.coverage)}`}>{project.coverage}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">最后更新</span>
                      <span className="text-gray-600">{project.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white text-xs font-medium">
                        {project.author.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-600">{project.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <PlayIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 列表视图 */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      项目
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      语言
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      测试用例
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      覆盖率
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      最后更新
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
                              <CodeIcon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-500">{project.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{project.language}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{project.testCases.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getCoverageColor(project.coverage)}`}>
                          {project.coverage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(project.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{project.lastUpdated}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                            <PlayIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 分页 */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            显示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredProjects.length}</span> 条结果，共 <span className="font-medium">{filteredProjects.length}</span> 条
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>
              上一页
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50" disabled>
              下一页
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
