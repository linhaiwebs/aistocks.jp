import { useState, useEffect, useRef } from 'react';
import SciFiHeader from '../components/SciFiHeader';
import SplitStockCard from '../components/SplitStockCard';
import PulsingButton from '../components/PulsingButton';
import ScrollingHistoryData from '../components/ScrollingHistoryData';
import AIContentDisplay from '../components/AIContentDisplay';
import DiagnosisLoadingOverlay from '../components/DiagnosisLoadingOverlay';
import NewDiagnosisModal from '../components/NewDiagnosisModal';
import ApiStatsDisplay from '../components/ApiStatsDisplay';
import { StockData } from '../types/stock';
import { DiagnosisState } from '../types/diagnosis';
import { useUrlParams } from '../hooks/useUrlParams';
import { apiClient } from '../lib/apiClient';
import { userTracking } from '../lib/userTracking';
import { trackConversion, trackDiagnosisButtonClick, trackConversionButtonClick } from '../lib/googleTracking';

const getDefaultStockData = (code: string): StockData => ({
  info: {
    code: code || '----',
    name: 'データ取得中...',
    price: '---',
    change: '0.0',
    changePercent: '0.00%',
    per: 'N/A',
    pbr: 'N/A',
    dividend: 'N/A',
    industry: 'N/A',
    marketCap: 'N/A',
    market: 'N/A',
    timestamp: new Date().toLocaleString('ja-JP'),
  },
  prices: [
    {
      date: new Date().toLocaleDateString('ja-JP'),
      open: '---',
      high: '---',
      low: '---',
      close: '---',
      volume: '---',
      change: '0.0',
      changePercent: '0.00%',
    }
  ]
});

