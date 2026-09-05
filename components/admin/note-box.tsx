"use client"

import { useState } from "react"
import { updateRfqNote } from "../../app/admin/actions"
import styles from "./admin.module.css"

// ملاحظات داخلية على الطلب. العميل مايشوفهاش.

export function NoteBox({ id, value }: { id: string; value: string }) {
  const [note, setNote] = useState(value)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    setSaved(false)

    const formData = new FormData()
    formData.set("id", id)
    formData.set("note", note)

    await updateRfqNote(formData)

    setSaving(false)
    setSaved(true)
  }

  return (
    <section className={styles.noteSection}>
      <label className={styles.label} htmlFor="note">
        Internal notes
      </label>

      <textarea
        id="note"
        className={styles.textarea}
        rows={5}
        value={note}
        placeholder="Who is handling this, what was quoted, next follow-up date..."
        onChange={(event) => {
          setNote(event.target.value)
          setSaved(false)
        }}
      />

      <div className={styles.noteFoot}>
        <button type="button" className={styles.primaryButton} onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save notes"}
        </button>

        {saved ? <span className={styles.savedHint}>Saved</span> : null}
      </div>
    </section>
  )
}
