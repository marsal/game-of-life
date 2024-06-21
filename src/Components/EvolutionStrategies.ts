import { Cell, CellState } from './Cell';

export interface EvolutionStrategy {
  calculateState(currentCelll: Cell, livingNeighbors: number): CellState;
}
export class StandardEvolutionStrategy implements EvolutionStrategy {
  calculateState(currentCelll: Cell, livingNeighbors: number): CellState {
    const isAlive =
      (currentCelll.isAlive() &&
        (livingNeighbors === 2 || livingNeighbors === 3)) ||
      (currentCelll.isDead() && livingNeighbors === 3);
    return isAlive ? CellState.ALIVE : CellState.DEAD;
  }
}

export class HighLifeEvolutionStrategy implements EvolutionStrategy {
  calculateState(currentCelll: Cell, livingNeighbors: number): CellState {
    const isAlive =
      (currentCelll.isAlive() &&
        (livingNeighbors === 2 || livingNeighbors === 3)) ||
      (currentCelll.isDead() &&
        (livingNeighbors === 3 || livingNeighbors === 6));
    return isAlive ? CellState.ALIVE : CellState.DEAD;
  }
}
