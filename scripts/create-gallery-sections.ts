import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const sections = [
  {
    name: "NFPA Exhibition",
    nameAr: "معرض NFPA",
    slug: "nfpa-exhibition",
    sortOrder: 1,
  },
  {
    name: "Intersec Dubai Exhibition",
    nameAr: "معرض Intersec Dubai",
    slug: "intersec-dubai-exhibition",
    sortOrder: 2,
  },
  {
    name: "FIREX Exhibition",
    nameAr: "معرض FIREX",
    slug: "firex-exhibition",
    sortOrder: 3,
  },
  {
    name: "CAIRO ICT Exhibition",
    nameAr: "معرض CAIRO ICT",
    slug: "cairo-ict-exhibition",
    sortOrder: 4,
  },
  {
    name: "KIRMARY International L.L.C.",
    nameAr: "KIRMARY International L.L.C.",
    slug: "kirmary-international-llc",
    sortOrder: 5,
  },
  {
    name: "Bristol",
    nameAr: "Bristol",
    slug: "bristol",
    sortOrder: 6,
  },
  {
    name: "SPP",
    nameAr: "SPP",
    slug: "spp",
    sortOrder: 7,
  },
  {
    name: "Viking",
    nameAr: "Viking",
    slug: "viking",
    sortOrder: 8,
  },
  {
    name: "Tiger Steel ERW Pipes",
    nameAr: "Tiger Steel ERW Pipes",
    slug: "tiger-steel-erw-pipes",
    sortOrder: 9,
  },
  {
    name: "LEDE",
    nameAr: "LEDE",
    slug: "lede",
    sortOrder: 10,
  },
  {
    name: "MECH",
    nameAr: "MECH",
    slug: "mech",
    sortOrder: 11,
  },
  {
    name: "Zurn",
    nameAr: "Zurn",
    slug: "zurn",
    sortOrder: 12,
  },
  {
    name: "General",
    nameAr: "عام",
    slug: "general",
    sortOrder: 13,
  },
]

async function main() {
  for (const section of sections) {
    await (prisma as any).gallerySection.upsert({
      where: {
        slug: section.slug,
      },
      update: {
        name: section.name,
        nameAr: section.nameAr,
        visible: true,
        sortOrder: section.sortOrder,
      },
      create: {
        name: section.name,
        nameAr: section.nameAr,
        slug: section.slug,
        visible: true,
        sortOrder: section.sortOrder,
      },
    })

    console.log(`✓ ${section.name}`)
  }

  console.log("")
  console.log("✅ 13 Gallery Sections are ready.")
  console.log("✅ Existing Gallery Images were NOT changed.")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })