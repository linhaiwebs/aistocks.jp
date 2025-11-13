import { useState, useEffect, useRef } from 'react';
import { TrendingUp, Sparkles, Bot, ChevronRight, Award } from 'lucide-react';
import DiagnosisLoadingOverlay from '../components/DiagnosisLoadingOverlay';
import NewDiagnosisModal from '../components/NewDiagnosisModal';
import ApiStatsDisplay from '../components/ApiStatsDisplay';
import { StockData } from '../types/stock';
import { DiagnosisState } from '../types/diagnosis';
import { useUrlParams } from '../hooks/useUrlParams';
import { apiClient } from '../lib/apiClient';
import { userTracking } from '../lib/userTracking';
import { trackConversion } from '../lib/googleTracking';

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

const mockHistoricalData = [
  { date: '25/10/27', code: '7203', name: 'トヨタ自動車', evaluation: 85, profit: '+12.5%', color: 'green' },
  { date: '25/10/24', code: '9984', name: 'ソフトバンクG', evaluation: 72, profit: '+8.3%', color: 'green' },
  { date: '25/10/22', code: '6758', name: 'ソニーG', evaluation: 78, profit: '+10.1%', color: 'green' },
  { date: '25/10/20', code: '8306', name: '三菱UFJ', evaluation: 68, profit: '+5.7%', color: 'green' },
  { date: '25/10/18', code: '4063', name: '信越化学', evaluation: 58, profit: '-3.2%', color: 'red' },
  { date: '25/10/15', code: '6501', name: '日立製作所', evaluation: 81, profit: '+11.8%', color: 'green' },
];

