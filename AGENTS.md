# AGENTS.md

## Proje notları
- Bu bir QR dijital menü (Esen Sofrası) — statik site, Tailwind v4 ile derleniyor.
- Stil değişiklikleri `input.css` / `index.html` / `app.js` üzerinde yapılır; sonra `npm run build` çalıştırılır (derlenmiş `styles.css` elle düzenlenmez).
- `data.js` menü verisi, `lang.js` çeviriler (TR/EN), `sw.js` service worker (önbellek sürümü `esensofrasi-v2`).

## Kurallar
- **Her düzeltmeden (fix) sonra `git add -A && git commit && git push origin main` yap.**
- Yeni Tailwind sınıfı ekledikten sonra `npm run build` ile `styles.css`'i güncelle.
