import PlayerError from '../../../errors/CharacterError.js';
import type Cell from '../../match/boards/CellBoard.js';
import Character from '../Character.js';

/**
 * This class represents the behaviour and the properties
 * of a player in the game of bad-ice-cream.
 */
class Player extends Character {
  /**
   * This method executes the player power // TODO
   */
  execPower(): void {
    throw new Error('Method not implemented.');
  }

  /**
   * NOTE FOR ME: This method should be changed by an act() method that changes according to the nature of the Character
   * @returns {boolean} True, the player blocks the cell
   */
  public blocked(): boolean {
    return true;
  }
  die(): void {
    throw new Error('Method not implemented.');
  }
  reborn(): void {
    throw new Error('Method not implemented.');
  }
  private id: string;

  /**
   * This method returns the id of the player
   * @returns {string} The id of the player
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Method to create a new player
   * @param id {string} The id of the player
   * @param cell {Cell} the cell where the player is located
   */
  constructor(id: string, cell: Cell) {
    super(cell);
    this.id = id;
    this.cell = cell;
  }

  public getCoordinates(): { x: number; y: number } {
    if (this.cell === null) throw new PlayerError(PlayerError.NULL_CELL);
    return this.cell.getCoordinates();
  }
}
export default Player;
