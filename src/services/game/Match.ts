import type Player from './characters/Player.js';

class Match {
  private id: string; // Should be auto-generated
  private level: number;
  private map: string; // Should be a Map object
  private players: Player[] = [];
  constructor(id: string, level: number, map: string) {
    this.id = id;
    this.level = level;
    this.map = map;
  }
  public addPlayer(player: Player): void {
    this.players.push(player);
  }
  public removePlayer(player: Player): void {
    this.players = this.players.filter((p) => p !== player);
  }

  public getId(): string {
    return this.id;
  }
}
export default Match;
