import Cell, { CellState } from './Cell';

// Definimos las posibles direcciones de los vecinos
const NEIGHBOR_OFFSETS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

export class Grid {
  static height = 40;
  static width = 40;

  constructor(private cells: Cell[][]) {}
  static initialize() {
    const cells = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => Cell.newRandom()),
    );
    return new Grid(cells);
  }

  getCells(): Cell[][] {
    return this.cells;
  }

  public calculateNextGeneration() {
    const newGrid = this.cells.map((row, y) =>
      row.map((cell, x) => {
        const livingNeighbors = this.getLiveNeighbors(x, y);

        if (
          cell.askIfAlive() &&
          (livingNeighbors === 2 || livingNeighbors === 3)
        ) {
          return new Cell(CellState.ALIVE);
        }

        if (cell.askIfDead() && livingNeighbors === 3) {
          return new Cell(CellState.ALIVE);
        }

        return new Cell(CellState.DEAD);
      }),
    );
    this.cells = newGrid;
  }

  private getLiveNeighbors(x: number, y: number): number {
    return NEIGHBOR_OFFSETS.reduce((count, [dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < Grid.height && ny >= 0 && ny < Grid.width) {
        return count + (this.cells[ny][nx].askIfAlive() ? 1 : 0);
      }
      return count;
    }, 0);
  }
}
