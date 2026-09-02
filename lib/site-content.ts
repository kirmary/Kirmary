import {featured} from './archive-data';

export const hydrantImage:string|null=null;

export const contacts={
  office:{
    en:'5A Khaled Ibn Al Walid St., Sheraton Residences, QNB Bank Building, 8th Floor, Cairo, Egypt',
    ar:'٥ أ شارع خالد بن الوليد، مساكن شيراتون، عمارة بنك QNB، الدور الثامن، القاهرة، مصر',
    map:'https://maps.app.goo.gl/gMz2YDvTVQUTfK5z8'
  },
  warehouse:{
    en:'17 Teraa Iskandar St., Kafr El Basha, behind Layalety Hall, off Moasaset El Zakah St., Cairo, Egypt',
    ar:'١٧ شارع ترعة إسكندر، كفر الباشا، خلف قاعة ليلتي، من شارع مؤسسة الزكاة، القاهرة، مصر',
    map:'https://maps.app.goo.gl/SUVgpDd149v1ryPR9'
  },
  generalSales:['01281868225','01205923742','01227389528','01208198121','01220446050'],
  pumpSales:['01282315418','01211178250'],
  plumbingHvac:['01282315428'],
  emailSales:'sales@kirmary.com',
  emailInfo:'Info@kirmary.com',
  technicalFiles:'http://qnct.co/kirmary-co-for-engineering-supplies'
} as const;

export const orbitalItems=[
  {
    id:'spp-fire-pumps',
    index:'01',
    eyebrow:'SPP',
    title:'SPP FIRE PUMPS',
    subtitle:'USA ORIGIN · FM & UL CERTIFIED',
    image:'/orbit/spp-fire-pumps.png',
    href:'/products/spp-fire-pumps'
  },
  {
    id:'bristol-fire-pumps',
    index:'02',
    eyebrow:'BRISTOL',
    title:'BRISTOL FIRE PUMPS',
    subtitle:'UAE ORIGIN · FM & UL CERTIFIED',
    image:'/orbit/bristol-fire-pumps.png',
    href:'/products/bristol-fire-pumps'
  },
  {
    id:'kirmary-valves',
    index:'03',
    eyebrow:'KIRMARY',
    title:'KIRMARY VALVES',
    subtitle:'USA ORIGIN · FM & UL CERTIFIED',
    image:'/orbit/kirmary-valves.png',
    href:'/products/fire-valves'
  },
  {
    id:'kirmary-hydrant',
    index:'04',
    eyebrow:'KIRMARY',
    title:'KIRMARY FIRE HYDRANT',
    subtitle:'USA ORIGIN · FM & UL CERTIFIED',
    image:'/orbit/kirmary-hydrant.png',
    href:'/products/fire-hydrant'
  },
  {
    id:'kirmary-cabinets',
    index:'05',
    eyebrow:'KIRMARY',
    title:'KIRMARY FIRE HOSE CABINETS',
    subtitle:'USA ORIGIN · FM & UL CERTIFIED',
    image:'/orbit/kirmary-fire-cabinets.png',
    href:'/products/fire-cabinets'
  },
  {
    id:'tiger-steel-pipes',
    index:'06',
    eyebrow:'TIGER STEEL',
    title:'TIGER STEEL ERW PIPES',
    subtitle:'UAE ORIGIN · FM & UL CERTIFIED',
    image:'/orbit/tiger-steel-pipes.png',
    href:'/products/tiger-steel-pipes'
  },
  {
    id:'viking-sprinklers',
    index:'07',
    eyebrow:'VIKING',
    title:'VIKING SPRINKLERS',
    subtitle:'USA ORIGIN · FM & UL CERTIFIED',
    image:'/orbit/VIKING SPRINKLERS.png',
    href:'/products/viking-sprinklers'
  },
  {
    id:'lede-grooved-fittings',
    index:'08',
    eyebrow:'LEDE',
    title:'LEDE GROOVED FITTINGS',
    subtitle:'FM & UL CERTIFIED',
    image:'/orbit/lede-grooved-fitting.png',
    href:'/products/lede-grooved-fittings'
  },
  {
    id:'lede-valves',
    index:'09',
    eyebrow:'LEDE',
    title:'LEDE VALVES FOR FIREFIGHTING',
    subtitle:'USA ORIGIN · FM & UL CERTIFIED',
    image:'/orbit/LEDE FIRE.png',
    href:'/products/lede-valves'
  },
  {
    id:'lede-plumbing-hvac-valves',
    index:'10',
    eyebrow:'LEDE',
    title:'LEDE VALVES FOR PLUMBING & HVAC',
    subtitle:'WRAS APPROVED',
    image:'/orbit/lede-plumbing.png',
    href:'/products/lede-plumbing-hvac-valves'
  },
  {
    id:'mech-threaded-fittings',
    index:'11',
    eyebrow:'MECH',
    title:'MECH THREADED FITTINGS 300DI',
    subtitle:'FM & UL CERTIFIED',
    image:'/orbit/Threaded Fittings.png',
    href:'/products/mech-threaded-fittings'
  },
  {
    id:'zurn-drains',
    index:'12',
    eyebrow:'ZURN',
    title:'ZURN DRAINS',
    subtitle:'USA ORIGIN',
    image:'/orbit/ZURN.png',
    href:'/products/zurn-drains'
  },
  {
    id:'erico',
    index:'13',
    eyebrow:'ERICO',
    title:'ERICO HANGERS',
    subtitle:'USA ORIGIN · FM & UL CERTIFIED',
    image:'/orbit/ERICO.png',
    href:'/products/erico'
  },
    {
      id:'victaulic-machines',
      index:'14',
      eyebrow:'VICTAULIC TUWEI',
      title:'VICTAULIC TUWEI MACHINES',
      subtitle:'PIPE GROOVING MACHINES',
      image:'/orbit/TUWEI.png',
      href:'/products/victaulic-machines'
    },
  {
    id:'potter',
    index:'15',
    eyebrow:'POTTER',
    title:'POTTER',
    subtitle:'FIRE SPRINKLER MONITORING',
    image:'/orbit/potter.png',
    href:'/products/potter'
  },
  {
    id:'valmatic-air-vent',
    index:'16',
    eyebrow:'VAL-MATIC',
    title:'VAL-MATIC AIR VENT',
    subtitle:'AIR VALVE SOLUTIONS',
    image:'/orbit/valmatic-air-vent.png',
    href:'/products/valmatic-air-vent'
  }
] as const;

