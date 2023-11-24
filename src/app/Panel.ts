export class Panel {
    points: number = 0;
    bestScore: number = 0;
    gameStatus: string = "READY";
    display: string = '00:00:00';
    tableData: TableData[] = [];
}

export class TableData {
    actionName: string = '';
    timestamp: Date = new Date();
}
