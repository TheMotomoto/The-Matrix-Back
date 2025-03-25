import type { BoardDTO, CellDTO } from '../../../../schemas/zod.js';
import Troll from '../../characters/enemies/Troll.js';
import Player from '../../characters/players/Player.js';
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
  private FRUIT_TYPE = '';
  private ENEMIES = 0;
  private enemiesCoordinates: number[][] = [];
  private fruitsCoordinates: number[][] = [];
  private FRUITS = 0;
  private playersStartCoordinates: number[][] = [];

  constructor(map: string, level: number) {
    super(map, level);
    this.loadContext(); // We exec this method twice, because of TypeScript, it doesn't saves the statue assigned after we use the father constructor:)
  }
  /**
   * Method to generate the board
   */
  protected generateBoard(): void {
    this.createBoard();
    for (let i = 0; i < this.ROWS; i++) {
      for (let j = 0; j < this.COLS; j++) {
        const cellUp = i > 0 ? this.board[i - 1][j] : null;
        const cellDown = i < this.ROWS - 1 ? this.board[i + 1][j] : null;
        const cellLeft = j > 0 ? this.board[i][j - 1] : null;
        const cellRight = j < this.COLS - 1 ? this.board[i][j + 1] : null;
        this.board[i][j].setNeighbors(cellUp, cellDown, cellLeft, cellRight);
      }
    }
  }

  private createBoard(): void {
    for (let i = 0; i < this.ROWS; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.COLS; j++) {
        this.board[i][j] = new Cell(i, j);
      }
    }
  }

  /**
   * Method to set up the enemies in the board
   */
  protected setUpEnemies(): void {
    for (let i = 0; i < this.ENEMIES; i++) {
      const x = this.enemiesCoordinates[i][0];
      const y = this.enemiesCoordinates[i][1];
      const troll = new Troll(this.board[x][y], this);
      this.enemies.push(troll);
      this.board[x][y].setCharacter(troll);
    }
  }

  /**
   * This method sets up the fruits in the board
   */
  protected setUpFruits(): void {
    this.fruitsNumber = this.FRUITS;
    for (let i = 0; i < this.FRUITS; i++) {
      const x = this.fruitsCoordinates[i][0];
      const y = this.fruitsCoordinates[i][1];
      const fruit = new Fruit(this.board[x][y], this.FRUIT_TYPE, this);
      this.fruits.set({ x, y }, fruit);
      this.board[x][y].setItem(fruit);
    }
  }

  /**
   * Method to set up the players in the board
   */
  protected setUpPlayers(host: string, guest: string): void {
    const [hostCoordinates, guestCoordinates] = this.playersStartCoordinates;
    const hostPlayer = new Player(host, this.board[hostCoordinates[0]][hostCoordinates[1]], this);
    const guestPlayer = new Player(
      guest,
      this.board[guestCoordinates[0]][guestCoordinates[1]],
      this
    );
    this.host = hostPlayer;
    this.guest = guestPlayer;
    this.board[hostCoordinates[0]][hostCoordinates[1]].setCharacter(this.host);
    this.board[guestCoordinates[0]][guestCoordinates[1]].setCharacter(this.guest);
  }

  public getFruits(): number {
    return this.FRUITS;
  }

  protected loadContext(): void {
    this.playersStartCoordinates = [
      [9, 1],
      [9, 14],
    ];
    this.enemiesCoordinates = [
      [2, 4],
      [2, 12],
      [14, 4],
      [14, 12],
    ];
    this.fruitsCoordinates = [
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
    this.FRUITS = this.fruitsCoordinates.length;
    this.FRUIT_TYPE = 'banana';
    this.ENEMIES = 4;
  }

  public getBoardDTO(): BoardDTO {
    return {
      host: this.host?.getId() || null,
      guest: this.guest?.getId() || null,
      fruitType: this.FRUIT_TYPE,
      enemies: this.ENEMIES,
      enemiesCoordinates: this.enemiesCoordinates,
      fruitsCoordinates: this.fruitsCoordinates,
      fruits: this.FRUITS,
      playersStartCoordinates: this.playersStartCoordinates,
      board: this.cellsBoardDTO(),
    };
  }

  private cellsBoardDTO(): CellDTO[][] {
    return this.board.map((row) => row.map((cell) => cell.getCellDTO()));
  }

  protected setUpInmovableObjects(): void {
    // TODO --> Priority 3 <-- Implement this method
  }

  public win(): void {
    // TODO --> Stop all the threads of the enemies, the timer and the players
  }
}