export default function NewHome() {
  const urlParams = useUrlParams();
  const [stockCode, setStockCode] = useState('');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRealData, setHasRealData] = useState(false);

  const [diagnosisState, setDiagnosisState] = useState<DiagnosisState>('initial');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [diagnosisStartTime, setDiagnosisStartTime] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState<boolean>(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (urlParams.code) {
      setStockCode(urlParams.code);
      fetchStockData(urlParams.code);
    } else {
      const defaultCode = '----';
      setStockCode(defaultCode);
      setStockData(getDefaultStockData(defaultCode));
      setHasRealData(false);
    }
  }, [urlParams.code]);

  useEffect(() => {
    const trackPageVisit = async () => {
      if (stockData) {
        await userTracking.trackPageLoad({
          stockCode: stockCode,
          stockName: stockData.info.name,
          urlParams: {
            src: urlParams.src || '',
            gclid: urlParams.gclid || '',
            racText: urlParams.racText || '',
            code: urlParams.code || ''
          }
        });
      }
    };

    trackPageVisit();
  }, [stockData, stockCode, urlParams]);

  const fetchStockData = async (code: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/api/stock/data?code=${code}`);

      if (!response.ok) {
        throw new Error('株価データの取得に失敗しました');
      }

      const data = await response.json();
      setStockData(data);
      setStockCode(code);
      setHasRealData(true);
    } catch (err) {
      console.warn('Stock data fetch failed, using default data:', err);
      setStockData(getDefaultStockData(code));
      setStockCode(code);
      setHasRealData(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const runDiagnosis = async () => {
    if (diagnosisState !== 'initial' || !stockData || !hasRealData) return;

    trackDiagnosisButtonClick();

    setDiagnosisState('connecting');
    setDiagnosisStartTime(Date.now());
    setAnalysisResult('');
    setLoadingProgress(0);
    setShowLoadingOverlay(true);

    // 清除之前的interval（如果存在）
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev < 85) {
          return prev + Math.random() * 15;
        } else if (prev < 95) {
          return prev + Math.random() * 2;
        }
        return prev;
      });
    }, 100);

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || ''}/api/gemini/diagnosis`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 50000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: stockCode,
          stockData: {
            name: stockData.info.name,
            price: stockData.info.price,
            change: stockData.info.change,
            changePercent: stockData.info.changePercent,
            per: stockData.info.per,
            pbr: stockData.info.pbr,
            dividend: stockData.info.dividend,
            industry: stockData.info.industry,
            marketCap: stockData.info.marketCap,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      if (!response.ok) {
        throw new Error('AI診断に失敗しました');
      }

      setDiagnosisState('processing');

      const contentType = response.headers.get('content-type');

      if (contentType?.includes('text/event-stream')) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullAnalysis = '';
        let firstChunk = true;

        if (!reader) {
          throw new Error('ストリーム読み取りに失敗しました');
        }

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              try {
                const parsed = JSON.parse(data);

                if (parsed.error) {
                  throw new Error(parsed.error);
                }

                if (parsed.content) {
                  fullAnalysis += parsed.content;

                  if (firstChunk && fullAnalysis.trim().length > 0) {
                    setLoadingProgress(100);
                    setTimeout(() => {
                      setShowLoadingOverlay(false);
                      setDiagnosisState('streaming');
                    }, 600);
                    firstChunk = false;
                  }

                  setAnalysisResult(fullAnalysis);
                }

                if (parsed.done) {
                  setDiagnosisState('results');

                  const durationMs = Date.now() - diagnosisStartTime;
                  await userTracking.trackDiagnosisClick({
                    stockCode: stockCode,
                    stockName: stockData.info.name,
                    durationMs: durationMs
                  });
                }
              } catch (parseError) {
                console.error('Error parsing SSE data:', parseError);
              }
            }
          }
        }
      } else {
        const result = await response.json();

        if (!result.analysis || result.analysis.trim() === '') {
          throw new Error('診断結果が生成されませんでした');
        }

        setAnalysisResult(result.analysis);
        setDiagnosisState('results');

        const durationMs = Date.now() - diagnosisStartTime;
        await userTracking.trackDiagnosisClick({
          stockCode: stockCode,
          stockName: stockData.info.name,
          durationMs: durationMs
        });
      }
    } catch (err) {
      console.error('Diagnosis error:', err);
      let errorMessage = '診断中にエラーが発生しました';

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = 'リクエストがタイムアウトしました';
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      setDiagnosisState('error');
      setShowLoadingOverlay(false);
      setLoadingProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  };

  const handleLineConversion = async () => {
    try {
      trackConversionButtonClick();

      const response = await apiClient.get('/api/line-redirects/select');

      if (!response.ok) {
        console.error('Failed to get LINE redirect link');
        alert('LINEリンクの取得に失敗しました。しばらくしてからもう一度お試しください。');
        return;
      }

      const data = await response.json();

      if (!data.success || !data.link) {
        console.error('No active LINE redirect links available');
        alert('現在利用可能なLINEリンクがありません。');
        return;
      }

      const lineUrl = data.link.redirect_url;
      window.location.href = data.link.redirect_url;

      trackConversion();

      await userTracking.trackConversion({
        gclid: urlParams.gclid
      });

      console.log('LINE conversion tracked successfully');
    } catch (error) {
      console.error('LINE conversion error:', error);
      alert('操作に失敗しました。しばらくしてからもう一度お試しください。');
    }
  };

  const closeModal = () => {
    setDiagnosisState('initial');
    setAnalysisResult('');
    setLoadingProgress(0);
    setShowLoadingOverlay(false);
    setDiagnosisStartTime(0);
    setError(null);

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-[#032f8b]">
      <SciFiHeader />
      <ApiStatsDisplay />

      <div className="pb-8">
        {loading && (
          <div className="text-center py-12 md:py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-300 border-t-white"></div>
            <p className="mt-4 text-white font-medium text-sm sm:text-base">株価データを読み込んでいます...</p>
          </div>
        )}

        {stockData && diagnosisState === 'initial' && (
          <>
            <SplitStockCard
              info={stockData.info}
              latestPrice={stockData.prices[0]}
            />

            <PulsingButton
              onClick={runDiagnosis}
              stockName={stockData.info.name}
              disabled={!hasRealData}
            />

            <ScrollingHistoryData
              prices={stockData.prices}
              stockName={stockData.info.name}
            />

            <PulsingButton
              onClick={runDiagnosis}
              stockName={stockData.info.name}
              disabled={!hasRealData}
            />

            <AIContentDisplay />

            <PulsingButton
              onClick={runDiagnosis}
              stockName={stockData.info.name}
              disabled={!hasRealData}
            />
          </>
        )}

        <DiagnosisLoadingOverlay
          isVisible={showLoadingOverlay}
          progress={loadingProgress}
          onComplete={() => setShowLoadingOverlay(false)}
        />

        {diagnosisState === 'error' && (
          <div className="text-center py-12 sm:py-16 md:py-20 px-4">
            <div className="max-w-2xl mx-auto p-5 sm:p-6 md:p-8 bg-red-900/50 backdrop-blur-sm border border-red-500 rounded-2xl">
              <h3 className="text-lg sm:text-xl font-bold text-red-300 mb-3 sm:mb-4">診断エラー</h3>
              <p className="text-sm sm:text-base text-red-200 font-semibold mb-5 sm:mb-6">{error}</p>
              <button
                onClick={() => {
                  setDiagnosisState('initial');
                  setError(null);
                }}
                className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 font-bold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg text-sm sm:text-base touch-manipulation min-h-[44px]"
              >
                もう一度試す
              </button>
            </div>
          </div>
        )}

        <NewDiagnosisModal
          isOpen={diagnosisState === 'streaming' || diagnosisState === 'results'}
          onClose={closeModal}
          analysis={analysisResult}
          stockCode={stockCode}
          stockName={stockData?.info.name || ''}
          stockPrice={stockData?.info.price || ''}
          priceChange={`${stockData?.info.change || ''} (${stockData?.info.changePercent || ''})`}
          onLineConversion={handleLineConversion}
          isStreaming={diagnosisState === 'streaming'}
          isConnecting={diagnosisState === 'connecting'}
        />
      </div>
    </div>
  );
}
