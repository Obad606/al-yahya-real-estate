// /data/partners.ts
export type Partner = {
  name: string;
  logo: string;     // مسار الشعار تحت /public
  url?: string;     // اختياري: رابط الشركة (خارجية)
};

export const partners: Partner[] = [
  { name: "سابك", logo: "/partners/sabic.png" },
  { name: "Carrier", logo: "/partners/carrier.png" },
  { name: "Grohe", logo: "/partners/grohe.png" },
  { name: "تشيد", logo: "/partners/tashyeed.png" },
  { name: "Ammar Architects", logo: "/partners/ammar.png" },
  { name: "الفنار", logo: "/partners/alfanar.png" },
  { name: "Haif Company", logo: "/partners/haif.png" },
  { name: "الصفوة", logo: "/partners/alsafwa.png" },
  { name: "Jotun", logo: "/partners/jotun.png" },
  { name: "Saveto", logo: "/partners/saveto.png" },
];


