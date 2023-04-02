import { Middleware, HttpError } from 'https://deno.land/x/oak@v12.1.0/mod.ts'

export class ApiError extends Error {
  constructor (message: string) { super(message) }
}

export const requestHandler: Middleware = ({ response }, next) => next().then(() => {
  response.status === 404 && (response.body = { error: 'not found.' })
})

export const errorHandler: Middleware = ({ response }, next) => next().catch((err) => {
  response.body = { error: (err instanceof ApiError || err instanceof HttpError) ? err.message : 'something went wrong.' }
})
