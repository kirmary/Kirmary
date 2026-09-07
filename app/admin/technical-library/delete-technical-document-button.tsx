"use client"

import { deleteTechnicalDocument } from "../actions"

export default function DeleteTechnicalDocumentButton({
  id,
  title,
}: {
  id: string
  title: string
}) {
  return (
    <form
      action={deleteTechnicalDocument}
      onSubmit={(event) => {
        const confirmed =
          window.confirm(
            `Delete "${title}" from the Technical Library?\n\nThe database record will be deleted. The physical PDF file will not be removed from storage.`
          )

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
          padding: "10px 16px",
          borderRadius: "8px",
          border: "1px solid #c62828",
          background: "#fff",
          color: "#c62828",
          cursor: "pointer",
        }}
      >
        Delete Document
      </button>
    </form>
  )
}
