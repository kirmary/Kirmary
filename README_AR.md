# موقع KIRMARY — Orbital Website

تم بناء هذا المشروع كنسخة Next.js كاملة بهوية KIRMARY، وبنفس منطق تجربة **Orbital 3D Carousel**:

- حلقة ثلاثية الأبعاد تحتوي على 10 أقسام.
- السحب بالماوس أو اللمس لتدوير الحلقة.
- Momentum وحركة تلقائية هادئة.
- Mouse parallax وميلان ثلاثي الأبعاد.
- تحكم في Visuals وZoom وSpacing.
- `SplashCursor` من React Bits مدمج بالأحمر الخاص بـKIRMARY.
- عربي وإنجليزي.
- منتجات KIRMARY: Fire Cabinets، KIRMARY Valves، وKIRMARY Fire Hydrant.
- Brands، Projects، Approvals، Visual Archive، Technical Library، Contact وRFQ.

## منع التكرار

تمت مراجعة الأرشيف المرفق وحذف الملفات المتطابقة، ثم تنظيمه داخل:

- `public/archive/images/`
- `public/archive/logos/`
- `public/archive/docs/`
- `public/archive/video/`

الموقع يستخدم نسخة واحدة فقط من كل ملف، والبيانات المولدة موجودة في:

```text
lib/archive-data.ts
```

## تشغيل الموقع

افتحي الفولدر الذي يحتوي مباشرة على `package.json`، ثم شغّلي:

```bash
npm install
npm run dev
```

بعدها افتحي:

```text
http://localhost:3000
```

أو شغّلي الملف:

```text
START_KIRMARY.bat
```

## تغيير صورة KIRMARY Fire Hydrant

الأرشيف المرفق لا يحتوي على صورة المنتج الجديد المعتمدة، لذلك تم وضع رسم Placeholder واضح بدل استخدام صورة Hydrant من براند خارجي.

بعد إضافة الصورة داخل `public/`، افتحي:

```text
lib/site-content.ts
```

وغيّري:

```ts
const hydrantImage: string | null = null;
```

إلى مثال:

```ts
const hydrantImage: string | null = '/kirmary-hydrant.png';
```

## SplashCursor

الكومبوننت الكامل موجود في:

```text
components/SplashCursor.jsx
```

ويتم تشغيله من:

```text
app/[locale]/page.tsx
```

## ملاحظة RFQ

الـRFQ endpoint يعمل للتحقق من البيانات وإرجاع Reference Number، لكن إرسال البريد أو الربط مع CRM يحتاج إضافة بيانات الخدمة التي ستستخدمها الشركة قبل النشر النهائي.
