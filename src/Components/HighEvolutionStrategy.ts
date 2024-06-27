import Cell, { CellState } from './Cell';
import { IEvolutionStrategy } from './IEvolutionStrategy';

class HighEvolutionStrategy implements IEvolutionStrategy {
  calculateState(cell: Cell, livingNeighbors: number): CellState {
    if (cell.askIfAlive() && (livingNeighbors === 2 || livingNeighbors === 3)) {
      return CellState.ALIVE;
    }

    if (cell.askIfDead() && (livingNeighbors === 3 || livingNeighbors === 6)) {
      return CellState.ALIVE;
    }

    return CellState.DEAD;
  }
}

export { HighEvolutionStrategy };
