import React from 'react'

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden lg:block w-64 bg-gray-50 border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          快速访问
        </h3>
        <div className="space-y-2">
          {/* Quick access items */}
        </div>
      </div>
    </aside>
  )
}
