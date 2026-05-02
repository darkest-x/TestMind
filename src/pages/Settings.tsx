import React from 'react';
import { Layout } from '../components/layout/Layout';
import { UserIcon, SettingsIcon, CodeIcon, BellIcon, ShieldIcon } from '../components/icons';
import { useTheme } from '../contexts/ThemeContext';

export const Settings: React.FC = () => {
  const { theme } = useTheme();
  
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
              <div key={section.id} className={`rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold mb-1 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>{section.title}</h3>
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{section.description}</p>
                  </div>
                  <div className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`rounded-xl shadow-sm border p-6 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>个人资料</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>用户名</label>
              <input
                type="text"
                defaultValue="admin"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>电子邮箱</label>
              <input
                type="email"
                defaultValue="admin@testmind.com"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>名字</label>
              <input
                type="text"
                defaultValue="Admin"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>姓氏</label>
              <input
                type="text"
                defaultValue="User"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
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
