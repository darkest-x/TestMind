import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, TestCaseIcon, CodeIcon, UserIcon, SettingsIcon, SunIcon, MoonIcon } from '../icons';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: '仪表板', icon: HomeIcon },
    { path: '/projects', label: '项目', icon: CodeIcon },
    { path: '/generate', label: '生成测试', icon: TestCaseIcon },
    { path: '/users', label: '用户', icon: UserIcon },
    { path: '/settings', label: '设置', icon: SettingsIcon },
  ];

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* 侧边栏 */}
      <aside className={`w-64 border-r flex-shrink-0 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className={`p-6 border-b transition-colors duration-300 ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <span className="text-blue-500">Test</span>Mind
          </h1>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>智能测试生成平台</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-blue-900/30 text-blue-400'
                      : 'bg-blue-50 text-blue-700'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-500' : ''}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={`absolute bottom-0 w-64 p-4 border-t transition-colors duration-300 ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
            theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
          }`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white font-medium">
              AD
            </div>
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Admin User</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>admin@testmind.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部栏 */}
        <header className={`border-b px-8 py-4 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              {title && <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h2>}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
              >
                {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
              <button className={`p-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