/*
 * The Products page already imports `ownedProducts`.
 * It contains the full 16-product portfolio in the requested order.
 */
export const ownedProducts=[
  {
    id:'spp-fire-pumps',
    number:'01',
    name:'SPP Fire Pumps',
    ar:'مضخات حريق SPP',
    description:'SPP fire pump. USA origin and FM & UL certified.',
    descriptionAr:'أنظمة مضخات حريق SPP، منشأ أمريكي ومعتمدة من FM وUL.',
    image:'/orbit/spp-fire-pumps.png',
    tags:['USA Origin','FM Certified','UL Certified']
  },
  {
    id:'bristol-fire-pumps',
    number:'02',
    name:'BRISTOL Fire Pumps',
    ar:'مضخات حريق BRISTOL',
    description:'BRISTOL fire pump. UAE origin and FM & UL certified.',
    descriptionAr:'أنظمة مضخات حريق BRISTOL، منشأ إماراتي ومعتمدة من FM وUL.',
    image:'/orbit/bristol-fire-pumps.png',
    tags:['UAE Origin','FM Certified','UL Certified']
  },
  {
    id:'fire-valves',
    number:'03',
    name:'KIRMARY Valves',
    ar:'محابس KIRMARY',
    description:'KIRMARY fire-protection valves. USA origin and FM & UL certified.',
    descriptionAr:'محابس KIRMARY لأنظمة الحماية من الحريق، منشأ أمريكي ومعتمدة من FM وUL.',
    image:'/orbit/kirmary-valves.png',
    tags:['USA Origin','FM Certified','UL Certified']
  },
  {
    id:'fire-hydrant',
    number:'04',
    name:'KIRMARY Fire Hydrant',
    ar:'هيدرنت حريق KIRMARY',
    description:'KIRMARY fire hydrant. USA origin and FM & UL certified.',
    descriptionAr:'أنظمة هيدرنت الحريق من KIRMARY، منشأ أمريكي ومعتمدة من FM وUL.',
    image:'/orbit/kirmary-hydrant.png',
    tags:['USA Origin','FM Certified','UL Certified']
  },
  {
    id:'fire-cabinets',
    number:'05',
    name:'KIRMARY Fire Hose Cabinets',
    ar:'كباين خراطيم حريق KIRMARY',
    description:'KIRMARY fire hose cabinet. USA origin and FM & UL certified.',
    descriptionAr:'أنظمة كباين خراطيم الحريق من KIRMARY، منشأ أمريكي ومعتمدة من FM وUL.',
    image:'/orbit/kirmary-fire-cabinets.png',
    tags:['USA Origin','FM Certified','UL Certified']
  },
  {
    id:'tiger-steel-pipes',
    number:'06',
    name:'Tiger Steel ERW Pipes',
    ar:'مواسير Tiger Steel ERW',
    description:'Tiger Steel ERW pipe. UAE origin and FM & UL certified.',
    descriptionAr:'أنظمة مواسير Tiger Steel ERW، منشأ إماراتي ومعتمدة من FM وUL.',
    image:'/orbit/tiger-steel-pipes.png',
    tags:['UAE Origin','FM Certified','UL Certified']
  },
  {
    id:'viking-sprinklers',
    number:'07',
    name:'Viking Sprinklers',
    ar:'رشاشات Viking',
    description:'Viking sprinklers. USA origin and FM & UL certified.',
    descriptionAr:'أنظمة رشاشات Viking، منشأ أمريكي ومعتمدة من FM وUL.',
    image:'/orbit/VIKING SPRINKLERS.png',
    tags:['USA Origin','FM Certified','UL Certified']
  },
  {
    id:'lede-grooved-fittings',
    number:'08',
    name:'LEDE Grooved Fittings',
    ar:'وصلات LEDE المحززة',
    description:'LEDE grooved fittings. FM & UL certified.',
    descriptionAr:'وصلات LEDE المحززة،معتمدة من FM وUL.',
    image:'/orbit/lede-grooved-fitting.png',
    tags:['FM Certified','UL Certified']
  },
  {
    id:'lede-valves',
    number:'09',
    name:'LEDE Valves for Firefighting',
    ar:'محابس LEDE لمكافحة الحريق',
    description:'LEDE valves for firefighting. USA origin and FM & UL certified.',
    descriptionAr:'محابس LEDE لأنظمة مكافحة الحريق، منشأ أمريكي ومعتمدة من FM وUL.',
    image:'/orbit/LEDE FIRE.png',
    tags:['USA Origin','FM Certified','UL Certified']
  },
  {
    id:'lede-plumbing-hvac-valves',
    number:'10',
    name:'LEDE Valves for Plumbing & HVAC',
    ar:'محابس LEDE للسباكة والتكييف',
    description:'LEDE valves for plumbing and HVAC. WRAS approved.',
    descriptionAr:'محابس LEDE لأنظمة السباكة والتكييف، معتمدة من WRAS.',
    image:'/orbit/lede-plumbing.png',
    tags:['WRAS Approved']
  },
  {
    id:'mech-threaded-fittings',
    number:'11',
    name:'MECH Threaded Fittings 300DI',
    ar:'وصلات MECH الملولبة 300DI',
    description:'MECH Threaded Fittings 300DI. FM & UL certified.',
    descriptionAr:'وصلات MECH الملولبة 300DI، معتمدة من FM وUL.',
    image:'/orbit/Threaded Fittings.png',
    tags:['300DI','FM Certified','UL Certified']
  },
  {
    id:'zurn-drains',
    number:'12',
    name:'Zurn Drains',
    ar:'مصارف Zurn',
    description:'Zurn drainage. USA origin.',
    descriptionAr:'أنظمة الصرف من Zurn، منشأ أمريكي.',
    image:'/orbit/ZURN.png',
    tags:['USA Origin']
  },
  {
    id:'erico',
    number:'13',
    name:'ERICO Hangers',
    ar:'حوامل ERICO',
    description:'ERICO pipe hangers. USA origin and FM & UL certified.',
    descriptionAr:'حوامل وأنظمة دعم المواسير من ERICO، منشأ أمريكي ومعتمدة من FM وUL.',
    image:'/orbit/ERICO.png',
    tags:['USA Origin','FM Certified','UL Certified']
  },
  {
    id:'victaulic-machines',
    number:'14',
    name:'Victaulic TUWEI Machines',
    ar:'ماكينات Victaulic TUWEI',
    description:'Victaulic TUWEI pipe  machines.',
    descriptionAr:'ماكينات Victaulic TUWEI لتخديد وتجهيز المواسير.',
    image:'/orbit/TUWEI.png',
    tags:['Grooving machines','Pipe preparation']
  },
  {
    id:'potter',
    number:'15',
    name:'POTTER',
    ar:'POTTER',
    description:'Tamper Switch & Flow Switch & Pressure Switch.',
    descriptionAr:'منتجات POTTER لمراقبة أنظمة رشاشات الحريق وتدفق المياه والضغط ووضع المحابس.',
    image:'/orbit/potter.png',
    tags:['Fire Sprinkler Monitoring','Flow Switches','Supervisory Switches','Pressure Switches']
  },
  {
    id:'valmatic-air-vent',
    number:'16',
    name:'VAL-MATIC Air Vent',
    ar:'VAL-MATIC Air Vent',
    description:'Automatic Air vent.',
    descriptionAr:'حلول VAL-MATIC لصمامات الهواء لطرد الهواء المحبوس وإدخال الهواء وحماية شبكات المواسير.',
    image:'/orbit/valmatic-air-vent.png',
    tags:['Air Valves','Air Release','Air/Vacuum','Combination Air Valve']
  }
] as const;

