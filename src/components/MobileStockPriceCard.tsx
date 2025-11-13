import { TrendingUp, TrendingDown } from 'lucide-react';
import { StockInfo, StockPrice } from '../types/stock';

interface MobileStockPriceCardProps {
  info: StockInfo;
  latestPrice?: StockPrice;
}

export default function MobileStockPriceCard({ info, latestPrice }: MobileStockPriceCardProps) {
  const isPositive = info.change.includes('+') || parseFloat(info.change) > 0;
  const changeColor = isPositive ? 'text-green-500' : info.change === '0.0' ? 'text-gray-400' : 'text-red-500';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      className="rounded-2xl shadow-2xl overflow-hidden bg-cover bg-center relative max-w-4xl mx-auto"
      style={{
        backgroundImage: 'url(/assets/矩形 2 拷贝 3.png)',
      }}
    >
      <div className="absolute inset-0 bg-white/90"></div>

      <div className="relative z-10 p-4 sm:p-5 md:p-6 lg:p-8">
        <div className="flex items-start justify-between mb-4 sm:mb-5 md:mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900">{info.price}</span>
              <TrendIcon className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${isPositive ? 'text-blue-500' : 'text-red-500'}`} />
            </div>
            <div className={`text-lg sm:text-xl md:text-2xl font-bold ${changeColor} flex items-center gap-2`}>
              <span>{info.change}</span>
              <span>{info.changePercent}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-blue-600 font-semibold">初期終値</span>
              <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">{latestPrice?.open || info.price}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-blue-600 font-semibold">高値</span>
              <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">{latestPrice?.high || info.price}</span>
            </div>
          </div>
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-blue-600 font-semibold">当日終値</span>
              <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">{latestPrice?.close || info.price}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-blue-600 font-semibold">売買高</span>
              <span className="text-xs sm:text-sm md:text-base font-semibold text-gray-900">{latestPrice?.volume || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 bg-blue-600 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm sm:text-base font-semibold text-white">{info.name}</span>
          <span className="text-xs sm:text-sm text-blue-100">({info.code})</span>
        </div>
        <span className="text-xs sm:text-sm text-blue-100">{info.timestamp}</span>
      </div>
    </div>
  );
}
