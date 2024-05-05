import { Middleware } from 'oak'

const turnstile = `${Deno.env.get('TURNSTILE_PUBLIC')}`

const body = Deno.readTextFileSync('./src/assets/index.html').replaceAll('<!--turnstile-->', turnstile)

export const index: Middleware = ({ response }) => (response.body = body);
