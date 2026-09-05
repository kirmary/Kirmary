// layout فاضي بيلغي حماية layout الأب.
// من غير الملف ده صفحة الدخول هتحاول تحمي نفسها وتعمل حلقة لا نهائية.

export const metadata = { title: "Sign in | KIRMARY" }

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
