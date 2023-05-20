import { Middleware } from 'oak'

const captcha = `${Deno.env.get('CAPTCHA_PUBLIC')}`

const body = Deno.readTextFileSync('./src/assets/index.html').replaceAll('<!--captcha-->', captcha)

export const index: Middleware = ({ response }) => (response.body = body);
