import { Cell } from './Cell';
import {
  EvolutionStrategy,
  StandardEvolutionStrategy,
} from './EvolutionStrategies';

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
  static readonly WIDTH = 40;
  static readonly HEIGHT = 40;

  private evolutionStrategy: EvolutionStrategy;
  private cells: Cell[][] = [];

  constructor(
    initialCells?: Cell[][],
    strategy: EvolutionStrategy = new StandardEvolutionStrategy(),
  ) {
    this.evolutionStrategy = strategy;
    this.cells = initialCells ?? this.initRandom();
  }

  initRandom(): Cell[][] {
    return Array.from({ length: Grid.WIDTH }, () =>
      Array.from({ length: Grid.HEIGHT }, () => Cell.random()),
    );
  }

  nextGeneration(): void {
    const newGrid = this.cells.map((row, y) =>
      row.map((cell, x) => {
        const neighbors = this.livingNeighbors(x, y);
        const state = this.evolutionStrategy.calculateState(cell, neighbors);
        return Cell.create(state);
      }),
    );
    this.cells = newGrid;
  }

  livingNeighbors(x: number, y: number): number {
    return NEIGHBOR_OFFSETS.reduce((count, [dx, dy]) => {
      const nx = x + dx;
      const ny = y + dy;
      if (
        nx >= 0 &&
        nx < this.cells[0].length &&
        ny >= 0 &&
        ny < this.cells.length
      ) {
        return count + (this.cells[ny][nx].isAlive() ? 1 : 0);
      }
      return count;
    }, 0);
  }

  getCells() {
    return this.cells;
  }
}
