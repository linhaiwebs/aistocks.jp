import { TrendingUp, TrendingDown } from 'lucide-react';
import { StockInfo, StockPrice } from '../types/stock';

interface SplitStockCardProps {
  info: StockInfo;
  latestPrice?: StockPrice;
}

export default function SplitStockCard({ info, latestPrice }: SplitStockCardProps) {
  const isPositive = info.change.includes('+') || parseFloat(info.change) > 0;
  const changeColor = isPositive ? 'text-green-400' : info.change === '0.0' ? 'text-gray-400' : 'text-red-400';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="relative mx-4 my-6">
      <div className="relative bg-gradient-to-br from-blue-900/50 to-blue-950/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>

        <div className="relative flex" style={{ minHeight: '180px' }}>
          <div className="w-[40%] relative flex flex-col justify-between p-4 border-r border-white/30">
            <div className="absolute top-0 right-0 w-3 h-3 bg-white rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-white rounded-full transform translate-x-1/2 translate-y-1/2"></div>

            <div className="space-y-1">
              <div className="text-white text-base sm:text-lg font-bold truncate">{info.name}</div>
              <div className="text-blue-300 text-sm font-medium">{info.code}</div>
              <div className="text-blue-200 text-xs">{info.timestamp}</div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-2"></div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-white text-3xl sm:text-4xl font-black">{info.price}</span>
                <TrendIcon className={`w-6 h-6 ${isPositive ? 'text-green-400' : 'text-red-400'}`} />
              </div>
              <div className={`flex items-center gap-2 text-sm font-bold ${changeColor}`}>
                <span>{info.change}</span>
                <span>({info.changePercent})</span>
              </div>
            </div>
          </div>

          <div className="absolute left-[40%] top-1/2 transform -translate-y-1/2 w-px h-[70%] bg-white/40"></div>

          <div className="w-[60%] p-4 flex items-center">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 w-full">
              <div className="space-y-0.5">
                <div className="text-blue-300 text-xs font-medium">始値</div>
                <div className="text-white text-sm font-bold">{latestPrice?.open || info.price}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-blue-300 text-xs font-medium">高値</div>
                <div className="text-white text-sm font-bold">{latestPrice?.high || info.price}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-blue-300 text-xs font-medium">安値</div>
                <div className="text-white text-sm font-bold">{latestPrice?.low || info.price}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-blue-300 text-xs font-medium">終値</div>
                <div className="text-white text-sm font-bold">{latestPrice?.close || info.price}</div>
              </div>
              <div className="space-y-0.5 col-span-2">
                <div className="text-blue-300 text-xs font-medium">出来高</div>
                <div className="text-white text-sm font-bold">{latestPrice?.volume || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
