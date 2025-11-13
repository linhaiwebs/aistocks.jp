export default function RefactoredHeader() {
  return (
    <header className="relative w-full px-4 sm:px-6 md:px-8 lg:px-10 pt-4 md:pt-6 pb-3 md:pb-4">
      <div className="flex flex-col gap-2 md:gap-3 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg leading-tight tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(255,255,255,0.2)' }}>
          AIによる銘柄診断
        </h1>

        <div className="flex justify-between items-end gap-3">
          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl text-white font-semibold leading-snug drop-shadow-md" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
            AIがあなたの銘柄を徹底分析
          </h2>

          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex-shrink-0">
            <img
              src="/assets/图层 3.png"
              alt="AI"
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
