export enum CellState {
  DEAD = 'Dead',
  ALIVE = 'Alive',
}

export class Cell {
  static ALIVE_RANDOM_PROBABILITY: number = 0.85;
  private constructor(private state: CellState) {}

  setState(newState: CellState): void {
    this.state = newState;
  }

  isAlive(): boolean {
    return this.state === CellState.ALIVE;
  }

  isDead(): boolean {
    return this.state === CellState.DEAD;
  }

  static random(): Cell {
    const alive = Math.random() > Cell.ALIVE_RANDOM_PROBABILITY;
    return new Cell(alive ? CellState.ALIVE : CellState.DEAD);
  }

  static create(state: CellState): Cell {
    return new Cell(state);
  }
}
