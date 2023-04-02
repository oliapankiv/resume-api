export enum CaptchaError {
  BAD_REQUEST = 'bad-request',
  TIMEOUT_O_DUPLICATE = 'timeout-or-duplicate',
  MISSING_INPUT_SECRET = 'missing-input-secret',
  INVALID_INPUT_SECRET = 'invalid-input-secret',
  MISSING_INPUT_RESPONSE = 'missing-input-response',
  INVALID_INPUT_RESPONSE = 'invalid-input-response'
}

export type CaptchaResponse = {
  success: boolean
  score?: number
  action?: string
  hostname?: string
  challenge_ts?: string
  'error-codes'?: CaptchaError[]
}
