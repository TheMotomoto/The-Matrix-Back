import { Mutex } from 'async-mutex';
import { BoardItem } from '../match/boards/BoardItem.js';
import type Cell from '../match/boards/CellBoard.js';

/**
 * This class represents the behaviour and the properties
 * of a character in the game of bad-ice-cream. (Player or Enemy)
 */
abstract class Character extends BoardItem {
  protected readonly mutex = new Mutex();
  protected alive = true;
  protected orientation: 'down' | 'up' | 'left' | 'right' = 'down';
  async moveUp(): Promise<void> {
    await this.mutex.runExclusive(() => {
      const cellUp = this.cell.getUpCell();
      const { character, cell } = this.validateMove(cellUp);
      this.move(cell, character);
      this.orientation = 'up';
    });
  }

  async moveDown(): Promise<void> {
    await this.mutex.runExclusive(() => {
      const cellDown = this.cell.getDownCell();
      const { character, cell } = this.validateMove(cellDown);
      this.move(cell, character);
      this.orientation = 'down';
    });
  }

  async moveLeft(): Promise<void> {
    await this.mutex.runExclusive(() => {
      const cellLeft = this.cell.getLeftCell();
      const { character, cell } = this.validateMove(cellLeft);
      this.move(cell, character);
      this.orientation = 'left';
    });
  }

  async moveRight(): Promise<void> {
    await this.mutex.runExclusive(() => {
      const cellRight = this.cell.getRightCell();
      const { character, cell } = this.validateMove(cellRight);
      this.move(cell, character);
      this.orientation = 'right';
    });
  }

  public getOrientation(): 'down' | 'up' | 'left' | 'right' {
    return this.orientation;
  }

  abstract execPower(): void;
  abstract die(): void;
  abstract kill(): boolean;
  abstract reborn(): void;
  protected abstract move(cell: Cell, character: Character | null): void;
  protected abstract validateMove(cell: Cell | null): { character: Character | null; cell: Cell };

  // The characters can't block the cell
  public blocked(): boolean {
    return false;
  }

  public pick(): void {} // The characters can't be picked up
}
export default Character;