export default function RebuiltHome() {
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
      const defaultCode = '5706';
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

    setDiagnosisState('connecting');
    setDiagnosisStartTime(Date.now());
    setAnalysisResult('');
    setLoadingProgress(0);
    setShowLoadingOverlay(true);

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

      const lineUrl = data.link.line_url;
      window.open(lineUrl, '_blank');

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
    <div className="min-h-screen bg-gradient-to-b from-[#032161] via-[#032f8b] to-[#1a0f3e] text-white">
      <ApiStatsDisplay />

      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] opacity-30">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-500 via-orange-400 to-yellow-500 blur-3xl animate-pulse"></div>
        </div>

        <div className="absolute top-20 left-0 w-[400px] h-[400px] opacity-20">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="absolute top-40 right-0 w-[500px] h-[500px] opacity-15">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#032161] to-transparent"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-600/40 to-orange-500/40 border-2 border-orange-400/60 rounded-full text-sm font-bold text-orange-200 shadow-lg shadow-orange-500/20">
              <Sparkles className="w-5 h-5" />
              AI高精度
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-40">
                <div className="w-[500px] h-[500px] rounded-full border-4 border-orange-500/30 animate-ping" style={{ animationDuration: '3s' }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="w-[400px] h-[400px] rounded-full border-4 border-orange-400/40 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }}></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-50">
                <div className="w-[350px] h-[350px] rounded-full bg-gradient-to-br from-orange-500/20 to-yellow-500/20 backdrop-blur-sm animate-pulse"></div>
              </div>

              <div className="relative py-12">
                <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">
                  AI 銘柄無料診断
                </h1>
                <p className="text-2xl md:text-3xl text-orange-200 font-semibold">
                  銘柄基本情報
                </p>
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-blue-600"></div>
              <p className="mt-4 text-blue-300 font-medium">株価データを読み込んでいます...</p>
            </div>
          )}

          {stockData && diagnosisState === 'initial' && (
            <>
              <div className="mt-12 max-w-2xl mx-auto bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-md border border-blue-500/30 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white">{stockData.info.name}</h2>
                    <p className="text-lg text-blue-300 font-mono">{stockCode}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-white">{stockData.info.price}</p>
                    <div className={`flex items-center gap-1 justify-end ${parseFloat(stockData.info.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-xl font-bold">{stockData.info.change}</span>
                      <span className="text-lg">({stockData.info.changePercent})</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-blue-950/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">始値</p>
                    <p className="text-lg font-semibold text-white">{stockData.prices[0]?.open || '---'}</p>
                  </div>
                  <div className="bg-blue-950/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">高値</p>
                    <p className="text-lg font-semibold text-white">{stockData.prices[0]?.high || '---'}</p>
                  </div>
                  <div className="bg-blue-950/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">終値</p>
                    <p className="text-lg font-semibold text-white">{stockData.prices[0]?.close || '---'}</p>
                  </div>
                  <div className="bg-blue-950/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">安値</p>
                    <p className="text-lg font-semibold text-white">{stockData.prices[0]?.low || '---'}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 max-w-2xl mx-auto">
                <button
                  onClick={runDiagnosis}
                  disabled={!hasRealData}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white text-2xl font-bold py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <Bot className="w-8 h-8" />
                  {stockData.info.name}・診断開始
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>

              <div className="mt-16 max-w-4xl mx-auto">
                <h3 className="text-3xl font-bold text-center mb-8 text-blue-300">銘柄診断実績</h3>
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-md border border-blue-500/30 rounded-3xl p-6 shadow-2xl">
                  <div className="space-y-3">
                    {mockHistoricalData.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-blue-950/40 rounded-xl p-4 flex items-center justify-between hover:bg-blue-900/40 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-400 font-mono w-20">{item.date}</div>
                          <div>
                            <div className="font-bold text-white">{item.name}</div>
                            <div className="text-xs text-gray-400 font-mono">{item.code}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-sm text-gray-400">評価</div>
                            <div className="text-2xl font-bold text-blue-300">{item.evaluation}</div>
                          </div>
                          <div className={`text-2xl font-bold ${item.color === 'green' ? 'text-green-400' : 'text-red-400'}`}>
                            {item.profit}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>

              <div className="mt-8 max-w-2xl mx-auto">
                <button
                  onClick={runDiagnosis}
                  disabled={!hasRealData}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white text-2xl font-bold py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <TrendingUp className="w-8 h-8" />
                  {stockData.info.name}・未来分析
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>

              <div className="mt-16 max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-400 rounded-full">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">最強</span>
                    </div>

                    <h3 className="text-4xl font-black text-white leading-tight">
                      身近な存在となった、<br />人工知能分析
                    </h3>

                    <div className="space-y-3">
                      <h4 className="text-xl font-bold text-blue-300 mb-4">AI共通分析</h4>
                      {[
                        'テクニカル分析',
                        '株価分析',
                        '銘柄診断',
                        'チャート分析',
                        'ファンダメンタル分析',
                        'リスク評価'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-lg">
                          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                          <span className="text-gray-200">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="order-1 md:order-2 flex justify-center">
                    <div className="relative w-80 h-80">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 blur-2xl animate-pulse"></div>
                      <div className="relative w-full h-full flex items-center justify-center">
                        <Bot className="w-64 h-64 text-blue-400 opacity-80" strokeWidth={1} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 max-w-2xl mx-auto">
                <button
                  onClick={runDiagnosis}
                  disabled={!hasRealData}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white text-2xl font-bold py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <Sparkles className="w-8 h-8" />
                  {stockData.info.name}・未来 AI 予測
                  <ChevronRight className="w-8 h-8" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <DiagnosisLoadingOverlay
        isVisible={showLoadingOverlay}
        progress={loadingProgress}
        onComplete={() => setShowLoadingOverlay(false)}
      />

      {diagnosisState === 'error' && (
        <div className="text-center py-20">
          <div className="max-w-2xl mx-auto p-8 bg-red-900/30 border border-red-500 rounded-2xl backdrop-blur-md">
            <h3 className="text-xl font-bold text-red-400 mb-4">診断エラー</h3>
            <p className="text-red-300 font-semibold mb-6">{error}</p>
            <button
              onClick={() => {
                setDiagnosisState('initial');
                setError(null);
              }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
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
  );
}
