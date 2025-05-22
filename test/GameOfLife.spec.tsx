import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import GameOfLife from '../src/Components/GameOfLife';
import Cell, { CellState } from '../src/Components/Cell'; // Keep for helper if needed later

// Constants from GameOfLife.tsx
const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;

// Helper function to create a full GRID_WIDTH x GRID_HEIGHT grid
// with a smaller pattern embedded.
const createGridWithPattern = (pattern: CellState[][], patternStartY = 0, patternStartX = 0): Cell[][] => {
  const fullGridState: CellState[][] = Array.from({ length: GRID_HEIGHT }, () =>
    Array.from({ length: GRID_WIDTH }, () => CellState.DEAD)
  );

  for (let r = 0; r < pattern.length; r++) {
    for (let c = 0; c < pattern[r].length; c++) {
      if (patternStartY + r < GRID_HEIGHT && patternStartX + c < GRID_WIDTH) {
        fullGridState[patternStartY + r][patternStartX + c] = pattern[r][c];
      }
    }
  }
  return fullGridState.map(row => row.map(cellState => new Cell(cellState)));
};

// Store the original useState
const originalUseState = vi.importActual('react').useState;
const mockSetGrid = vi.fn();
let currentTestGrid: Cell[][] | null = null;

vi.mock('react', async () => {
  const actualReact = await vi.importActual('react');
  return {
    ...actualReact,
    // Simplify type signature here to avoid esbuild parsing issues with generics in vi.mock
    useState: (initialState: unknown) => {
      // Check if this useState is for the grid. This is a heuristic.
      // The initial state for the grid is a function (initializeGrid).
      // We need to cast initialState to a function type to check its name.
      const initialStateType = typeof initialState;

      if (initialStateType === 'function' && (initialState as () => unknown).name === 'initializeGrid') {
        // If currentTestGrid is set, use it. Otherwise, proceed with actual initialization.
        // For calculateNextGeneration tests, currentTestGrid should ALWAYS be set.
        const gridToUse = currentTestGrid || (initialState as () => Cell[][])(); // Assuming Cell[][] is the grid type
        return [gridToUse, mockSetGrid];
      }
      // For other useState calls, use the original implementation
      // We need to cast originalUseState to any to satisfy TypeScript when initialState is unknown
      return (originalUseState as any)(initialState);
    },
  };
});

