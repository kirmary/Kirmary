"use client"

import { useTransition } from "react"
import { updateRfqStatus, updateMessageStatus } from "../../app/admin/actions"
import styles from "./admin.module.css"

const OPTIONS = {
  rfq: ["NEW", "IN_REVIEW", "QUOTED", "WON", "LOST"],
  message: ["NEW", "READ", "REPLIED"],
}

// قائمة الحالة: أول ما تغيّري القيمة بتتحفظ فورًا بدون زرار حفظ.

export function StatusSelect({
  id,
  value,
  kind,
}: {
  id: string
  value: string
  kind: "rfq" | "message"
}) {
  const [pending, startTransition] = useTransition()

  return (
    <select
      className={styles.statusSelect}
      data-status={value}
      defaultValue={value}
      disabled={pending}
      onChange={(event) => {
        const formData = new FormData()
        formData.set("id", id)
        formData.set("status", event.target.value)

        startTransition(async () => {
          if (kind === "rfq") {
            await updateRfqStatus(formData)
          } else {
            await updateMessageStatus(formData)
          }
        })
      }}
    >
      {OPTIONS[kind].map((option) => (
        <option key={option} value={option}>
          {option.replace("_", " ")}
        </option>
      ))}
    </select>
  )
}
