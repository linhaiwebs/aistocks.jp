import { Brain, TrendingUp } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative z-20 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 border-b border-blue-800/30 shadow-lg">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent drop-shadow-lg">
              AI株式診断
            </h1>

            <div className="flex items-center gap-3 py-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl blur-md opacity-60 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-2.5 rounded-xl shadow-2xl">
                  <Brain className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <p className="text-xs text-blue-300/70 font-medium tracking-wide">
              最先端のAI技術で分析
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-900/30 rounded-lg border border-blue-700/30 backdrop-blur-sm">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-blue-200 font-medium">
              リアルタイム分析
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
