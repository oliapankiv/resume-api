import { Middleware, Status } from 'oak'

import { useResume } from '~/services/mod.ts'
import { Constants, TurnstileResponse } from '~/types/mod.ts'

const turnstile = `${Deno.env.get('TURNSTILE_PRIVATE')}`

const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

const validator: Middleware = async (ctx: Parameters<Middleware>[0], next) => {
   const form = await ctx.request.body.formData().catch(() => undefined)
   const token = form?.get('token')

   ctx.assert(token, Status.BadRequest)

   const body = new FormData()
   body.append('secret', turnstile)
   body.append('response', token)

   const { success }: TurnstileResponse = await fetch(url, { method: 'POST', body }).then((res) => res.json())

   ctx.assert(success, Status.Forbidden, 'detected suspicious activity')

   return next()
}

const handler: Middleware = ({ response }) => {
   const { context: { resume } } = useResume()

   resume?.tag && response.headers.append('x-tag', resume.tag)
   // resume?.hash && response.headers.append('etag', `W/"${resume.hash}"`)
   resume?.publishedAt && response.headers.append('x-published-at', resume.publishedAt)

   response.headers.append('content-type', 'application/pdf')
   response.headers.append('content-disposition', `inline; filename="${Constants.RESUME_FILE_NAME}"`)

   response.body = resume?.blob
}

export const resume = [validator, handler] as const
