import Cell, { CellState } from './Cell';

export interface IEvolutionStrategy {
  calculateState(cell: Cell, livingNeighbors: number): CellState;
}
