import { redirect } from 'next/navigation';

export default function RootPage() {
  // سيتم تحويل الزائر تلقائياً إلى النسخة الإنجليزية، ويمكنك تغييرها إلى '/ar' للنسخة العربية
  redirect('/en'); 
}