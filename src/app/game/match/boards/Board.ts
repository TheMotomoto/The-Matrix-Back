import type Enemy from '../../characters/enemies/Enemy.js';
import type Player from '../../characters/players/Player.js';
import type Cell from './CellBoard.js';
import type { CellCoordinates } from './CellBoard.js';
import type Fruit from './Fruit.js';
abstract class Board {
  protected readonly ROWS: number;
  protected readonly COLS: number;
  protected readonly map: string;
  protected readonly level: number;
  protected host: Player | null = null;
  protected guest: Player | null = null;
  protected board: Cell[][];
  protected enemies: Enemy[];
  protected fruits: Map<CellCoordinates, Fruit>;
  protected fruitsNumber = 0;

  protected abstract generateBoard(): void;
  protected abstract setUpEnemies(): void;
  protected abstract setUpFruits(): void;
  protected abstract setUpPlayers(host: string, guest: string): void;
  protected abstract setUpInmovableObjects(): void;
  protected abstract loadContext(): void;

  constructor(map: string, level: number) {
    this.ROWS = 16;
    this.COLS = 16;
    this.board = [];
    this.enemies = [];
    this.fruits = new Map();
    this.map = map;
    this.level = level;
    this.loadContext();
    this.generateBoard();
    this.setUpEnemies();
    this.setUpFruits();
    this.setUpInmovableObjects();
  }

  public removeFruit({ x, y }: CellCoordinates): void {
    this.board[x][y].setItem(null);
    this.fruitsNumber--;
    this.fruits.delete({ x, y });
  }

  public getBoard(): Cell[][] {
    return this.board;
  }
  public getFruitsNumber(): number {
    return this.fruitsNumber;
  }
  public getEnemies(): Enemy[] {
    return this.enemies;
  }
  public getHost(): Player | null {
    return this.host;
  }

  public getGuest(): Player | null {
    return this.guest;
  }

  public abstract win(): void;

  public start(host: string, guest: string): void {
    this.setUpPlayers(host, guest);
    // TODO
    // Start threads of enemies
  }
}
export default Board;
