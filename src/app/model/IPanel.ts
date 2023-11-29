export interface IPanel {
  points: number;
  bestScore: number;
  gameStatus: GameStatus;
  display: string;
  tableData: ITableData[];
}

export interface ITableData {
  actionName: string;
  timestamp: Date;
}

export enum GameStatus {
  READY = 'READY',
  STARTED = 'STARTED',
  PAUSED = 'PAUSED'
}