/*
 * Kept for compatibility with any existing imports.
 * The Brands navigation item has been removed.
 */
export const brands=[
  {name:'SPP Fire Pumps',type:'Fire pump ',document:'SPP FIRE PUMPS SUBMITTAL 2019'},
  {name:'BRISTOL',type:'Fire pump solutions',document:'KIRMARY sole-agent campaign content'},
  {name:'Viking',type:'Hydrants and sprinklers',document:'Hydrant and sprinkler submittals'},
  {name:'LEDE',type:'Grooved fittings and valves',document:'Catalogues, submittals and certificates'},
  {name:'ZYFIRE',type:'Fire hose',document:'Catalogue and certificate archive'},
] as const;

export const projects=[
  {name:'Ras El Hekma',ar:'رأس الحكمة',image:'/projects/ras-el-hekma.png'},
  {name:'Electric High Express Train',ar:'القطار الكهربائي السريع — Electric High Express Train',image:'/projects/مونوريل.png'},
  {name:'Cairo Metro — Line 4',ar:'مترو الأنفاق الخط الرابع',image:'/projects/الخط الرابع.png'},
  {name:'The Iconic Tower ',ar:'البرج الأيقوني',subtitle:'New Administrative Capital',image:'/projects/البرج الايقوني.png'},
  {name:'Central Business District Towers',ar:' حي المال و الاعمال',subtitle:'New Administrative Capital',image:'/projects/الابراج الصينيه.png'},
  {name:'Government Ministries District',ar:'حي الوزارات',subtitle:'New Administrative Capital',image:'/projects/حي الوزارات.png'},
  {name:'The Council Of Ministers',ar:'مجلس الوزراء',subtitle:'New Administrative Capital',image:'/projects/مجلس الوزراء.png'},
  {name:'Egyptian Parliament',ar:'البرلمان',subtitle:'New Administrative Capital',image:'/projects/البرلمان.png'},
  {name:'3 Mega Projects — Power Plants',ar:'3 Mega Projects «محطات كهرباء»',image:'/projects/محطات الكهرباء.png'},
  {name:'Alamein Towers',ar:'ابراج العلمين',image:'/projects/ابراج العلمين.png'},
  {name:'Al-Fattah Al-Aleem Mosque',ar:'مسجد الفتاح العليم',subtitle:'New Administrative Capital',image:'/projects/مسجد الفتاح العليم.png'},
  {name:'Cathedral of the Nativity of Christ',ar:'كاتدرائية ميلاد السيد المسيح',subtitle:'New Administrative Capital',image:'/projects/كاتدرائيه ميلاد السيد المسيح.png'},
  {name:'Presidential Palaces',ar:'القصور الرئاسية',subtitle:'New Administrative Capital',image:'/projects/القصور الرئاسيه.png'},
  {name:'Suez Canal and Port Said Tunnels',ar:'أنفاق قناة السويس وبورسعيد',image:'/projects/أنفاق قناة السويس وبورسعيد.png'},
  {name:'Cairo International Airport',ar:'مطار القاهرة الدولي',image:'/projects/مطار القاهره.png'},
  {name:'Hurghada International Airport',ar:'مطار الغردقةالدولي',image:'/projects/مطار الغردقه.png'},
  {name:'Mohamed Naguib Military Base',ar:'قاعدة محمد نجيب العسكرية',image:'/projects/قاعده محمد نجيب.png'},
  {name:'Alamein University',ar:'جامعة العلمين',image:'/projects/جامعه العلمين.png'},
  {name:' 6 October University',ar:'جامعة 6 اكتوبر',image:'/projects/جامعه 6 اكتوبر.png'},
  {name:'Zewail University',ar:'جامعة زويل',image:'/projects/جامعه زويل.png'},
  {name:'Air Force Hospital',ar:'مستشفى القوات الجوية',image:'/projects/مستشفى القوات الجويه.png'},
  {name:'Saudi German Hospital',ar:'المستشفى السعودي الألماني',image:'/projects/السعودي الالماني.png'},
  {name:'Shifa Al Orman Hospital',ar:'مستشفى شفاء الأورمان',image:'/projects/مستشفى شفاء الاورمان.png'},
  {name:'Magdi Yacoub Heart Centre',ar:'مركز مجدي يعقوب للقلب',image:'/projects/مركز مجدي يعقوب القلب.png'},
] as const;

export const navigation=[
  {id:'home',en:'Home',ar:'الرئيسية',href:'#home'},
  {id:'about',en:'About',ar:'من نحن',href:'#about'},
  {id:'products',en:'Products',ar:'المنتجات',href:'#owned-products'},
  {id:'projects',en:'Projects',ar:'المشروعات',href:'#projects'},
  {id:'Gallery',en:'Gallery',ar:'معرض الصور',href:'#Gallery'},
  {id:'contact',en:'Contact',ar:'تواصل معنا',href:'#contact'},
] as const;