import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
  Sparkles, 
  FileCode, 
  Zap, 
  Code2, 
  Settings,
  PlayCircle,
  Download,
  Copy,
  CheckCircle2
} from 'lucide-react'
import { motion } from 'framer-motion'
import { testService } from '../services/testService'
import { GenerationConfig, TestCase } from '../types'

const languages = ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust']
const frameworks = ['Jest', 'Vitest', 'pytest', 'JUnit', 'unittest', 'Ginkgo']

export const Generate: React.FC = () => {
  const [searchParams] = useSearchParams()
  const testType = (searchParams.get('type') || 'unit') as 'unit' | 'api' | 'boundary'
  
  const [code, setCode] = React.useState('')
  const [config, setConfig] = React.useState<GenerationConfig>({
    testType: testType,
    coverageTarget: 85,
    complexity: 'medium',
    language: 'TypeScript',
    framework: 'Vitest'
  })
  const [generatedTests, setGeneratedTests] = React.useState<TestCase[]>([])
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const handleGenerate = async () => {
    if (!code.trim()) return
    
    setIsGenerating(true)
    try {
      const tests = await testService.generateTestCases(code, config)
      setGeneratedTests(tests)
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'unit': return FileCode
      case 'api': return Zap
      case 'boundary': return Sparkles
      default: return FileCode
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

  const Icon = getTypeIcon(config.testType)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                生成 {getTypeLabel(config.testType)}
              </h1>
              <p className="text-gray-600">
                上传您的代码，AI 将自动为您生成全面的测试用例
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Code Input */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">输入代码</h3>
                <select
                  value={config.language}
                  onChange={(e) => setConfig({ ...config, language: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                >
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="粘贴您的代码到这里..."
                className="w-full h-96 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </motion.div>

            {/* Generated Tests */}
            {generatedTests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">生成的测试</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(generatedTests.map(t => t.code).join('\n\n'))}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      {copied ? '已复制' : '复制全部'}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      <Download className="w-4 h-4" />
                      下载
                    </button>
                  </div>
                </div>
                {generatedTests.map((test, index) => (
                  <div key={test.id} className="mb-6 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{test.name}</h4>
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                        {getTypeLabel(test.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{test.code}</code>
                    </pre>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Configuration */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">配置选项</h3>
              </div>

              <div className="space-y-6">
                {/* Test Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    测试类型
                  </label>
                  <div className="space-y-2">
                    {(['unit', 'api', 'boundary'] as const).map((type) => {
                      const TypeIcon = getTypeIcon(type)
                      return (
                        <button
                          key={type}
                          onClick={() => setConfig({ ...config, testType: type })}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                            config.testType === type
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <TypeIcon className={`w-5 h-5 ${
                            config.testType === type ? 'text-primary-600' : 'text-gray-400'
                          }`} />
                          <div className="text-left">
                            <p className={`font-medium ${
                              config.testType === type ? 'text-primary-900' : 'text-gray-700'
                            }`}>
                              {getTypeLabel(type)}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Framework */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    测试框架
                  </label>
                  <select
                    value={config.framework}
                    onChange={(e) => setConfig({ ...config, framework: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {frameworks.map(framework => (
                      <option key={framework} value={framework}>{framework}</option>
                    ))}
                  </select>
                </div>

                {/* Coverage Target */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    目标覆盖率: {config.coverageTarget}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={config.coverageTarget}
                    onChange={(e) => setConfig({ ...config, coverageTarget: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                {/* Complexity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    生成复杂度
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setConfig({ ...config, complexity: level })}
                        className={`py-2 px-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                          config.complexity === level
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {level === 'low' ? '简单' : level === 'medium' ? '中等' : '复杂'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Generate Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={handleGenerate}
              disabled={isGenerating || !code.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  正在生成测试...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  开始生成
                </>
              )}
            </motion.button>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-1">
                    关于 Token 使用
                  </h4>
                  <p className="text-sm text-yellow-700">
                    测试用例组合爆炸会消耗大量 token，这是完全合理的。
                    复杂的边界测试需要分析各种极限情况 😅
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
