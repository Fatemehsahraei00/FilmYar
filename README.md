# فیلم‌یار (FilmYar)

سایت پیشنهاد فیلم و سریال با داده‌های TMDB — طراحی الهام‌گرفته از نماوا، راست‌به‌چپ و کاملاً فارسی.

## اجرا

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # خروجی نهایی در dist/
```

## تنظیمات

کلید و توکن TMDB در فایل `.env` قرار دارد (Vite آن‌ها را با پیشوند `VITE_` وارد برنامه می‌کند):

```
VITE_TMDB_KEY=...
VITE_TMDB_TOKEN=...
```

> توکن read-access شما فقط برای خواندن داده‌های عمومی TMDB استفاده می‌شود.

## ساختار

| بخش | توضیح |
|---|---|
| `src/components/AsciiTiles.jsx` | انیمیشن کاشی‌های شیشه‌ای ASCII بالای سایت (بازسازی متن‌بازِ کامپوننت ASCII Tiles از React Bits Pro، هماهنگ با پالت بنفش) |
| `src/components/ui/field.jsx` / `input.jsx` | کامپوننت‌های Field / FieldLabel / FieldDescription / Input به سبک shadcn با تم بنفش — برای جست‌وجو |
| `src/components/Hero.jsx` | هیرو با پس‌زمینه ASCII Tiles و اسلایدهای ترند روز |
| `src/components/MediaRow.jsx` | کاروسل افقی به سبک نماوا با دکمه‌های چپ/راست |
| `src/components/DetailModal.jsx` | پنجره جزئیات: پوستر، امتیاز، ژانر، بازیگران، آثار مشابه |
| `src/components/SearchOverlay.jsx` | جست‌وجوی زنده در فیلم/سریال/انیمیشن |
| `src/lib/tmdb.js` | لایه API (fetch با Bearer token، زبان fa-IR) |

## تم

- رنگ‌ها: `#301934` (پس‌زمینه) و `#512888` (رنگ اصلی) + مشتقات روشن‌تر برای هاور و درخشش
- فونت: **B Nazanin** (نصب‌شده روی سیستم) با fallback وب‌فونت **Vazirmatn**
- اعداد فارسی، چیدمان RTL

## نکته درباره React Bits Pro

کامپوننت رسمی ASCII Tiles از رجیستری Pro با
`npx shadcn@latest add @reactbits-starter/ascii-tiles-tw` نصب می‌شود اما به
`REACTBITS_LICENSE_KEY` نیاز دارد که در اختیار من نبود؛ بنابراین معادل کاملی از همان
افکت (کاشی‌های شیشه‌ای از کاراکترهای ASCII درخشان + واکنش به موس) در
`AsciiTiles.jsx` پیاده‌سازی شده است. اگر کلید لایسنس را در `.env` بگذارید می‌توان
نسخه رسمی را جایگزین کرد.

## اعتبار داده‌ها

This product uses the TMDB API but is not endorsed or certified by TMDB.
