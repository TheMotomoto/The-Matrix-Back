import Troll from '../../characters/enemies/Troll.js';
import Board from './Board.js';
import Cell from './CellBoard.js';
import Fruit from './Fruit.js';
/**
 * Class to represent the board of the game
 * with a difficulty of 1 with troll enemies
 * @version 1.0
 * @since 1.0
 */
export default class BoardDifficulty1 extends Board {
  private readonly FRUIT_TYPE: string = 'banana';
  private readonly ENEMIES: number = 4;
  private readonly enemiesCoordinates: number[][] = [
    [2, 4],
    [2, 12],
    [14, 4],
    [14, 12],
  ];
  private readonly fruitsCoordinates: number[][] = [
    [4, 5],
    [4, 6],
    [4, 7],
    [4, 8],
    [4, 9],
    [4, 10],
    [4, 11],
    [11, 5],
    [11, 6],
    [11, 7],
    [11, 8],
    [11, 9],
    [11, 10],
    [11, 11],
  ];
  private readonly FRUITS: number = 16;

  /**
   * Method to generate the board
   */
  public generateBoard(): void {
    for (let i = 0; i < this.ROWS; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.COLS; j++) {
        const cellUp = i > 0 ? this.board[i - 1][j] : null;
        const cellDown = i < this.ROWS - 1 ? this.board[i + 1][j] : null;
        const cellLeft = j > 0 ? this.board[i][j] : null;
        const cellRight = j < this.COLS - 1 ? this.board[i][j] : null;
        this.board[i][j] = new Cell(i, j, cellUp, cellDown, cellLeft, cellRight);
      }
    }
  }

  /**
   * Method to set up the enemies in the board
   */
  public setUpEnemies(): void {
    for (let i = 0; i < this.ENEMIES; i++) {
      const x = this.enemiesCoordinates[i][0];
      const y = this.enemiesCoordinates[i][1];
      const troll = new Troll(this.board[x][y]);
      this.board[x][y].setCharacter(troll);
    }
  }

  /**
   * This method sets up the fruits in the board
   */
  public setUpFruits(): void {
    for (let i = 0; i < this.FRUITS; i++) {
      const x = this.fruitsCoordinates[i][0];
      const y = this.fruitsCoordinates[i][1];
      this.board[x][y].setCharacter(new Fruit(this.board[x][y], this.FRUIT_TYPE));
    }
  }

  /**
   * Method to set up the players in the board
   */
  public setUpPlayers(): void {
    this.board[9][1].setCharacter(this.host);
    this.board[9][14].setCharacter(this.guest);
  }

  public setUpInmovableObjects(): void {
    // TODO --> Priority 3 <-- Implement this method
  }
}