describe('GameOfLife Component Tests', () => {
  beforeEach(() => {
    // Timers will be used for timer tests later
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers(); // Restore real timers after each test
  });

  describe('Initialization and Rendering', () => {
    it('should render the correct number of cell containers, implying correct grid dimensions', () => {
      render(<GameOfLife />);
      // Cells are rendered as divs with specific inline styles.
      // We look for divs that have width, height, and border matching the cell style.
      const cellElements = screen.getAllByRole('generic', { hidden: true }).filter(el => {
        const style = el.style;
        return style.width === '20px' && style.height === '20px' && style.border === '1px solid black';
      });
      expect(cellElements.length).toBe(GRID_WIDTH * GRID_HEIGHT);
    });

    // This test is difficult without exporting initializeGrid or the grid itself.
    // The random nature of initializeGrid also makes it hard to assert specific Cell states.
    // For now, we assume that if the correct number of cells are rendered,
    // and given the TypeScript types, they are likely Cell instances.
    it.todo('should populate the grid with Cell instances (requires grid exposure or refactor for direct verification)');
  });

  describe('calculateNextGeneration Logic', () => {
    beforeEach(() => {
      mockSetGrid.mockClear();
      currentTestGrid = null; // Reset before each test in this suite
    });

    // --- Core Rule Tests ---
    it('Rule 1: A live cell with fewer than two live neighbors dies (underpopulation)', () => {
      // Setup: A 3x3 grid with a single live cell at the center (1,1)
      // X D X
      // D L D
      // X D X
      // Expected: The live cell at (1,1) (relative to pattern) should die.
      // Pattern is placed at (say) 10,10 to avoid edge effects unless specifically testing them.
      const patternStartX = 10;
      const patternStartY = 10;
      const pattern: CellState[][] = [
        [CellState.DEAD, CellState.DEAD, CellState.DEAD],
        [CellState.DEAD, CellState.ALIVE, CellState.DEAD], // Target cell is (1,1) in pattern
        [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      ];
      currentTestGrid = createGridWithPattern(pattern, patternStartY, patternStartX);

      render(<GameOfLife />);

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(mockSetGrid).toHaveBeenCalledTimes(1);
      const nextGridCalculated = mockSetGrid.mock.calls[0][0]; // This is the new grid

      // Check the state of the cell (patternY + 1, patternX + 1)
      expect(nextGridCalculated[patternStartY + 1][patternStartX + 1].askIfAlive()).toBe(false);
    });

    it('Rule 2: A live cell with two or three live neighbors lives on (survival)', () => {
      // Case 1: Two live neighbors
      // Setup: A 3x3 grid with a live cell at (1,1) and two live neighbors
      // D L D
      // L L D
      // D D D
      // Expected: The live cell at (1,1) in pattern should survive.
      const patternStartX = 10;
      const patternStartY = 10;
      let pattern: CellState[][] = [
        [CellState.DEAD, CellState.ALIVE, CellState.DEAD],
        [CellState.ALIVE, CellState.ALIVE, CellState.DEAD], // Target cell (1,1)
        [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      ];
      currentTestGrid = createGridWithPattern(pattern, patternStartY, patternStartX);

      render(<GameOfLife />);
      act(() => { vi.advanceTimersByTime(100); });
      let nextGridCalculated = mockSetGrid.mock.calls[0][0];
      expect(nextGridCalculated[patternStartY + 1][patternStartX + 1].askIfAlive()).toBe(true);

      // Case 2: Three live neighbors
      // Setup:
      // D L D
      // L L L
      // D D D
      // Expected: The live cell at (1,1) in pattern should survive.
      mockSetGrid.mockClear();
      pattern = [
        [CellState.DEAD, CellState.ALIVE, CellState.DEAD],
        [CellState.ALIVE, CellState.ALIVE, CellState.ALIVE], // Target cell (1,1)
        [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      ];
      currentTestGrid = createGridWithPattern(pattern, patternStartY, patternStartX);

      render(<GameOfLife />);
      act(() => { vi.advanceTimersByTime(100); });
      nextGridCalculated = mockSetGrid.mock.calls[0][0];
      expect(nextGridCalculated[patternStartY + 1][patternStartX + 1].askIfAlive()).toBe(true);
    });

    it('Rule 3: A live cell with more than three live neighbors dies (overpopulation)', () => {
      // Setup: A 3x3 grid with a live cell at (1,1) and four live neighbors
      // L L L
      // L L D
      // D D D
      // Expected: The live cell at (1,1) in pattern should die.
      const patternStartX = 10;
      const patternStartY = 10;
      const pattern: CellState[][] = [
        [CellState.ALIVE, CellState.ALIVE, CellState.ALIVE],
        [CellState.ALIVE, CellState.ALIVE, CellState.DEAD], // Target cell (1,1)
        [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      ];
      currentTestGrid = createGridWithPattern(pattern, patternStartY, patternStartX);

      render(<GameOfLife />);
      act(() => { vi.advanceTimersByTime(100); });
      const nextGridCalculated = mockSetGrid.mock.calls[0][0];

      expect(nextGridCalculated[patternStartY + 1][patternStartX + 1].askIfAlive()).toBe(false);
    });

    // Rule 3 was: it.todo('Rule 3: A live cell with more than three live neighbors dies (overpopulation)');
    // It seems I already implemented it but the todo was not removed. Let's ensure it's correct.
    // The test for Rule 3 is already present and seems correct.

    it('Rule 4: A dead cell with exactly three live neighbors becomes a live cell (reproduction)', () => {
      // Setup: A 3x3 grid with a dead cell at (1,1) and three live neighbors
      // Simpler:
      // L L L
      // D D D  // Target cell (1,1) is DEAD. Neighbors are relative to pattern.
      // D D D
      const patternStartX = 10;
      const patternStartY = 10;
      const pattern: CellState[][] = [
        [CellState.ALIVE, CellState.ALIVE, CellState.ALIVE],
        [CellState.DEAD, CellState.DEAD, CellState.DEAD], // Target cell (1,1) in pattern
        [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      ];
      currentTestGrid = createGridWithPattern(pattern, patternStartY, patternStartX);

      render(<GameOfLife />);
      act(() => { vi.advanceTimersByTime(100); });
      const nextGridCalculated = mockSetGrid.mock.calls[0][0];
      expect(nextGridCalculated[patternStartY + 1][patternStartX + 1].askIfAlive()).toBe(true);
    });

    it('Rule: Boundary - ALIVE cell (0,0) with 1 neighbor dies', () => {
      // Test case: Cell at (0,0) is ALIVE and has 1 neighbor (1,1). Should die (underpopulation).
      // L D D
      // D L D
      // D D D
      const patternStartX = 0;
      const patternStartY = 0;
      const pattern: CellState[][] = [
        [CellState.ALIVE, CellState.DEAD, CellState.DEAD], // Target cell (0,0)
        [CellState.DEAD, CellState.ALIVE, CellState.DEAD], // Neighbor (1,1) relative to pattern
        [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      ];
      currentTestGrid = createGridWithPattern(pattern, patternStartY, patternStartX);

      render(<GameOfLife />);
      act(() => { vi.advanceTimersByTime(100); });
      const nextGridCalculated = mockSetGrid.mock.calls[0][0];

      // Cell (0,0) had 1 neighbor at (pattern[1][1]), so it should die.
      expect(nextGridCalculated[patternStartY][patternStartX].askIfAlive()).toBe(false);
    });

    it('Rule: Boundary - DEAD cell (0,0) with 3 neighbors lives', () => {
      // Test case: Cell at (0,0) is DEAD and has 3 live neighbors. Should become ALIVE (reproduction).
      // D L D
      // L L D
      // D D D
      const patternStartX = 0;
      const patternStartY = 0;
      const pattern: CellState[][] = [
        [CellState.DEAD, CellState.ALIVE, CellState.DEAD],   // Target(0,0)D. Neighbor(0,1)L
        [CellState.ALIVE, CellState.ALIVE, CellState.DEAD],  // Neighbor(1,0)L, Neighbor(1,1)L
        [CellState.DEAD, CellState.DEAD, CellState.DEAD],
      ];
      currentTestGrid = createGridWithPattern(pattern, patternStartY, patternStartX);
      render(<GameOfLife />); // New render, new component instance
      act(() => { vi.advanceTimersByTime(100); });
      const nextGridCalculated = mockSetGrid.mock.calls[0][0];
      // Cell (0,0) was DEAD. Neighbors: (0,1)L, (1,0)L, (1,1)L. (3 neighbors) Should become ALIVE.
      expect(nextGridCalculated[patternStartY][patternStartX].askIfAlive()).toBe(true);
    });

    it('should keep a "block" pattern stable', () => {
      // Setup: A 2x2 block of live cells in a 4x4 grid (or larger)
      // D D D D
      // D L L D
      // D L L D
      // D D D D
      // Expected: The 2x2 block should remain unchanged.
      const patternStartX = 10;
      const patternStartY = 10;
      const pattern: CellState[][] = [
        [CellState.DEAD, CellState.DEAD, CellState.DEAD, CellState.DEAD],
        [CellState.DEAD, CellState.ALIVE, CellState.ALIVE, CellState.DEAD], // Block cells
        [CellState.DEAD, CellState.ALIVE, CellState.ALIVE, CellState.DEAD], // Block cells
        [CellState.DEAD, CellState.DEAD, CellState.DEAD, CellState.DEAD],
      ];
      currentTestGrid = createGridWithPattern(pattern, patternStartY, patternStartX);

      render(<GameOfLife />);
      act(() => { vi.advanceTimersByTime(100); });
      const nextGridCalculated = mockSetGrid.mock.calls[0][0];

      // Check all cells of the 2x2 block relative to pattern start
      expect(nextGridCalculated[patternStartY + 1][patternStartX + 1].askIfAlive()).toBe(true);
      expect(nextGridCalculated[patternStartY + 1][patternStartX + 2].askIfAlive()).toBe(true);
      expect(nextGridCalculated[patternStartY + 2][patternStartX + 1].askIfAlive()).toBe(true);
      expect(nextGridCalculated[patternStartY + 2][patternStartX + 2].askIfAlive()).toBe(true);

      // Optionally, check a few dead cells around it
      expect(nextGridCalculated[patternStartY + 0][patternStartX + 0].askIfAlive()).toBe(false);
      expect(nextGridCalculated[patternStartY + 1][patternStartX + 0].askIfAlive()).toBe(false);
      expect(nextGridCalculated[patternStartY + 0][patternStartX + 1].askIfAlive()).toBe(false);
      expect(nextGridCalculated[patternStartY + 3][patternStartX + 3].askIfAlive()).toBe(false);
    });

    it('should oscillate a "blinker" pattern (one step: horizontal to vertical)', () => {
      // Setup: A horizontal blinker in a 5x5 grid
      // D D D D D
      // D D D D D
      // D L L L D
      // D D D D D
      // D D D D D
      // Expected: Transforms into a vertical blinker
      // D D D D D
      // D D L D D
      // D D L D D
      // D D L D D
      // D D D D D
      const patternStartX = 10;
      const patternStartY = 10;
      const pattern: CellState[][] = [
        [CellState.DEAD, CellState.DEAD, CellState.DEAD, CellState.DEAD, CellState.DEAD],
        [CellState.DEAD, CellState.DEAD, CellState.DEAD, CellState.DEAD, CellState.DEAD],
        [CellState.DEAD, CellState.ALIVE, CellState.ALIVE, CellState.ALIVE, CellState.DEAD], // Horizontal blinker
        [CellState.DEAD, CellState.DEAD, CellState.DEAD, CellState.DEAD, CellState.DEAD],
        [CellState.DEAD, CellState.DEAD, CellState.DEAD, CellState.DEAD, CellState.DEAD],
      ];
      currentTestGrid = createGridWithPattern(pattern, patternStartY, patternStartX);

      render(<GameOfLife />);
      act(() => { vi.advanceTimersByTime(100); });
      const nextGridCalculated = mockSetGrid.mock.calls[0][0];

      // Check the state of the cells for the vertical blinker relative to pattern start
      // Initial horizontal: (pS+2, pS+1), (pS+2, pS+2), (pS+2, pS+3)
      // Expected vertical: (pS+1, pS+2), (pS+2, pS+2), (pS+3, pS+2)
      expect(nextGridCalculated[patternStartY + 1][patternStartX + 2].askIfAlive()).toBe(true);
      expect(nextGridCalculated[patternStartY + 2][patternStartX + 2].askIfAlive()).toBe(true);
      expect(nextGridCalculated[patternStartY + 3][patternStartX + 2].askIfAlive()).toBe(true);

      // Check that the original horizontal blinker cells (that are not part of the new vertical one) are dead
      expect(nextGridCalculated[patternStartY + 2][patternStartX + 1].askIfAlive()).toBe(false);
      expect(nextGridCalculated[patternStartY + 2][patternStartX + 3].askIfAlive()).toBe(false);

      // Check a few other dead cells
      expect(nextGridCalculated[patternStartY + 0][patternStartX + 0].askIfAlive()).toBe(false);
      expect(nextGridCalculated[patternStartY + 2][patternStartX + 0].askIfAlive()).toBe(false);
      expect(nextGridCalculated[patternStartY + 4][patternStartX + 4].askIfAlive()).toBe(false);
    });
  });

  describe('Timer', () => {
    // Note: calculateNextGeneration is not directly spyable in functional components without refactoring.
    // However, we know it's called by the timer and then calls setGrid.
    // We're already mocking setGrid via our useState mock.
    // So, we can check if mockSetGrid is called after the interval.
    it('should trigger grid update (via setGrid) periodically', async () => {
      // Reset currentTestGrid so the component uses its internal initializeGrid
      // which is fine for this test as we only care about the timer triggering an update.
      currentTestGrid = null; 
      mockSetGrid.mockClear(); // Clear any calls from initial render if applicable

      render(<GameOfLife />);
      
      // mockSetGrid might be called on initial setup if initializeGrid results in a state update
      // that then causes a re-render cycle leading to calculateNextGeneration.
      // For this test, we are interested in calls *after* the timer.
      // The current GameOfLife calls setGrid inside calculateNextGeneration,
      // and calculateNextGeneration is called by the timer.
      
      // Let's clear any initial calls to mockSetGrid that might happen due to component setup
      // before the first interval.
      mockSetGrid.mockClear();

      expect(mockSetGrid).not.toHaveBeenCalled();

      await act(async () => {
        vi.advanceTimersByTime(100); // Advance by interval time
      });
      // calculateNextGeneration should have been called by the timer, which then calls setGrid
      expect(mockSetGrid).toHaveBeenCalledTimes(1);

      await act(async () => {
        vi.advanceTimersByTime(100); // Advance by another interval
      });
      expect(mockSetGrid).toHaveBeenCalledTimes(2); // Called again
    });

    it('should clear the interval when the component unmounts', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      // Reset currentTestGrid as we are not testing logic here, just unmount behavior
      currentTestGrid = null;
      
      const { unmount } = render(<GameOfLife />);
      
      unmount();
      
      expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
      clearIntervalSpy.mockRestore(); // Clean up the spy
    });
  });
});
