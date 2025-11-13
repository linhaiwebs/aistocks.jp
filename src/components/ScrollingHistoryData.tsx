import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StockPrice } from '../types/stock';

interface ScrollingHistoryDataProps {
  prices: StockPrice[];
  stockName: string;
}

export default function ScrollingHistoryData({ prices, stockName }: ScrollingHistoryDataProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const calculateTrend = (index: number): 'up' | 'down' | 'neutral' => {
    if (index === 0 || !prices[index + 1]) return 'neutral';

    const current = parseFloat(prices[index].close.replace(/,/g, ''));
    const previous = parseFloat(prices[index + 1].close.replace(/,/g, ''));

    if (isNaN(current) || isNaN(previous)) return 'neutral';

    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'neutral';
  };

  const calculateChangePercent = (current: string, previous: string): string => {
    const curr = parseFloat(current.replace(/,/g, ''));
    const prev = parseFloat(previous.replace(/,/g, ''));

    if (isNaN(curr) || isNaN(prev) || prev === 0) return '0.00';

    const change = ((curr - prev) / prev) * 100;
    return change.toFixed(2);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prices.length === 0) return;

    const itemHeight = 60;
    const totalHeight = prices.length * itemHeight;

    let animationId: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const speed = 20;
      const newPosition = (elapsed / speed) % totalHeight;

      setScrollPosition(newPosition);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [prices]);

  if (prices.length === 0) {
    return (
      <div className="mx-4 my-6 bg-gray-800/50 rounded-2xl p-8 text-center">
        <p className="text-gray-400">履歴データがありません</p>
      </div>
    );
  }

  const duplicatedPrices = [...prices, ...prices];

  return (
    <div className="mx-4 my-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
          <h3 className="text-white font-bold text-base">
            {stockName} - 取引履歴
          </h3>
        </div>

        <div
          ref={containerRef}
          className="relative h-[240px] overflow-hidden bg-gradient-to-b from-gray-900/50 to-gray-800/50"
        >
          <div
            className="absolute w-full"
            style={{
              transform: `translateY(-${scrollPosition}px)`,
            }}
          >
            {duplicatedPrices.map((price, index) => {
              const trend = calculateTrend(index % prices.length);
              const nextIndex = (index % prices.length) + 1;
              const changePercent = nextIndex < prices.length
                ? calculateChangePercent(price.close, prices[nextIndex].close)
                : '0.00';

              const isPositive = parseFloat(changePercent) > 0;
              const isNegative = parseFloat(changePercent) < 0;

              return (
                <div
                  key={`${index}-${price.date}`}
                  className="flex items-center justify-between px-4 py-3 border-b border-blue-500/20 h-[60px]"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-blue-200 text-xs font-medium w-20">
                      {price.date}
                    </div>
                    <div className="text-white text-sm font-bold">
                      ¥{price.close}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`text-xs font-bold ${isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-gray-400'}`}>
                      {isPositive ? '+' : ''}{changePercent}%
                    </div>

                    <div className="flex items-center gap-1">
                      {trend === 'up' && <TrendingUp className="w-5 h-5 text-green-400" />}
                      {trend === 'down' && <TrendingDown className="w-5 h-5 text-red-400" />}
                      {trend === 'neutral' && <Minus className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-gray-900/80 to-transparent pointer-events-none"></div>
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-gray-800/80 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
