import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DeploymentInspector } from './components/DeploymentInspector';
import { TicTacToe } from './components/TicTacToe';
import { CheckCircle, Sparkles, HelpCircle, Layers, Server, Play } from 'lucide-react';

export const App: React.FC = () => {
  const [showInspector, setShowInspector] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100">
      <div>
        <Navbar
          isInspectorOpen={showInspector}
          onToggleInspector={() => setShowInspector((prev) => !prev)}
        />

        <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
          {/* 上部ガイダンスバナー */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400"></span>
                <h2 className="text-sm font-bold text-slate-200">
                  デプロイ確認・動作検証用サンドボックス
                </h2>
              </div>
              <p className="text-xs text-slate-400 max-w-2xl">
                ホスティング先（Vercel, Cloudflare, Netlify, Firebase, Cloud Run等）へのデプロイが成功しているかを検証するためのダミーアプリです。3×3の〇×ゲームと環境診断ツールが正常に動くかお確かめください。
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" />
                <span>HTTP 200 OK</span>
              </div>
            </div>
          </div>

          {/* デプロイ環境インスペクター (開閉可能) */}
          {showInspector && <DeploymentInspector />}

          {/* 〇×ゲーム本体 */}
          <div className="my-6">
            <TicTacToe />
          </div>

          {/* デプロイ検証ポイントガイド */}
          <div className="mt-12 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              確認すべきチェックポイント
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-400">
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60">
                <div className="font-medium text-slate-200 mb-1">1. JS実行とイベント</div>
                マス目をタップして〇や✕が描画されるか、CPUが自動応手を返すか確認。
              </div>
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60">
                <div className="font-medium text-slate-200 mb-1">2. LocalStorageの永続化</div>
                勝利スコアがリロード後も保持されているか確認（キャッシュ・ストレージ動作）。
              </div>
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/60">
                <div className="font-medium text-slate-200 mb-1">3. レスポンシブ＆CSS</div>
                スマートフォンやPCの解像度でレイアウト崩れがないか確認。
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* フッター */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        <p>3×3 Tic-Tac-Toe Deploy Verifier &bull; React 19 + Tailwind CSS</p>
      </footer>
    </div>
  );
};

export default App;
