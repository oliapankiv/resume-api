import { Router } from 'oak'

import { errorHandler } from '~/middleware/mod.ts'
import { favicon, index, resume, release } from '~/controllers/mod.ts'

export const router = new Router({ strict: true, sensitive: true })
  .use(errorHandler)

  .get('/', index)
  .post('/', ...resume)

  .post('/wh/release', ...release)

  .get('/favicon.ico', favicon)
