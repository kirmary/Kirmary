"use client"

import { deleteGallerySection } from "../actions"

type DeleteSectionButtonProps = {
  id: string
  name: string
  imageCount: number
}

export default function DeleteSectionButton({
  id,
  name,
  imageCount,
}: DeleteSectionButtonProps) {
  return (
    <form
      action={deleteGallerySection}
      onSubmit={(event) => {
        const message =
          imageCount > 0
            ? `Delete "${name}"?\n\nThis will also delete ${imageCount} gallery ${
                imageCount === 1 ? "image" : "images"
              } from the database.`
            : `Delete "${name}"?`

        const confirmed = window.confirm(message)

        if (!confirmed) {
          event.preventDefault()
        }
      }}
    >
      <input
        type="hidden"
        name="id"
        value={id}
      />

      <input
        type="hidden"
        name="confirmation"
        value="DELETE"
      />

      <button
        type="submit"
        style={{
          padding: "8px 14px",
          borderRadius: "8px",
          border: "1px solid #dc2626",
          background: "#fff",
          color: "#dc2626",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Delete Section
      </button>
    </form>
  )
}