export enum CellState {
  ALIVE = 'alive',
  DEAD = 'dead',
}

class Cell {
  constructor(private state: CellState) {}

  static aliveRandomProbability = 0.85;

  static newRandom(): Cell {
    const isAlive = Math.random() > this.aliveRandomProbability;

    return new Cell(isAlive ? CellState.ALIVE : CellState.DEAD);
  }

  askIfAlive(): boolean {
    return this.state === CellState.ALIVE;
  }

  askIfDead(): boolean {
    return this.state === CellState.DEAD;
  }
}

export default Cell;
