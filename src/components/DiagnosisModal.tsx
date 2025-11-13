import { X, ExternalLink, FileText, Download, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import RobotScholarIcon from './RobotScholarIcon';

interface DiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: string;
  stockCode: string;
  stockName: string;
  onLineConversion: () => void;
  onReportDownload: () => void;
  isStreaming?: boolean;
  isConnecting?: boolean;
}

const formatAnalysisText = (text: string) => {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    const formattedLine = line.replace(/(\d+\.?\d*%?|\d+円|[+-]\d+\.?\d*)/g, (match) => {
      return `<span class="text-blue-600 font-semibold text-lg">${match}</span>`;
    });

    const isBold = line.includes('###') || line.includes('**') || line.match(/^[\d]+\./);
    const cleanLine = formattedLine.replace(/###|\*\*/g, '');

    if (isBold) {
      return `<div key="${index}" class="font-bold text-blue-900 mt-4 mb-2">${cleanLine}</div>`;
    }

    return `<div key="${index}" class="text-gray-700">${cleanLine}</div>`;
  }).join('');
};

export default function DiagnosisModal({
  isOpen,
  onClose,
  analysis,
  stockCode,
  stockName,
  onLineConversion,
  onReportDownload,
  isStreaming = false,
  isConnecting = false,
}: DiagnosisModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastLengthRef = useRef(0);

  useEffect(() => {
    if (isStreaming && contentRef.current && analysis.length > lastLengthRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
      lastLengthRef.current = analysis.length;
    }
  }, [analysis, isStreaming]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.setAttribute('data-modal-open', 'true');

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.removeAttribute('data-modal-open');
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onReportDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black bg-opacity-75" style={{ touchAction: 'none' }}>
      <div className="relative w-full max-w-3xl max-h-[90vh]">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <RobotScholarIcon />
        </div>

        <div className="relative bg-white rounded-lg shadow-blue-glow-lg overflow-hidden border-2 border-blue-400/50 mt-20" style={{ touchAction: 'auto' }}>
          <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4 flex items-center justify-between">
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold text-white">
              {stockName}（{stockCode}）AIによる銘柄診断レポート
            </h2>
            {isConnecting && (
              <div className="flex items-center gap-2 text-white text-sm justify-center mt-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>接続中...</span>
              </div>
            )}
            {isStreaming && !isConnecting && (
              <div className="flex items-center gap-2 text-white text-sm justify-center mt-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>生成中...</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-600 rounded-full transition-colors ml-4"
            aria-label="閉じる"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div ref={contentRef} className="overflow-y-auto max-h-[calc(90vh-240px)] px-6 py-6">
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
            <p className="text-sm font-semibold text-yellow-700 leading-relaxed">
              【重要なお知らせ】本サービスは金融商品の取引を勧誘するものではなく、情報提供のみを目的としています。診断結果は投資助言ではありません。株式投資には価格変動リスク、信用リスクなどが伴い、損失を被る可能性があります。最終的な投資判断はご自身の責任において行ってください。
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-blue-900 text-center mb-6">AI診断結果</h3>

            <div className="bg-blue-50 rounded-xl p-6 shadow-inner relative border border-blue-200">
              <div className="prose prose-sm max-w-none">
                {isConnecting ? (
                  <div className="text-center py-8">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <p className="text-blue-900 font-semibold">AIサーバーに接続中...</p>
                    <p className="text-blue-600 text-sm mt-2">数秒お待ちください</p>
                  </div>
                ) : (
                  <div className="leading-relaxed space-y-2">
                    <div dangerouslySetInnerHTML={{ __html: formatAnalysisText(analysis) }} />
                    {isStreaming && (
                      <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1"></span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onLineConversion}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg mt-6"
            >
              <ExternalLink className="w-6 h-6" />
              無料AI診断結果をLINEで毎日受け取る
            </button>

            <div className="mt-3 p-3 bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg border border-green-600/30">
              <p className="text-xs text-green-700 leading-relaxed">
                LINEで登録すると、毎日最新の株式分析レポートをお届けします
              </p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent px-6 py-6 border-t border-blue-200">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>ダウンロード中...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>レポートをダウンロード</span>
                <Download className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
