import { Middleware } from 'https://deno.land/x/oak@v12.1.0/mod.ts'

const body = Deno.readFileSync('./src/assets/favicon.ico')

export const favicon: Middleware = ({ response }) => (response.body = body);
