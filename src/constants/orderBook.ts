export enum ErrorCode {
  PAIR_NOT_SUPPORTED = 1000,
  OPERATION_NOT_SUPPORTED = 1001,
  INVALID_REQUEST = 1002,
  TOPIC_NOT_EXIST = 1005,
  USER_MSG_BUFFER_FULL = 1007,
  MAX_FAILED_ATTEMPTS = 1008
}

export enum ConnectionStatus {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3
}