import { useEffect, useState } from 'react';
import RobotScholarIcon from './RobotScholarIcon';

export default function DiagnosisProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const animateProgress = () => {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) {
            return prev + Math.random() * 15;
          } else if (prev < 98) {
            return prev + Math.random() * 2;
          }
          return prev;
        });
      }, 100);
    };

    animateProgress();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-[#1a0f3e] via-[#2d1b5e] to-[#1a0f3e] border-2 border-orange-500/50 rounded-2xl shadow-2xl p-8">
        <RobotScholarIcon />

        <div className="mb-6">
          <h3 className="text-xl font-bold text-white mb-2 text-center">AI診断を実行中</h3>
          <p className="text-sm text-orange-300 text-center">市場データを分析しています...</p>
        </div>

        <div className="relative w-full h-3 bg-gray-800/50 rounded-full overflow-hidden mb-3 border border-orange-500/30">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 ease-out shadow-lg shadow-orange-500/50"
            style={{ width: `${Math.min(progress, 99)}%` }}
          />
        </div>

        <div className="mb-6 text-center">
          <span className="text-sm font-semibold text-orange-400">
            {Math.floor(Math.min(progress, 99))}%
          </span>
        </div>

        <div className="bg-gray-900/40 border-2 border-orange-500/30 rounded-lg p-6 backdrop-blur-sm">
          <div className="space-y-3 text-sm">
            <p className="text-white font-semibold text-center text-base">
              📊 データはAIによって深度分析中です
            </p>
            <p className="text-orange-200 text-center">
              しばらくお待ちください
            </p>
            <div className="pt-3 border-t border-orange-500/30">
              <p className="text-xs text-gray-300 text-center leading-relaxed">
                すべてのデータは公開されている市場情報を使用しており、データの真実性と有効性を保証します。本分析は最新のAI技術により、財務指標、業界動向、市場トレンドを総合的に評価しています。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
