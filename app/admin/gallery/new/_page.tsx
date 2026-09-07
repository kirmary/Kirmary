import { db } from "../../../../lib/db";
import { requireAdmin } from "../../../../lib/admin-auth";
import GalleryImageForm from "./gallery-image-form";
export default async function NewGalleryImagePage() {
  await requireAdmin();
  const sections = await db.gallerySection.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return (
    <GalleryImageForm
      sections={sections.map((s) => ({ value: s.slug, label: s.name }))}
    />
  );
}
