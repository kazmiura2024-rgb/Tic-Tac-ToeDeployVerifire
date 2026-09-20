import React from 'react';
import { Activity, CheckCircle2, ShieldCheck, Terminal } from 'lucide-react';
import { APP_VERSION } from '../constants';

interface NavbarProps {
  onToggleInspector: () => void;
  isInspectorOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleInspector, isInspectorOpen }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-black text-xl text-white tracking-tighter">〇×</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-base text-slate-100 tracking-wide">
                〇×ゲーム <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-400 font-medium">Verify Mode</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400">デプロイ稼働確認ダミーアプリ</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* デプロイステータスバッジ */}
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>DEPLOYED / ACTIVE</span>
          </div>

          <button
            onClick={onToggleInspector}
            className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${
              isInspectorOpen
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
            title="デプロイ状況インスペクターを開閉"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>環境診断</span>
          </button>
        </div>
      </div>
    </header>
  );
};
