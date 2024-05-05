export enum TurnstileError {
  BAD_REQUEST = 'bad-request',
  TIMEOUT_OR_DUPLICATE = 'timeout-or-duplicate',
  MISSING_INPUT_SECRET = 'missing-input-secret',
  INVALID_INPUT_SECRET = 'invalid-input-secret',
  MISSING_INPUT_RESPONSE = 'missing-input-response',
  INVALID_INPUT_RESPONSE = 'invalid-input-response'
}

export type TurnstileResponse = {
  success: boolean
  action?: string
  hostname?: string
  challenge_ts?: string
  'error-codes'?: TurnstileError[]
}
