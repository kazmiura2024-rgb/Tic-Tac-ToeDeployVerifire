import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, User, Bot, Trophy, Sparkles, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { Player, GameMode, ScoreState } from '../types';
import { WINNING_COMBINATIONS } from '../constants';

export const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isOTurn, setIsOTurn] = useState<boolean>(true); // 'O' starts first
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [scores, setScores] = useState<ScoreState>(() => {
    try {
      const saved = localStorage.getItem('tictactoe_scores');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return { oWins: 0, xWins: 0, draws: 0 };
  });
  const [isAiThinking, setIsAiThinking] = useState(false);

  // 保存
  useEffect(() => {
    try {
      localStorage.setItem('tictactoe_scores', JSON.stringify(scores));
    } catch (_) {}
  }, [scores]);

  // 勝利判定
  const checkWinner = (currentBoard: Player[]): { winner: Player | 'DRAW' | null; line: number[] | null } => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: combo };
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return { winner: 'DRAW', line: null };
    }
    return { winner: null, line: null };
  };

  // AIの手番 (MiniMax / 簡易スマートAI)
  const getBestMove = useCallback((currentBoard: Player[]): number => {
    const emptyIndices = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val): val is number => val !== null);

    if (emptyIndices.length === 0) return -1;

    // 1. AI(X)が今すぐ勝てる手があれば打つ
    for (const idx of emptyIndices) {
      const copy = [...currentBoard];
      copy[idx] = 'X';
      if (checkWinner(copy).winner === 'X') return idx;
    }

    // 2. プレイヤー(O)が次に勝つ手があれば防ぐ
    for (const idx of emptyIndices) {
      const copy = [...currentBoard];
      copy[idx] = 'O';
      if (checkWinner(copy).winner === 'O') return idx;
    }

    // 3. 中央が空いていれば優先
    if (currentBoard[4] === null) return 4;

    // 4. 四隅の優先
    const corners = [0, 2, 6, 8].filter((c) => currentBoard[c] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    // 5. ランダムに空いているマス
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }, []);

  const makeMove = useCallback((index: number, player: Player) => {
    setBoard((prevBoard) => {
      if (prevBoard[index] !== null) return prevBoard;
      const newBoard = [...prevBoard];
      newBoard[index] = player;

      const result = checkWinner(newBoard);
      if (result.winner) {
        setWinner(result.winner);
        setWinningLine(result.line);
        setScores((prev) => {
          if (result.winner === 'O') return { ...prev, oWins: prev.oWins + 1 };
          if (result.winner === 'X') return { ...prev, xWins: prev.xWins + 1 };
          return { ...prev, draws: prev.draws + 1 };
        });
      } else {
        setIsOTurn(player === 'O' ? false : true);
      }

      return newBoard;
    });
  }, []);

  // マスをクリック
  const handleCellClick = (index: number) => {
    if (board[index] !== null || winner !== null || isAiThinking) return;

    // プレイヤーの手番
    const currentPlayer: Player = isOTurn ? 'O' : 'X';
    makeMove(index, currentPlayer);
  };

  // AIの思考
  useEffect(() => {
    if (gameMode === 'ai' && !isOTurn && winner === null) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const move = getBestMove(board);
        if (move !== -1) {
          makeMove(move, 'X');
        }
        setIsAiThinking(false);
      }, 400); // 人間味のあるディレイ

      return () => clearTimeout(timer);
    }
  }, [gameMode, isOTurn, winner, board, getBestMove, makeMove]);

  // 次のゲームへ
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsOTurn(true);
    setWinner(null);
    setWinningLine(null);
    setIsAiThinking(false);
  };

  // スコア全リセット
  const resetScores = () => {
    const fresh = { oWins: 0, xWins: 0, draws: 0 };
    setScores(fresh);
    try {
      localStorage.removeItem('tictactoe_scores');
    } catch (_) {}
    resetGame();
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* モード切替 & スコアバー */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl shadow-black/20">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { setGameMode('ai'); resetGame(); }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                gameMode === 'ai'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>VS CPU</span>
            </button>
            <button
              onClick={() => { setGameMode('pvp'); resetGame(); }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                gameMode === 'pvp'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>2人対戦 (PvP)</span>
            </button>
          </div>

          <button
            onClick={resetScores}
            className="text-xs text-slate-500 hover:text-rose-400 flex items-center space-x-1 transition px-2 py-1"
            title="スコア記録を初期化"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">リセット</span>
          </button>
        </div>

        {/* スコアカード */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className={`p-2.5 rounded-xl border transition-all ${
            isOTurn && winner === null
              ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 ring-2 ring-cyan-500/20'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
          }`}>
            <div className="text-[11px] font-bold flex items-center justify-center gap-1">
              <span className="text-cyan-400 text-sm">〇</span> {gameMode === 'ai' ? 'あなた' : 'プレイヤー1'}
            </div>
            <div className="text-lg font-black font-mono mt-0.5 text-white">{scores.oWins}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-400 flex flex-col justify-center">
            <div className="text-[11px] font-bold text-slate-500">引き分け</div>
            <div className="text-lg font-black font-mono mt-0.5 text-slate-300">{scores.draws}</div>
          </div>

          <div className={`p-2.5 rounded-xl border transition-all ${
            !isOTurn && winner === null
              ? 'bg-rose-500/10 border-rose-500/50 text-rose-300 ring-2 ring-rose-500/20'
              : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
          }`}>
            <div className="text-[11px] font-bold flex items-center justify-center gap-1">
              <span className="text-rose-400 text-sm">✕</span> {gameMode === 'ai' ? 'CPU' : 'プレイヤー2'}
            </div>
            <div className="text-lg font-black font-mono mt-0.5 text-white">{scores.xWins}</div>
          </div>
        </div>
      </div>

      {/* ターン表示・ステータスアナウンス */}
      <div className="mb-4 text-center">
        {winner === null ? (
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
            {isAiThinking ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span className="text-amber-300">CPUが思考中...</span>
              </>
            ) : (
              <>
                <span className={`w-2 h-2 rounded-full ${isOTurn ? 'bg-cyan-400' : 'bg-rose-400'}`}></span>
                <span>
                  手番: <strong className={isOTurn ? 'text-cyan-300' : 'text-rose-300'}>{isOTurn ? '〇 (O)' : '✕ (X)'}</strong>
                </span>
              </>
            )}
          </div>
        ) : (
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-900/40 border border-indigo-500/40 text-xs font-bold text-indigo-300 animate-bounce">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>
              {winner === 'DRAW'
                ? '引き分けです！'
                : `${winner === 'O' ? '〇' : '✕'} の勝利です！ 🎉`}
            </span>
          </div>
        )}
      </div>

      {/* 3×3 ゲーム盤 */}
      <div className="relative bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-2xl backdrop-blur">
        <div className="grid grid-cols-3 gap-3 aspect-square max-w-[380px] mx-auto">
          {board.map((cell, idx) => {
            const isWinningCell = winningLine?.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={cell !== null || winner !== null || isAiThinking}
                aria-label={`マス ${idx + 1}`}
                className={`group relative rounded-2xl flex items-center justify-center text-4xl sm:text-5xl font-black transition-all duration-200 select-none ${
                  cell === null
                    ? 'bg-slate-950/70 hover:bg-slate-800/80 hover:border-slate-600 border border-slate-800/80 cursor-pointer active:scale-95'
                    : 'bg-slate-950/90 border border-slate-800 cursor-default'
                } ${
                  isWinningCell
                    ? 'ring-4 ring-amber-400/80 bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/20 scale-[1.03]'
                    : ''
                }`}
              >
                {cell === 'O' && (
                  <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)] transform scale-100 transition-transform">
                    〇
                  </span>
                )}
                {cell === 'X' && (
                  <span className="text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.5)] transform scale-100 transition-transform">
                    ✕
                  </span>
                )}
                {cell === null && !winner && (
                  <span className="opacity-0 group-hover:opacity-20 text-slate-400 text-2xl font-normal transition-opacity">
                    {isOTurn ? '〇' : '✕'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 終了後のリセットボタン */}
        {winner !== null && (
          <div className="mt-5 text-center">
            <button
              onClick={resetGame}
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>もう一度プレイする</span>
            </button>
          </div>
        )}
      </div>

      {/* サブアクション */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={resetGame}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center space-x-1.5 py-1 px-3 rounded-lg hover:bg-slate-900 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>盤面をクリアする</span>
        </button>
      </div>
    </div>
  );
};
