export default class PlayerError extends Error {
  public static NOT_FOUND = 'Player not found';
  public static NULL_CELL = 'Player has no cell';
  public static INVALID_CELL = 'Invalid cell';
}
