import { PrismaClient } from "@prisma/client"
import fs from "fs"
import path from "path"

const prisma = new PrismaClient()

const sections = [
  "nfpa-exhibition",
  "intersec-dubai-exhibition",
  "firex-exhibition",
  "cairo-ict-exhibition",
  "kirmary-international-llc",
  "bristol",
  "spp",
  "viking",
  "tiger-steel-erw-pipes",
  "lede",
  "mech",
  "zurn",
  "general",
]

const imageExtensions = /\.(jpg|jpeg|png|webp|gif|avif)$/i

async function main() {
  const galleryPath = path.join(process.cwd(), "public", "gallery")

  let imported = 0

  for (const section of sections) {
    const folderPath = path.join(galleryPath, section)

    if (!fs.existsSync(folderPath)) {
      console.log(`⚠️ Folder not found: ${section}`)
      continue
    }

    const files = fs
      .readdirSync(folderPath)
      .filter((file) => imageExtensions.test(file))

    let sortOrder = 0

    for (const file of files) {
      const imagePath = `/gallery/${section}/${encodeURIComponent(file)}`

      const existing = await prisma.galleryImage.findFirst({
        where: {
          image: imagePath,
        },
      })

      if (existing) {
        continue
      }

      await prisma.galleryImage.create({
        data: {
          title: file.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          titleAr: file.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
          image: imagePath,
          category: "Gallery",
          section,
          sortOrder,
          visible: true,
          featured: false,
        },
      })

      imported++
      sortOrder++

      console.log(`✓ ${section}/${file}`)
    }
  }

  console.log(`\n✅ Imported ${imported} new images.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })