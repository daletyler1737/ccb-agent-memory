/**
 * Agent Memory Snapshot
 */
import { writeFileSync, mkdirSync, readdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

const SNAPSHOT_DIR = join(homedir(), '.openclaw', 'snapshots')

interface SnapshotMeta {
  id: string
  createdAt: string
  summary: string
  messageCount: number
  toolCount: number
  model: string
}

function getSnapshotId(): string {
  mkdirSync(SNAPSHOT_DIR, { recursive: true })
  const existing = readdirSync(SNAPSHOT_DIR)
    .filter(f => f.startsWith('snapshot_'))
  return `snapshot_${String(existing.length + 1).padStart(3, '0')}`
}

export function createSnapshot(options: {
  summary: string
  messages?: object[]
  tools?: object[]
  decisions?: string[]
  files?: string[]
  model?: string
}): SnapshotMeta {
  const id = getSnapshotId()
  const dir = join(SNAPSHOT_DIR, id)
  mkdirSync(dir, { recursive: true })

  const meta: SnapshotMeta = {
    id,
    createdAt: new Date().toISOString(),
    summary: options.summary,
    messageCount: options.messages?.length || 0,
    toolCount: options.tools?.length || 0,
    model: options.model || 'unknown'
  }

  writeFileSync(join(dir, 'meta.json'), JSON.stringify(meta, null, 2))

  if (options.messages) {
    writeFileSync(join(dir, 'messages.json'), JSON.stringify(options.messages, null, 2))
  }
  if (options.tools) {
    writeFileSync(join(dir, 'tools.json'), JSON.stringify(options.tools, null, 2))
  }
  if (options.decisions) {
    writeFileSync(join(dir, 'decisions.json'), JSON.stringify(options.decisions, null, 2))
  }
  if (options.files) {
    writeFileSync(join(dir, 'files.json'), JSON.stringify(options.files, null, 2))
  }

  return meta
}

export function listSnapshots(): SnapshotMeta[] {
  mkdirSync(SNAPSHOT_DIR, { recursive: true })
  return readdirSync(SNAPSHOT_DIR)
    .filter(f => f.startsWith('snapshot_'))
    .map(f => {
      try {
        return JSON.parse(readFileSync(join(SNAPSHOT_DIR, f, 'meta.json'), 'utf-8'))
      } catch {
        return null
      }
    })
    .filter(Boolean)
    .sort((a: SnapshotMeta, b: SnapshotMeta) => b.createdAt.localeCompare(a.createdAt))
}

export function loadSnapshot(id: string): object | null {
  const dir = join(SNAPSHOT_DIR, `snapshot_${id}`)
  if (!existsSync(dir)) return null
  try {
    const messages = JSON.parse(readFileSync(join(dir, 'messages.json'), 'utf-8'))
    const tools = JSON.parse(readFileSync(join(dir, 'tools.json'), 'utf-8'))
    const decisions = JSON.parse(readFileSync(join(dir, 'decisions.json'), 'utf-8'))
    const files = JSON.parse(readFileSync(join(dir, 'files.json'), 'utf-8'))
    return { messages, tools, decisions, files }
  } catch {
    return null
  }
}

// CLI
if (import.meta.url.endsWith(process.argv[1]?.replace(/^file:\/\//, '') || '')) {
  const subcommand = process.argv[2]
  const arg = process.argv[3]

  if (subcommand === 'save') {
    const result = createSnapshot({ summary: arg || 'Manual snapshot' })
    console.log(`✓ Snapshot saved: ${result.id}`)
  } else if (subcommand === 'list') {
    const snapshots = listSnapshots()
    console.log('\n  Snapshots\n')
    for (const s of snapshots as SnapshotMeta[]) {
      console.log(`  ${s.id}  ${s.createdAt}  ${s.summary}`)
    }
    console.log()
  } else if (subcommand === 'load') {
    const data = loadSnapshot(arg!)
    console.log(JSON.stringify(data, null, 2))
  } else {
    console.log('Usage: node snapshot.ts save|list|load [args]')
  }
}
