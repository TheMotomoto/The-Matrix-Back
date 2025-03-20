export default class CharacterError extends Error {
  public static NOT_FOUND = 'Player not found';
  public static NULL_CELL = 'Player has no cell';
  public static INVALID_CELL = 'Invalid cell';
  public static INVALID_MOVEMENT = 'The movement is invalid';
  public static OUT_OF_BOUNDS = 'The movement is out of bounds';
  static BLOCKED_CELL: string | undefined;
}
