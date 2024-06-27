export enum CellState {
  ALIVE = 'alive',
  DEAD = 'dead',
}

class Cell {
  constructor(private state: CellState) {}

  askIfAlive(): boolean {
    return this.state === CellState.ALIVE;
  }

  changeState(newState: CellState): void {
    this.state = newState;
  }
}

export default Cell;
