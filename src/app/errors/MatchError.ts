export default class MatchError extends Error {
  public static readonly MATCH_NOT_FOUND = 'The requested match was not found';
  public static readonly MATCH_CANNOT_BE_CREATED = 'The match cannot be created';
}
