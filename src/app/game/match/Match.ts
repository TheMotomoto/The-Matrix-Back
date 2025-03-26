import type { MatchDTO } from '../../../schemas/zod.js';
import type Player from '../characters/players/Player.js';
import type Board from './boards/Board.js';
import BoardDifficulty1 from './boards/BoardDifficulty1.js';
class Match {
  private id: string; // Should be auto-generated
  private level: number;
  private map: string; // Should be a Map object
  private host: string;
  private guest: string;
  private started: boolean;
  private readonly board: Board;
  constructor(id: string, level: number, map: string, host: string, guest: string) {
    this.id = id;
    this.level = level;
    this.map = map;
    this.host = host;
    this.guest = guest;
    this.board = new BoardDifficulty1(this.map, this.level);
    this.started = false;
  }

  public getMatchDTO(): MatchDTO {
    return {
      id: this.id,
      level: this.level,
      map: this.map,
      host: this.host,
      guest: this.guest,
      board: this.board.getBoardDTO(),
    };
  }

  public getPlayer(id: string): Player | null {
    const player = id === this.host ? this.board.getHost() : this.board.getGuest();
    return player;
  }

  public getId(): string {
    return this.id;
  }

  public getHost(): string {
    return this.host;
  }

  public getGuest(): string {
    return this.guest;
  }

  public async start(): Promise<void> {
    if (this.started) return;
    this.board.start(this.host, this.guest);
    this.started = true;
  }
}
export default Match;
