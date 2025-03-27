export default class WebSocketError extends Error {
  public static readonly BAD_WEB_SOCKET_REQUEST = 'The provided WebSocket request is invalid';
  public static readonly MATCH_NOT_FOUND = 'The requested match was not found';
}
