import type Board from './Board.js';
import type Cell from './CellBoard.js';

export abstract class BoardItem {
  protected cell: Cell;
  protected board: Board;
  abstract blocked(): boolean;
  abstract pick(): void;
  constructor(cell: Cell, board: Board) {
    this.cell = cell;
    this.board = board;
  }
}
