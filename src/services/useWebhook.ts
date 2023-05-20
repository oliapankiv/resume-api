const secret = Deno.env.get('WEBHOOK')
if (!secret) throw new Error('no secret defined')

const encodr = new TextEncoder()
const algorithm: HmacImportParams = { name: 'hmac', hash: 'sha-256' }
const key = await crypto.subtle.importKey('raw', encodr.encode(secret), algorithm, false, ['sign']);

export const useWebhook = () => {
  const verify = async (signature: string, payload: unknown): Promise<boolean> => {
    const checksum = await crypto.subtle.sign(algorithm.name, key, encodr.encode(JSON.stringify(payload)))
    const hex = [...new Uint8Array(checksum)].map((byte) => byte.toString(16).padStart(2, '0')).join('')

    return signature === hex
  }

  return { verify }
}
