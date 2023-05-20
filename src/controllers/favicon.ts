import { Middleware } from 'oak'

const body = Deno.readFileSync('./src/assets/favicon.ico')

export const favicon: Middleware = ({ response }) => (response.body = body);
