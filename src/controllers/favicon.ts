import { Middleware, Status } from 'https://deno.land/x/oak@v12.1.0/mod.ts'

export const favicon: Middleware = ({ response }) => (response.status = Status.OK);
