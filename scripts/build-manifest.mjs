#!/usr/bin/env node
/**
 * Regenerates `latest.json` from a published GitHub release.
 *
 * `latest.json` is the only thing Memento fetches over the network. The app compares its own
 * version against it and, if a newer one exists, shows a banner linking to the download page. It
 * never downloads or installs anything itself — there is no code signature to verify an update
 * against, so silently executing a downloaded binary would be handing the machine to whoever
 * controls the delivery channel.
 *
 * Checksums are computed here rather than copied from electron-builder's `latest.yml` because that
 * file only covers the NSIS installer, and it carries sha512 while the README tells people to
 * verify with `certutil ... SHA256`. One hash, one algorithm, both artifacts.
 *
 * Runs in CI on `release: published` (see `.github/workflows/manifest.yml`) and by hand:
 *
 *     node scripts/build-manifest.mjs v1.0.0
 *
 * With no tag it reads whatever release GitHub currently considers latest.
 */
import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { Readable } from 'node:stream'

const OWNER = process.env.MANIFEST_OWNER ?? 'ShadowDevMaster'
const REPO = process.env.MANIFEST_REPO ?? 'Memento-releases'

const MANIFEST = resolve(process.cwd(), 'latest.json')

/**
 * Artifact names come from `win.artifactName` and `nsis.artifactName` in Memento's
 * electron-builder.json. Anything else a release carries — `latest.yml`, `.blockmap` files,
 * screenshots — is deliberately ignored rather than guessed at.
 */
const KINDS = [
  { key: 'setup', match: (name) => /^Memento-Setup-.+\.exe$/.test(name), required: true },
  { key: 'portable', match: (name) => /^Memento_.+\.exe$/.test(name), required: false },
]

function api(path) {
  const headers = { accept: 'application/vnd.github+json', 'user-agent': 'memento-manifest' }
  // Optional for a public repo, but CI would otherwise share the runner's 60 req/h anonymous quota.
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return fetch(`https://api.github.com/repos/${OWNER}/${REPO}${path}`, { headers })
}

async function fetchRelease(tag) {
  const res = await api(tag ? `/releases/tags/${tag}` : '/releases/latest')
  if (res.status === 404) {
    throw new Error(tag ? `No release tagged ${tag} in ${OWNER}/${REPO}` : `${OWNER}/${REPO} has no published release yet`)
  }
  if (!res.ok) throw new Error(`GitHub API returned ${res.status} ${res.statusText}`)
  return res.json()
}

/** Streamed, because the installer is well over a hundred megabytes and CI runners are not roomy. */
async function sha256(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'memento-manifest' }, redirect: 'follow' })
  if (!res.ok) throw new Error(`Downloading ${url} failed: ${res.status} ${res.statusText}`)

  const hash = createHash('sha256')
  for await (const chunk of Readable.fromWeb(res.body)) hash.update(chunk)
  return hash.digest('hex')
}

const tag = process.argv[2]
const release = await fetchRelease(tag)

if (release.draft) {
  throw new Error(`Release ${release.tag_name} is still a draft. Publish it before building the manifest.`)
}

const artifacts = {}

for (const kind of KINDS) {
  const asset = release.assets.find((a) => kind.match(a.name))

  if (!asset) {
    if (kind.required) throw new Error(`Release ${release.tag_name} has no ${kind.key} artifact`)
    console.warn(`! no ${kind.key} artifact in ${release.tag_name}, leaving it null`)
    artifacts[kind.key] = { name: null, url: null, size: 0, sha256: null }
    continue
  }

  console.log(`· hashing ${asset.name} (${(asset.size / 1e6).toFixed(1)} MB)`)
  artifacts[kind.key] = {
    name: asset.name,
    url: asset.browser_download_url,
    size: asset.size,
    sha256: await sha256(asset.browser_download_url),
  }
}

const manifest = {
  version: release.tag_name.replace(/^v/, ''),
  publishedAt: release.published_at,
  notesUrl: release.html_url,
  downloadPage: `https://github.com/${OWNER}/${REPO}/releases/latest`,
  artifacts: { 'win-x64': artifacts },
}

writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`✓ latest.json now describes ${manifest.version}`)
