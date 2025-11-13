export default function AIContentDisplay() {
  return (
    <div className="relative mx-4 my-8">
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100, 200, 255, 0.3)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <path
          d="M50,100 Q100,50 150,100 T250,100"
          stroke="rgba(100, 200, 255, 0.4)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
        </path>

        <circle cx="80" cy="80" r="30" fill="none" stroke="rgba(100, 200, 255, 0.3)" strokeWidth="1.5">
          <animate attributeName="r" values="25;35;25" dur="3s" repeatCount="indefinite" />
        </circle>
      </svg>

      <div className="relative bg-gradient-to-br from-blue-900/40 to-indigo-900/40 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none z-0 hidden md:block">
          <div className="relative w-64 h-64 lg:w-80 lg:h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full animate-pulse"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-48 h-48 lg:w-64 lg:h-64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="60" r="30" fill="#4a90e2" opacity="0.8">
                  <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                </circle>

                <rect x="70" y="90" width="60" height="50" rx="5" fill="#5a9ff5" opacity="0.9"/>

                <rect x="50" y="90" width="30" height="60" rx="15" fill="#6ab0ff" opacity="0.8">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 65 120"
                    to="-20 65 120"
                    dur="2s"
                    repeatCount="indefinite"
                    values="0 65 120; -20 65 120; 0 65 120"
                  />
                </rect>

                <rect x="120" y="90" width="30" height="60" rx="15" fill="#6ab0ff" opacity="0.8">
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 135 120"
                    to="20 135 120"
                    dur="2s"
                    repeatCount="indefinite"
                    values="0 135 120; 20 135 120; 0 135 120"
                  />
                </rect>

                <circle cx="85" cy="55" r="5" fill="white" opacity="0.9"/>
                <circle cx="115" cy="55" r="5" fill="white" opacity="0.9"/>

                <circle cx="160" cy="100" r="25" fill="#FFD700" opacity="0.95">
                  <animate attributeName="r" values="22;28;22" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <text x="160" y="108" textAnchor="middle" fill="#000" fontSize="16" fontWeight="bold">AI</text>
              </svg>
            </div>
          </div>
        </div>

        <div className="relative z-10 p-6 sm:p-8 max-w-2xl">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                最先端技術
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                AI診断システム
              </h2>
              <p className="text-blue-200 text-sm leading-relaxed">
                最新の機械学習アルゴリズムを活用し、市場動向を瞬時に分析
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-green-400/30">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-bold text-sm">リスク分析</span>
                </div>
                <p className="text-green-100 text-xs">投資リスクを多角的に評価</p>
              </div>

              <div className="bg-gradient-to-r from-blue-600/80 to-cyan-600/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-blue-400/30">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-bold text-sm">市場反応予測</span>
                </div>
                <p className="text-blue-100 text-xs">市場の反応をリアルタイム予測</p>
              </div>

              <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-sm rounded-lg px-4 py-3 border border-purple-400/30">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-bold text-sm">対反応分析</span>
                </div>
                <p className="text-purple-100 text-xs">投資家心理を深層学習で解析</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
