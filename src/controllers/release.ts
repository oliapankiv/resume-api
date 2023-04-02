import { crypto } from 'https://deno.land/std@0.182.0/crypto/mod.ts'
import { Middleware, Status } from 'https://deno.land/x/oak@v12.1.0/mod.ts'

import { useResume } from '~/services/mod.ts'

const secret = Deno.env.get('GITHUB')
if (!secret) throw new Error('no secret defined')

const encodr = new TextEncoder()
const algorithm: HmacImportParams = { name: 'hmac', hash: 'sha-256' }
const key = await crypto.subtle.importKey('raw', encodr.encode(secret), algorithm, false, ['sign']);

const validator: Middleware = async (ctx, next) => {
  const payload = await ctx.request.body({ type: 'json', limit: 64 * 1024 }).value
  if (!payload) return ctx.throw(Status.BadRequest, 'missing payload')

  if (payload.action !== 'released') return  ctx.response.status = Status.Continue

  const signature = ctx.request.headers.get('x-hub-signature-256')
  if (!signature) return ctx.throw(Status.BadRequest, 'missing signature')

  const checksum = await crypto.subtle.sign(algorithm.name, key, encodr.encode(JSON.stringify(payload)))
  const hex = [...new Uint8Array(checksum)].map((byte) => byte.toString(16).padStart(2, '0')).join('')

  console.log('github:', signature.slice(7))
  console.log('mine:', hex)

  return signature.slice(7) === hex ? next() : ctx.throw(Status.Unauthorized, 'signature mismatch')
}

const handler: Middleware = async (ctx) => {
  const { fetchLatestResume } = useResume()

  const resume = await fetchLatestResume()
  if (!resume) return ctx.throw(Status.BadRequest, 'webhook: failed to fetch latest resume')

  ctx.response.status = Status.OK
}

export const release = [validator, handler] as const
