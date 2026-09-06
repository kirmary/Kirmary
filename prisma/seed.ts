import { db } from "../lib/db"
import { ownedProducts, orbitalItems } from "../lib/site-content"

// Brand isn't a field in `ownedProducts` — the closest existing signal is
// the orbital ring's "eyebrow" label (e.g. "SPP", "LEDE", "VAL-MATIC").
// Matched by array position: both arrays list the same 16 products in the
// same order (their `id` strings differ for 3 entries, so position is the
// reliable join key here, not `id`).
const brandBySlug = new Map(
  ownedProducts.map((product, index) => [
    product.id,
    orbitalItems[index]?.eyebrow ?? null,
  ])
)

async function main() {
  let created = 0
  let updated = 0

  for (const product of ownedProducts) {
    const sortOrder = Number(product.number)

    // Fields we always keep in sync with the static source on every run.
    const syncedFields = {
      number: product.number,
      name: product.name,
      nameAr: product.ar,
      description: product.description,
      descriptionAr: product.descriptionAr,
      image: product.image,
      tags: [...product.tags],
      brand: brandBySlug.get(product.id) ?? null,
      sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
    }

    const existing = await db.product.findUnique({
      where: { slug: product.id },
    })

    await db.product.upsert({
      where: { slug: product.id },
      // Only set on first insert — re-running this script won't undo
      // an admin's later "hide" or "feature" action in the dashboard.
      create: {
        slug: product.id,
        category: null,
        visible: true,
        featured: false,
        ...syncedFields,
      },
      update: syncedFields,
    })

    if (existing) updated++
    else created++
  }

  console.log(
    `Seed complete: ${created} created, ${updated} updated, ${ownedProducts.length} total in source.`
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await db.$disconnect()
  })