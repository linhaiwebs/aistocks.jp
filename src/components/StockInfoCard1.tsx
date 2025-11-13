import { StockInfo } from '../types/stock';

interface StockInfoCard1Props {
  info: StockInfo;
}

export default function StockInfoCard1({ info }: StockInfoCard1Props) {
  return (
    <div className="relative -mt-4 sm:-mt-6 md:-mt-8 lg:-mt-10 z-20">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-2.5 sm:p-3 md:p-4">
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2 md:gap-3 items-stretch">
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 flex flex-col items-center justify-center text-white shadow-lg">
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-0.5 sm:mb-1">{info.code}</div>
              <div className="text-xs sm:text-sm md:text-base font-medium text-center leading-tight">{info.name}</div>
            </div>

            <div className="flex flex-col justify-between space-y-1 sm:space-y-1.5 md:space-y-2">
              <div className="bg-gray-50 rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-2.5 flex-1 flex flex-col justify-center">
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-500 mb-0.5">PER</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-tight">{info.per || 'N/A'}倍</div>
              </div>
              <div className="bg-gray-50 rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-2.5 flex-1 flex flex-col justify-center">
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-500 mb-0.5">PBR</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-tight">{info.pbr || 'N/A'}倍</div>
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-1 sm:space-y-1.5 md:space-y-2">
              <div className="bg-gray-50 rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-2.5 flex-1 flex flex-col justify-center">
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-500 mb-0.5">利回り</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-tight">{info.dividend || 'N/A'}%</div>
              </div>
              <div className="bg-gray-50 rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-2.5 flex-1 flex flex-col justify-center">
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-500 mb-0.5">信用倍率</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-tight">N/A</div>
              </div>
            </div>

            <div className="flex flex-col justify-between space-y-1 sm:space-y-1.5 md:space-y-2">
              <div className="bg-gray-50 rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-2.5 flex-1 flex flex-col justify-center">
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-500 mb-0.5">時価総額</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-tight">{info.marketCap || 'N/A'}億円</div>
              </div>
              <div className="bg-gray-50 rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-2.5 flex-1 flex flex-col justify-center">
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-500 mb-0.5">市場</div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-tight">{info.market || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
