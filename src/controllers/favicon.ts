import { Middleware } from 'oak'

const type = 'image/vnd.microsoft.icon'
const body = Deno.readFileSync('./src/assets/favicon.ico')

export const favicon: Middleware = ({ response }) => Object.assign(response, { body, type });
