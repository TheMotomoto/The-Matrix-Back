import CharacterError from '../../../errors/CharacterError.js';
import type Board from '../../match/boards/Board.js';
import type Cell from '../../match/boards/CellBoard.js';
import Character from '../Character.js';

/**
 * This class represents the behaviour and the properties
 * of a player in the game of bad-ice-cream.
 */
class Player extends Character {
  private id: string;
  /**
   * Method to create a new player
   * @param id {string} The id of the player
   * @param cell {Cell} the cell where the player is located
   */
  constructor(id: string, cell: Cell, board: Board) {
    super(cell, board);
    this.id = id;
    this.cell = cell;
  }
  /**
   * This method executes the player power
   */
  execPower(): void {
    // TODO --> Implement power
    throw new Error('Method not implemented.');
  }

  /**
   * This method returns true if the player can kill
   * @returns {boolean} False, the player cannot kill
   */
  kill(): boolean {
    return false;
  }

  /**
   * This method is executed when a player dies and stops the game for that player
   */
  die(): void {
    this.alive = false;
  }

  /**
   * This method restartds the player // TODO
   */
  reborn(): void {
    throw new Error('Method not implemented.');
  }

  /**
   * This method returns the id of the player
   * @returns {string} The id of the player
   */
  public getId(): string {
    return this.id;
  }

  public getCoordinates(): { x: number; y: number } {
    if (this.cell === null) throw new CharacterError(CharacterError.NULL_CELL);
    return this.cell.getCoordinates();
  }

  protected move(cellUp: Cell, character: Character | null): void {
    this.cell.setCharacter(null);
    cellUp.setCharacter(this);
    this.cell = cellUp;
    this.cell.pickItem();
    if (character?.kill()) {
      // If it's an enemy, it dies.
      this.die();
    }
  }

  protected validateMove(cell: Cell | null): { character: Character | null; cell: Cell } {
    if (!cell) throw new CharacterError(CharacterError.NULL_CELL); // If it's a border it can't move
    if (cell.blocked()) throw new CharacterError(CharacterError.BLOCKED_CELL); // If it's a block object, it can't move
    const character = cell.getCharacter();
    if (character && !character.kill()) throw new CharacterError(CharacterError.BLOCKED_CELL); // If it's other player, it can't move
    return { character, cell };
  }
}
export default Player;
