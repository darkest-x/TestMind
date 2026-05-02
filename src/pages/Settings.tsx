import React from 'react';
import { Layout } from '../components/layout/Layout';
import { UserIcon, SettingsIcon, CodeIcon, BellIcon, ShieldIcon } from '../components/icons';

export const Settings: React.FC = () => {
  const settingsSections = [
    {
      id: 'profile',
      icon: UserIcon,
      title: '个人资料',
      description: '管理您的个人信息和头像',
    },
    {
      id: 'notifications',
      icon: BellIcon,
      title: '通知设置',
      description: '配置您希望接收的通知类型',
    },
    {
      id: 'security',
      icon: ShieldIcon,
      title: '安全设置',
      description: '修改密码和配置双重验证',
    },
    {
      id: 'api',
      icon: CodeIcon,
      title: 'API 配置',
      description: '管理 API 密钥和 Webhook 设置',
    },
  ];

  return (
    <Layout title="设置">
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {settingsSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{section.title}</h3>
                    <p className="text-gray-600">{section.description}</p>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">个人资料</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">用户名</label>
              <input
                type="text"
                defaultValue="admin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">电子邮箱</label>
              <input
                type="email"
                defaultValue="admin@testmind.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">名字</label>
              <input
                type="text"
                defaultValue="Admin"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">姓氏</label>
              <input
                type="text"
                defaultValue="User"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              保存更改
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
