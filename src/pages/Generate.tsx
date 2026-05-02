import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { TestCaseIcon, CodeIcon, TrendUpIcon, PlayIcon, UploadIcon, DownloadIcon, CheckCircleIcon } from '../components/icons';

type TestType = 'unit' | 'api' | 'boundary';

export const Generate: React.FC = () => {
  const [selectedType, setSelectedType] = useState<TestType>('unit');
  const [language, setLanguage] = useState('Java');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const languages = ['Java', 'Python', 'JavaScript', 'Go', 'Rust', 'PHP', 'C++', 'TypeScript'];

  const testTypes = [
    {
      type: 'unit' as TestType,
      icon: TestCaseIcon,
      name: '单元测试',
      description: '针对代码中的单个函数或类进行测试',
      color: 'from-blue-500 to-blue-400',
      tokenUsage: '~1,000-5,000 tokens',
    },
    {
      type: 'api' as TestType,
      icon: CodeIcon,
      name: '接口测试',
      description: '测试API端点的请求和响应',
      color: 'from-green-500 to-green-400',
      tokenUsage: '~3,000-10,000 tokens',
    },
    {
      type: 'boundary' as TestType,
      icon: TrendUpIcon,
      name: '边界测试',
      description: '测试输入值的边界条件',
      color: 'from-purple-500 to-purple-400',
      tokenUsage: '~5,000-20,000 tokens',
    },
  ];

  const startGeneration = () => {
    setIsGenerating(true);
    setIsComplete(false);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setIsComplete(true);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  return (
    <Layout title="生成测试">
      <div className="space-y-6">
        {/* 测试类型选择 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testTypes.map((testType) => (
            <div
              key={testType.type}
              onClick={() => setSelectedType(testType.type)}
              className={`cursor-pointer rounded-xl border-2 p-6 transition-all ${
                selectedType === testType.type
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${testType.color} flex items-center justify-center mb-4`}>
                <testType.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{testType.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{testType.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>{testType.tokenUsage}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 配置区域 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">测试配置</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">编程语言</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">目标文件/目录</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="选择文件或目录..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <UploadIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">额外配置（可选）</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="includeComments" className="w-4 h-4 text-blue-600 rounded" />
                <label htmlFor="includeComments" className="text-sm text-gray-700">包含注释</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="autoFormat" className="w-4 h-4 text-blue-600 rounded" />
                <label htmlFor="autoFormat" className="text-sm text-gray-700">自动格式化</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="addToSuite" className="w-4 h-4 text-blue-600 rounded" />
                <label htmlFor="addToSuite" className="text-sm text-gray-700">添加到测试套件</label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">特殊要求（可选）</label>
            <textarea
              rows={3}
              placeholder="描述您希望测试用例具备的特殊要求..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 生成过程 */}
        {(isGenerating || isComplete) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">生成进度</h3>
            
            {isGenerating ? (
              <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>正在生成测试用例...</span>
                  <span>{Math.min(progress, 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span>分析代码结构</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">生成完成！</h4>
                <p className="text-gray-600 mb-6">已成功生成 24 个测试用例</p>
                <div className="flex justify-center gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <DownloadIcon className="w-5 h-5" />
                    <span>下载测试文件</span>
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <PlayIcon className="w-5 h-5" />
                    <span>运行测试</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 操作按钮 */}
        {!isGenerating && !isComplete && (
          <div className="flex justify-end gap-4">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              重置
            </button>
            <button
              onClick={startGeneration}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlayIcon className="w-5 h-5" />
              <span>开始生成</span>
            </button>
          </div>
        )}

        {isComplete && (
          <div className="flex justify-end">
            <button
              onClick={() => {
                setIsComplete(false);
                setProgress(0);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlayIcon className="w-5 h-5" />
              <span>生成更多测试</span>
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};
