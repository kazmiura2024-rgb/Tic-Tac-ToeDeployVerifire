export type Player = 'O' | 'X' | null;

export type GameMode = 'pvp' | 'ai';

export interface ScoreState {
  oWins: number;
  xWins: number;
  draws: number;
}

export interface WinningLine {
  indices: number[];
  direction: 'row' | 'col' | 'diag-main' | 'diag-sub';
}

export interface SystemCheckItem {
  id: string;
  name: string;
  status: 'pending' | 'success' | 'warn' | 'error';
  detail: string;
}
