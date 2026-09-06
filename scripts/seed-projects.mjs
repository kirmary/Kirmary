import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { PrismaClient } from '@prisma/client'

const here = dirname(fileURLToPath(import.meta.url))
const sourcePath = resolve(here, '../lib/site-content.ts')

function readStaticProjects(source) {
  const marker = 'export const projects='
  const start = source.indexOf(marker)
  const end = source.indexOf('] as const;', start)

  if (start < 0 || end < 0) {
    throw new Error('Could not find the static projects array.')
  }

  return Function(`return ${source.slice(start + marker.length, end + 1)}`)()
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const source = await readFile(sourcePath, 'utf8')
const projects = readStaticProjects(source)

if (!Array.isArray(projects) || projects.length !== 24) {
  throw new Error(`Expected 24 static projects, received ${projects.length}.`)
}

const rows = projects.map((project, index) => ({
  slug: slugify(project.name),
  name: project.name,
  nameAr: project.ar,
  image: project.image,
  subtitle: project.subtitle ?? null,
  subtitleAr: null,
  sortOrder: index + 1,
}))

const slugs = new Set(rows.map(row => row.slug))
if (slugs.size !== rows.length || rows.some(row => !row.slug)) {
  throw new Error('Static project names do not produce unique non-empty slugs.')
}

const prisma = new PrismaClient()

try {
  for (const row of rows) {
    const existing = await prisma.project.findUnique({ where: { slug: row.slug } })

    if (existing) {
      const mismatch =
        existing.name !== row.name ||
        existing.nameAr !== row.nameAr ||
        existing.image !== row.image ||
        existing.subtitle !== row.subtitle ||
        existing.subtitleAr !== null ||
        existing.sortOrder !== row.sortOrder

      if (mismatch) {
        throw new Error(`Existing project ${row.slug} differs from the static migration snapshot.`)
      }

      continue
    }

    await prisma.project.create({
      data: {
        ...row,
        visible: true,
      },
    })
  }

  const migrated = await prisma.project.findMany({
    orderBy: { sortOrder: 'asc' },
    select: {
      slug: true,
      name: true,
      nameAr: true,
      image: true,
      subtitle: true,
      subtitleAr: true,
      sortOrder: true,
    },
  })

  if (migrated.length !== rows.length) {
    throw new Error(`Expected ${rows.length} database projects, found ${migrated.length}.`)
  }

  for (const [index, row] of rows.entries()) {
    const saved = migrated[index]
    if (!saved || Object.keys(row).some(key => saved[key] !== row[key])) {
      throw new Error(`Project verification failed at sort order ${row.sortOrder}.`)
    }
  }

  console.log(`Verified ${migrated.length} projects from the static snapshot.`)
} finally {
  await prisma.$disconnect()
}
