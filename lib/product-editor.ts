import { Prisma } from "@prisma/client";
import { safeContentUrl, validSlug } from "./local-upload";

export function productEditorData(form: FormData) {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const slug = text("slug");
  if (!validSlug(slug))
    throw new Error("Use lowercase letters, numbers and hyphens for the slug.");
  if (!text("name") || !text("nameAr") || !text("number"))
    throw new Error("Product number and both names are required.");
  const sortOrder = Number(text("sortOrder") || 0);
  if (!Number.isSafeInteger(sortOrder))
    throw new Error("Sort order must be an integer.");
  return {
    slug,
    number: text("number"),
    name: text("name"),
    nameAr: text("nameAr"),
    description: text("description"),
    descriptionAr: text("descriptionAr"),
    image: safeContentUrl(text("image")) || null,
    coverImage: safeContentUrl(text("coverImage")) || null,
    subtitle: text("subtitle") || null,
    subtitleAr: text("subtitleAr") || null,
    brand: text("brand") || null,
    category: text("category") || null,
    tags: text("tags")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    sortOrder,
    visible: form.get("visible") === "on",
    featured: form.get("featured") === "on",
    contentManaged: form.get("contentManaged") === "on",
  };
}

export function productRows(form: FormData) {
  function rows(key: string) {
    const value: unknown = JSON.parse(String(form.get(key) || "[]"));
    if (!Array.isArray(value) || value.length > 200)
      throw new Error("Too many content rows.");
    return value.map((row: unknown) => {
      if (!row || typeof row !== "object" || Array.isArray(row))
        throw new Error("Invalid content row.");
      const r = row as Record<string, unknown>;
      const str = (key: string) =>
        typeof r[key] === "string" ? (r[key] as string).trim() : "";
      const sortOrder = Number(r.sortOrder);
      if (!str("title") || !Number.isSafeInteger(sortOrder))
        throw new Error(
          "Every row needs an English title and integer sort order.",
        );
      return {
        id: str("id"),
        title: str("title"),
        titleAr: str("titleAr"),
        visible: r.visible === true,
        sortOrder,
        description: str("description"),
        descriptionAr: str("descriptionAr"),
        documentUrl: safeContentUrl(str("documentUrl")) || null,
        linkLabel: str("linkLabel") || null,
        fileUrl: safeContentUrl(str("fileUrl")),
        originalFileName: str("originalFileName"),
        documentType: str("documentType"),
      };
    });
  }
  const features = rows("features").map(
    ({
      id,
      title,
      titleAr,
      visible,
      sortOrder,
      description,
      descriptionAr,
      documentUrl,
      linkLabel,
    }) => ({
      id,
      title,
      titleAr,
      visible,
      sortOrder,
      description,
      descriptionAr,
      documentUrl,
      linkLabel,
    }),
  );
  const documents = rows("documents").map(
    ({
      id,
      title,
      titleAr,
      visible,
      sortOrder,
      fileUrl,
      originalFileName,
      documentType,
    }) => {
      if (!fileUrl || !documentType)
        throw new Error("Technical files need a file and document type.");
      return {
        id,
        title,
        titleAr,
        visible,
        sortOrder,
        fileUrl,
        originalFileName,
        documentType,
      };
    },
  );
  return { features, documents };
}

export async function saveProductRows(
  tx: Prisma.TransactionClient,
  productId: string,
  rows: ReturnType<typeof productRows>,
) {
  // Only associations owned by this product are removed. Files are never deleted.
  for (const kind of ["features", "documents"] as const) {
    const entries = rows[kind];
    const ids = entries.map((r) => r.id).filter(Boolean);
    const owned =
      kind === "features"
        ? await tx.productFeature.findMany({
            where: { productId },
            select: { id: true },
          })
        : await tx.productDocument.findMany({
            where: { productId },
            select: { id: true },
          });
    if (ids.some((id) => !owned.some((row) => row.id === id)))
      throw new Error("Content row does not belong to this product.");
  }
  await tx.productFeature.deleteMany({
    where: {
      productId,
      id: { notIn: rows.features.map((r) => r.id).filter(Boolean) },
    },
  });
  await tx.productDocument.deleteMany({
    where: {
      productId,
      id: { notIn: rows.documents.map((r) => r.id).filter(Boolean) },
    },
  });
  for (const { id, ...data } of rows.features) {
    if (id) await tx.productFeature.update({ where: { id }, data });
    else await tx.productFeature.create({ data: { ...data, productId } });
  }
  for (const { id, ...data } of rows.documents) {
    if (id) await tx.productDocument.update({ where: { id }, data });
    else await tx.productDocument.create({ data: { ...data, productId } });
  }
}
