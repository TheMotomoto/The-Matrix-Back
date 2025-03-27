import { v4 as uuidv4 } from 'uuid';
import type Board from '../../match/boards/Board.js';
import type Cell from '../../match/boards/CellBoard.js';
import Character from '../Character.js';

export default abstract class Enemy extends Character {
  public abstract calculateMovement(): Promise<void>;
  private id: string;
  execPower(): void {} // Enemy has no power
  constructor(cell: Cell, board: Board) {
    super(cell, board);
    this.id = uuidv4();
  }

  public getId(): string {
    return this.id;
  }
  kill(): boolean {
    // Enemy can kill
    return true;
  }

  die(): boolean {
    // Enemy can't die
    return false;
  }
  reborn(): void {} // Enemy cannot reborn, becasue it can't die either
}
