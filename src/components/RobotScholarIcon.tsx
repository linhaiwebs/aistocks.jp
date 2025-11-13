import { BookOpen, Glasses } from 'lucide-react';

export default function RobotScholarIcon() {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 shadow-blue-glow-lg">
          <div className="relative">
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <rect x="16" y="20" width="32" height="28" rx="4" fill="currentColor" />

              <circle cx="26" cy="32" r="3" fill="#3b82f6" />
              <circle cx="38" cy="32" r="3" fill="#3b82f6" />

              <path
                d="M 20 28 Q 22 26 26 26 L 28 26 Q 30 26 30 28"
                stroke="#1e3a8a"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M 34 28 Q 36 26 38 26 L 40 26 Q 44 26 44 28"
                stroke="#1e3a8a"
                strokeWidth="2"
                fill="none"
              />

              <rect x="14" y="16" width="4" height="8" rx="2" fill="currentColor" />
              <rect x="46" y="16" width="4" height="8" rx="2" fill="currentColor" />

              <path
                d="M 28 40 Q 32 42 36 40"
                stroke="#1e3a8a"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <circle cx="32" cy="12" r="4" fill="#fbbf24" />
              <path
                d="M 30 10 L 28 6 M 34 10 L 36 6"
                stroke="#fbbf24"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-white/90 rounded-lg px-2 py-1 shadow-md border border-blue-300">
              <Glasses className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 animate-bounce">
          <div className="bg-blue-100 rounded-lg p-3 shadow-lg border-2 border-blue-400">
            <BookOpen className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
        </div>

        <div className="absolute -left-8 top-4 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute -right-10 bottom-4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute left-12 -top-4 w-2 h-2 bg-blue-300 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.6s' }}></div>
      </div>
    </div>
  );
}
