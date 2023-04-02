import { Middleware } from 'https://deno.land/x/oak@v12.1.0/mod.ts'

const captcha = `${Deno.env.get('CAPTCHA_PUBLIC')}`

const body = Deno.readTextFileSync('./src/assets/index.html').replaceAll('<!--captcha-->', captcha)

export const index: Middleware = ({ response }) => (response.body = body);
