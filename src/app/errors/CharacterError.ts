export default class CharacterError extends Error {
  public static readonly NOT_FOUND = 'Player not found';
  public static readonly NULL_CELL = 'Player has no cell';
  public static readonly INVALID_CELL = 'Invalid cell';
  public static readonly INVALID_MOVEMENT = 'The movement is invalid';
  public static readonly OUT_OF_BOUNDS = 'The movement is out of bounds';
  public static readonly BLOCKED_CELL: string | undefined;
}
