import React from 'react'

export const Search: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">搜索</h1>
        <p className="text-gray-600 mb-8">搜索测试用例、项目和测试报告</p>
        
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <div className="text-center py-16">
            <p className="text-gray-500">搜索功能开发中...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
