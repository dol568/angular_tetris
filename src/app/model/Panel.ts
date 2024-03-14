import { _action_started_game } from './_const_vars';

export class Panel {
  constructor(
    public points: number = 0,
    public bestScore: number = 0,
    public gameStatus: GameStatus = GameStatus.READY,
    public display: string = '00:00:00',
    public tableData: TableData[] = []
  ) {}
}

export class TableData {
  constructor(
    public actionName: string = _action_started_game,
    public timestamp: Date = new Date()
  ) {}
}

export enum GameStatus {
  READY = 'READY',
  STARTED = 'STARTED',
  PAUSED = 'PAUSED',
}
