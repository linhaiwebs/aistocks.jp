import { TrendingUp, TrendingDown } from 'lucide-react';
import { StockInfo, StockPrice } from '../types/stock';

interface StockInfoCard2Props {
  info: StockInfo;
  latestPrice?: StockPrice;
}

export default function StockInfoCard2({ info, latestPrice }: StockInfoCard2Props) {
  const isPositive = info.change.includes('+');
  const changeColor = isPositive ? 'text-green-400' : info.change === '0.0' ? 'text-gray-300' : 'text-red-400';

  return (
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-xl" style={{ backgroundColor: '#061652' }}>
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path
          d="M0,100 Q50,80 100,100 T200,100 T300,100 T400,100 T500,100 T600,100 T700,100 T800,100 T900,100 T1000,100 T1100,100 T1200,100"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M0,150 Q50,130 100,150 T200,150 T300,150 T400,150 T500,150 T600,150 T700,150 T800,150 T900,150 T1000,150 T1100,150 T1200,150"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M0,200 Q50,180 100,200 T200,200 T300,200 T400,200 T500,200 T600,200 T700,200 T800,200 T900,200 T1000,200 T1100,200 T1200,200"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>

      <div className="relative z-10 p-3 sm:p-4 md:p-5">
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 pb-2 sm:pb-3">
          <div className="flex flex-row items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white truncate">{info.name}</span>
            <span className="text-sm sm:text-base md:text-lg text-white/70 flex-shrink-0">{info.code}</span>
          </div>
          <div className="text-[10px] sm:text-xs md:text-sm text-white/70 flex-shrink-0">{info.timestamp}</div>
        </div>

        <div className="border-t border-white/20 mb-3 sm:mb-4"></div>

        <div className="grid grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          <div className="col-span-2 space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] sm:text-xs md:text-sm text-white/60 mb-0.5 sm:mb-1">現在株価</div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white truncate">¥{info.price}</div>
              </div>
              {isPositive ? (
                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-400 flex-shrink-0" />
              ) : (
                <TrendingDown className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-400 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className={`text-base sm:text-lg md:text-xl font-bold ${changeColor}`}>
                {info.change}
              </div>
              <div className={`text-sm sm:text-base md:text-lg font-semibold ${changeColor}`}>
                ({info.changePercent})
              </div>
            </div>
          </div>

          <div className="col-span-3 grid grid-cols-2 gap-2 sm:gap-3">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs md:text-sm text-label-green font-semibold">始値</span>
                <span className="text-xs sm:text-sm md:text-base text-white font-medium truncate">{latestPrice?.open || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs md:text-sm text-label-green font-semibold">高値</span>
                <span className="text-xs sm:text-sm md:text-base text-white font-medium truncate">{latestPrice?.high || 'N/A'}</span>
              </div>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs md:text-sm text-label-green font-semibold">安値</span>
                <span className="text-xs sm:text-sm md:text-base text-white font-medium truncate">{latestPrice?.low || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs md:text-sm text-label-green font-semibold">終値</span>
                <span className="text-xs sm:text-sm md:text-base text-white font-medium truncate">{latestPrice?.close || info.price}</span>
              </div>
            </div>

            <div className="col-span-2 space-y-1.5 sm:space-y-2 mt-0.5 sm:mt-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs md:text-sm text-label-green font-semibold">前日比</span>
                <span className={`text-xs sm:text-sm md:text-base font-medium ${changeColor} truncate`}>{info.change} ({info.changePercent})</span>
              </div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] sm:text-xs md:text-sm text-label-green font-semibold">売買高(株)</span>
                <span className="text-xs sm:text-sm md:text-base text-white font-medium truncate">{latestPrice?.volume || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
