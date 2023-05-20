import { Middleware, Status } from 'https://deno.land/x/oak@v12.1.0/mod.ts'

import { useResume, useWebhook } from '~/services/mod.ts'

const validator: Middleware = async (ctx, next) => {
  const { verify } = useWebhook()

  const payload = await ctx.request.body({ type: 'json', limit: 64 * 1024 }).value
  if (!payload) return ctx.throw(Status.BadRequest, 'missing payload')

  if (payload.action !== 'released') return ctx.response.status = Status.OK

  const signature = ctx.request.headers.get('x-hub-signature-256')
  if (!signature) return ctx.throw(Status.BadRequest, 'missing signature')

  const isValid = await verify(signature, payload)

  return isValid ? next() : ctx.throw(Status.Unauthorized, 'signature mismatch')
}

const handler: Middleware = async (ctx) => {
  const { fetchLatestResume } = useResume()

  const resume = await fetchLatestResume()
  if (!resume) return ctx.throw(Status.BadRequest, 'webhook: failed to fetch latest resume')

  ctx.response.status = Status.OK
}

export const release = [validator, handler] as const
