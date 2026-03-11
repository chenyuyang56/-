import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Layout, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  ChevronRight,
  Loader2,
  Copy,
  Check,
  AppWindow
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generatePopupRecommendation, PopupRecommendation } from './services/geminiService';

export default function App() {
  const [scenario, setScenario] = useState('');
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PopupRecommendation | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!scenario.trim()) return;
    setLoading(true);
    try {
      const recommendation = await generatePopupRecommendation(scenario, requirements);
      setResult(recommendation);
    } catch (error) {
      console.error('Error generating recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `
Popup Type: ${result.type} (${result.category})
Purpose: ${result.purpose}
Content:
${result.content.title ? `Title: ${result.content.title}` : ''}
Message: ${result.content.message}
${result.content.primaryButton ? `Primary Action: ${result.content.primaryButton}` : ''}
${result.content.secondaryButton ? `Secondary Action: ${result.content.secondaryButton}` : ''}
${result.content.options ? `Options: ${result.content.options.join(', ')}` : ''}

Rationale: ${result.rationale}
Design Suggestions: ${result.designSuggestions}
    `.trim();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <AppWindow className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">弹窗生成器</h1>
          </div>
          <div className="text-xs font-mono text-gray-400 uppercase tracking-widest">
            AI-Powered UX Assistant
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Input Section */}
          <div className="lg:col-span-5 space-y-8">
            <section className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Layout className="w-4 h-4 text-indigo-500" />
                  应用场景 (Scenario)
                </label>
                <textarea
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  placeholder="例如：用户尝试删除一个重要的项目文件夹..."
                  className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  具体需求 (Requirements)
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="例如：需要二次确认，强调不可恢复性，提供取消选项..."
                  className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm placeholder:text-gray-400"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !scenario.trim()}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    生成方案 <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </section>

            {/* Quick Tips */}
            <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" /> 设计小贴士
              </h3>
              <ul className="text-xs text-indigo-700 space-y-2 leading-relaxed">
                <li>• 模态弹窗用于需要用户立即关注的操作。</li>
                <li>• 非模态弹窗（如 Toast）适合不打断流程的状态反馈。</li>
              </ul>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!result && !loading ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 p-12 text-center"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm">输入场景并点击生成，AI 将为您推荐最佳的弹窗方案</p>
                </motion.div>
              ) : loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4"
                >
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-100 rounded-full"></div>
                    <div className="w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin absolute top-0"></div>
                  </div>
                  <p className="text-sm font-medium text-gray-500 animate-pulse">正在分析场景并构思方案...</p>
                </motion.div>
              ) : (
                result && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    {/* Main Result Card */}
                    <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                      <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${result.category === 'Modal' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                              {result.category}
                            </span>
                            <h2 className="text-2xl font-bold text-gray-900">{result.type}</h2>
                          </div>
                          <p className="text-sm text-gray-500">{result.purpose} 类弹窗</p>
                        </div>
                        <button 
                          onClick={copyToClipboard}
                          className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all text-gray-400 hover:text-indigo-600"
                        >
                          {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>

                      <div className="p-8 space-y-8">
                        {/* Content Preview */}
                        <div className="space-y-4">
                          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">推荐内容</h3>
                          <div className="p-6 bg-gray-900 rounded-2xl text-white space-y-4 shadow-inner">
                            {result.content.title && (
                              <div className="text-lg font-bold border-b border-white/10 pb-2">{result.content.title}</div>
                            )}
                            <p className="text-sm text-gray-300 leading-relaxed">{result.content.message}</p>
                            
                            {result.content.options ? (
                              <div className="space-y-2 pt-2">
                                {result.content.options.map((opt, i) => (
                                  <div key={i} className="py-3 px-4 bg-white/5 rounded-xl text-sm hover:bg-white/10 transition-colors cursor-default flex items-center justify-between">
                                    {opt} <ChevronRight className="w-4 h-4 opacity-30" />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="flex gap-3 pt-4">
                                {result.content.secondaryButton && (
                                  <div className="flex-1 py-2.5 px-4 bg-white/10 rounded-lg text-center text-sm font-medium">
                                    {result.content.secondaryButton}
                                  </div>
                                )}
                                {result.content.primaryButton && (
                                  <div className="flex-1 py-2.5 px-4 bg-indigo-500 rounded-lg text-center text-sm font-bold">
                                    {result.content.primaryButton}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Rationale & Design */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-green-500" /> 推荐理由
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{result.rationale}</p>
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                              <AlertCircle className="w-3 h-3 text-indigo-500" /> 设计建议
                            </h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{result.designSuggestions}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visual Reference */}
                    <div className="p-6 bg-white border border-gray-200 rounded-3xl flex items-center gap-6">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Layout className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">交互模型：{result.category === 'Modal' ? '强打断 (Interruptive)' : '轻提示 (Non-interruptive)'}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {result.category === 'Modal' 
                            ? '用户必须处理此弹窗才能继续后续操作，适用于关键决策。' 
                            : '用户可以忽略此提示，不影响当前流程，适用于状态反馈。'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
