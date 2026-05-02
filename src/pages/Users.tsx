import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { SearchIcon, PlusIcon, EditIcon, TrashIcon, FilterIcon } from '../components/icons';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  role: 'admin' | 'developer' | 'viewer';
  language: string;
  projects: number;
  testCases: number;
}

export const Users: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'developer' | 'viewer'>('all');

  const users: User[] = [
    {
      id: 1,
      username: 'admin',
      email: 'admin@testmind.com',
      firstName: '管理员',
      lastName: '用户',
      active: true,
      role: 'admin',
      language: 'Java',
      projects: 12,
      testCases: 1234,
    },
    {
      id: 2,
      username: 'john_doe',
      email: 'john@testmind.com',
      firstName: 'John',
      lastName: 'Doe',
      active: true,
      role: 'developer',
      language: 'Python',
      projects: 8,
      testCases: 856,
    },
    {
      id: 3,
      username: 'jane_smith',
      email: 'jane@testmind.com',
      firstName: 'Jane',
      lastName: 'Smith',
      active: false,
      role: 'developer',
      language: 'JavaScript',
      projects: 5,
      testCases: 432,
    },
    {
      id: 4,
      username: 'mike_chen',
      email: 'mike@testmind.com',
      firstName: 'Mike',
      lastName: 'Chen',
      active: true,
      role: 'developer',
      language: 'Go',
      projects: 6,
      testCases: 678,
    },
    {
      id: 5,
      username: 'sarah_wilson',
      email: 'sarah@testmind.com',
      firstName: 'Sarah',
      lastName: 'Wilson',
      active: true,
      role: 'viewer',
      language: 'Rust',
      projects: 3,
      testCases: 234,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch = !search ||
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase());
    const matchesActive = activeFilter === 'all' || (activeFilter === 'active' && user.active) || (activeFilter === 'inactive' && !user.active);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesActive && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      developer: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800',
    };
    const labels = {
      admin: '管理员',
      developer: '开发者',
      viewer: '查看者',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[role as keyof typeof colors]}`}>
        {labels[role as keyof typeof labels]}
      </span>
    );
  };

  return (
    <Layout title="用户管理">
      <div className="space-y-6">
        {/* 搜索和过滤器 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索用户..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">所有状态</option>
                <option value="active">活跃</option>
                <option value="inactive">不活跃</option>
              </select>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">所有角色</option>
                <option value="admin">管理员</option>
                <option value="developer">开发者</option>
                <option value="viewer">查看者</option>
              </select>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <PlusIcon className="w-5 h-5" />
              <span>添加用户</span>
            </button>
          </div>
        </div>

        {/* 用户表格 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    角色
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    编程语言
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    项目数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    测试用例
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white font-medium">
                            {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500">@{user.username}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{user.language}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{user.projects}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{user.testCases.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.active ? '活跃' : '不活跃'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
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

        {/* 分页 */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            显示 <span className="font-medium">1</span> 到 <span className="font-medium">{filteredUsers.length}</span> 条结果，共 <span className="font-medium">{filteredUsers.length}</span> 条
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
