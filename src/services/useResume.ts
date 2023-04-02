import { Resume, Release } from '~/types/mod.ts'

const github = Deno.env.get('GITHUB')
if (!github) throw new Error('no github token defined')

const base = 'https://api.github.com/repos/dasph/resume/releases'

const accept= 'application/octet-stream'
const authorization = `Bearer ${github}`

const context = { resume: undefined as Resume | undefined }

const fetchLatestRelease = async (): Promise<Release> => {
  return fetch(`${base}/latest`, { headers: { authorization } }).then((res) => res.json())
}

const fetchAsset = async (id: number): Promise<Blob> => {
  return fetch(`${base}/assets/${id}`, { headers: { accept, authorization } }).then((res) => res.blob())
}

const fetchLatestResume = async (): Promise<Resume> => {
  const { assets: [{ id }], tag_name: tag, published_at: publishedAt } = await fetchLatestRelease()

  console.log(`✅ fetched latest [v${tag}, published on: ${new Date(publishedAt).toUTCString()}] resume | ${new Date().toUTCString()}`)

  return context.resume = { id, tag, publishedAt, blob: await fetchAsset(id) }
}

await fetchLatestResume();

export const useResume = () => {
  return {
    context,
    fetchLatestResume
  }
}
