import { Mutex } from 'async-mutex';
import CharacterError from 'src/app/errors/CharacterError.js';
import { BoardItem } from '../match/boards/BoardItem.js';

/**
 * This class represents the behaviour and the properties
 * of a character in the game of bad-ice-cream. (Player or Enemy)
 */
abstract class Character extends BoardItem {
  protected readonly mutex = new Mutex();
  /**
   * Method to create a new character. Must be run on the same thread
   */
  public moveUp(): void {
    this.mutex.runExclusive(() => {
      const upCell = this.cell.getUpCell();
      if (!upCell) throw new CharacterError(CharacterError.OUT_OF_BOUNDS);
      if (upCell.blocked()) throw new CharacterError(CharacterError.BLOCKED_CELL);

      this.cell.setCharacter(null);
      this.cell = upCell;
    });
  }

  /**
   * Method to move the character down. Must be run on the same thread
   */
  public moveDown(): void {
    this.mutex.runExclusive(() => {
      const downCell = this.cell.getDownCell();
      if (downCell) {
        this.cell.setCharacter(null);
        this.cell = downCell;
      } else {
        throw new CharacterError(CharacterError.OUT_OF_BOUNDS);
      }
    });
  }

  /**
   * Method to move the character left. Must be run on the same thread
   */
  public moveLeft(): void {
    this.mutex.runExclusive(() => {
      const leftCell = this.cell.getLeftCell();
      if (leftCell) {
        this.cell.setCharacter(null);
        this.cell = leftCell;
      } else {
        throw new CharacterError(CharacterError.OUT_OF_BOUNDS);
      }
    });
  }

  /**
   * Method to move the character right. Must be run on the same thread
   */
  public moveRight(): void {
    this.mutex.runExclusive(() => {
      const rightCell = this.cell.getRightCell();
      if (rightCell) {
        this.cell.setCharacter(null);
        this.cell = rightCell;
      } else {
        throw new CharacterError(CharacterError.OUT_OF_BOUNDS);
      }
    });
  }

  abstract execPower(): void;
  abstract die(): void;
  abstract reborn(): void;
}
export default Character;
