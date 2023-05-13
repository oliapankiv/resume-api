import { Middleware, Status } from 'https://deno.land/x/oak@v12.1.0/mod.ts'

import { useResume } from '~/services/mod.ts'
import { CaptchaResponse, Constants } from '~/types/mod.ts'

const captcha = `${Deno.env.get('CAPTCHA_PRIVATE')}`

const url = 'https://www.google.com/recaptcha/api/siteverify'

const validator: Middleware = async (ctx, next) => {
   const form = await ctx.request.body({ type: 'form', limit: 2 * 1024 }).value

   const body = new FormData()
   body.append('secret', captcha)
   body.append('response', `${form.get('token')}`)

   const { success, score } = await fetch(url, { method: 'POST', body }).then(async (res) => (await res.json()) as CaptchaResponse)

   if (!success || !score || score < 0.7) return ctx.throw(Status.Forbidden, 'detected suspicious activity')

   return next()
}

const handler: Middleware = ({ response }) => {
   const { context: { resume } } = useResume()

   resume?.tag && response.headers.append('x-tag', resume.tag)
   // resume?.hash && response.headers.append('etag', `W/"${resume.hash}"`)
   resume?.publishedAt && response.headers.append('x-published-at', resume.publishedAt)

   response.headers.append('content-disposition', `inline; filename="${Constants.RESUME_FILE_NAME}"`)

   response.body = resume?.blob
}

export const resume = [validator, handler] as const
