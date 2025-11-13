import { ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function RegistrationInfoSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl max-w-4xl mx-auto" style={{ backgroundColor: '#061652' }}>
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path
          d="M0,50 Q60,30 120,50 T240,50 T360,50 T480,50 T600,50 T720,50"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M0,80 Q60,60 120,80 T240,80 T360,80 T480,80 T600,80 T720,80"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      <div className="relative z-10 p-4 sm:p-5 md:p-6">
        <button className="w-full bg-gradient-to-r from-deep-blue to-medium-blue text-white font-bold py-3 sm:py-3.5 px-5 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] min-h-[48px] sm:min-h-[52px] touch-manipulation">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <ChevronsLeft className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="text-base sm:text-lg md:text-xl">登録情報</span>
            <ChevronsRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          </div>
        </button>

        <p className="text-xs sm:text-sm text-white/80 text-center mt-3 sm:mt-4 leading-relaxed px-1 sm:px-2">
          当サービス提供者は金融商品取引業者（投資助言・代理業、投資運用業等）ではありません。金融商品取引法第29条の登録を受けた事業者ではないため、個別の投資助言を行うことはできません。
        </p>
      </div>
    </div>
  );
}
