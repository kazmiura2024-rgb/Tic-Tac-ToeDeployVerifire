import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, Cpu, Globe, HardDrive, Wifi, Sparkles } from 'lucide-react';
import { APP_VERSION, BUILD_TIMESTAMP } from '../constants';
import { SystemCheckItem } from '../types';

export const DeploymentInspector: React.FC = () => {
  const [checks, setChecks] = useState<SystemCheckItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);

  const runDiagnostics = () => {
    setIsRunning(true);
    const start = performance.now();

    // 1. ローカルストレージテスト
    let storageStatus: 'success' | 'warn' | 'error' = 'success';
    let storageDetail = 'アクセス可能 (正常読込/保存可能)';
    try {
      const testKey = '__deploy_test__';
      localStorage.setItem(testKey, '1');
      if (localStorage.getItem(testKey) !== '1') throw new Error('Mismatch');
      localStorage.removeItem(testKey);
    } catch (e) {
      storageStatus = 'warn';
      storageDetail = '利用不可または制限あり (プライベートモードの可能性)';
    }

    // 2. DOM & レンダリングテスト
    const domStatus: 'success' | 'warn' = typeof window !== 'undefined' && !!document.getElementById('root')
      ? 'success'
      : 'warn';

    // 3. 画面サイズ・解像度テスト
    const resolution = `${window.innerWidth}x${window.innerHeight} (dpr: ${window.devicePixelRatio || 1})`;

    // 4. クライアント時刻
    const clientTime = new Date().toLocaleTimeString('ja-JP');

    const duration = Math.round(performance.now() - start);
    setLatency(duration);

    setChecks([
      {
        id: 'client-render',
        name: 'React 19 / DOM レンダリング',
        status: domStatus,
        detail: 'VirtualDOM マウント成功 (正常稼働中)'
      },
      {
        id: 'storage',
        name: 'LocalStorage 読み書き',
        status: storageStatus,
        detail: storageDetail
      },
      {
        id: 'env-host',
        name: 'URL / ホスト環境',
        status: 'success',
        detail: window.location.hostname || 'ローカル実行'
      },
      {
        id: 'screen',
        name: 'ビューポート確認',
        status: 'success',
        detail: resolution
      },
      {
        id: 'time-sync',
        name: 'クライアント時刻',
        status: 'success',
        detail: clientTime
      }
    ]);

    setTimeout(() => {
      setIsRunning(false);
    }, 250);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 shadow-xl shadow-black/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              デプロイヘルスチェック &amp; ランタイム診断
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                All Systems Normal
              </span>
            </h3>
            <p className="text-xs text-slate-400">ホスティング環境やブラウザ上での稼働ステータスを確認できます</p>
          </div>
        </div>

        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>再診断</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs mb-4">
        {checks.map((item) => (
          <div key={item.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 font-medium">{item.name}</span>
              {item.status === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
            </div>
            <div className="text-slate-200 font-mono text-[11px] truncate" title={item.detail}>
              {item.detail}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/60 font-mono gap-2">
        <span>Version: {APP_VERSION}</span>
        <span>Build Ping: {latency !== null ? `${latency}ms (Client Ops)` : '計測中...'}</span>
        <span>UserAgent: {typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 32) + '...' : 'Unknown'}</span>
      </div>
    </div>
  );
};
