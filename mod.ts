import { Application } from 'https://deno.land/x/oak@v12.1.0/mod.ts'

import { router } from '~/router.ts'
import { requestHandler } from '~/middleware/mod.ts'

const port = +`${Deno.env.get('PORT')}`
if (!port) throw new Error('no application port defined')

new Application()
  .use(requestHandler)

  .use(router.routes())
  .use(router.allowedMethods())

  .listen({ port })

console.log(`🚀 resume is listeling on port ${port}`)
