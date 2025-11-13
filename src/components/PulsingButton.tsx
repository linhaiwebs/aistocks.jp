interface PulsingButtonProps {
  onClick: () => void;
  stockName?: string;
  disabled?: boolean;
}

export default function PulsingButton({ onClick, stockName = '', disabled = false }: PulsingButtonProps) {
  const buttonText = stockName ? `${stockName} 診断開始` : '診断開始';

  return (
    <div className="flex justify-center px-4 my-6">
      <button
        onClick={onClick}
        disabled={disabled}
        className="relative group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 animate-pulse"></div>

        <div className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-gray-900 font-black text-base sm:text-lg px-8 py-4 rounded-full shadow-2xl transform transition-all duration-300 group-hover:scale-105 group-active:scale-95 animate-[pulse_2s_ease-in-out_infinite]">
          <div className="flex items-center justify-center gap-2">
            <span className="drop-shadow-md">{buttonText}</span>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-full pointer-events-none"></div>
      </button>
    </div>
  );
}
