class Match {
  private id: string; // Should be auto-generated
  private level: number;
  private map: string; // Should be a Map object
  private host: string;
  private guest: string;
  constructor(id: string, level: number, map: string, host: string, guest: string) {
    this.id = id;
    this.level = level;
    this.map = map;
    this.host = host;
    this.guest = guest;
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
}
export default Match;
