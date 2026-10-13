/* Esen Sofrası — Yönetim Paneli */

(() => {
  "use strict";

  const KEY = "esensofrasi-admin-menu";
  const list = document.getElementById("list");
  const addCatBtn = document.getElementById("addCatBtn");
  const tokenBtn = document.getElementById("tokenBtn");
  const publishBtn = document.getElementById("publishBtn");
  const resetBtn = document.getElementById("resetBtn");
  const fileInput = document.getElementById("fileInput");
  const toastEl = document.getElementById("toast");

  let menu = load();

  function load() {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return JSON.parse(JSON.stringify(MENU));
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(menu)); } catch (e) {}
  }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove("show"), 2000);
  }

  function uid(prefix) {
    return (prefix || "x") + "-" + Math.random().toString(36).slice(2, 9);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function iconPreview(cat) {
    const found = (ICONS || []).find((i) => i.id === cat.icon);
    return found ? found.svg : "";
  }

  function iconOptions(cat) {
    return (ICONS || []).map(
      (i) => `<option value="${i.id}" ${cat.icon === i.id ? "selected" : ""}>${esc(i.name)}</option>`
    ).join("");
  }

  function itemRow(ci, ii, item) {
    const img = item.images && item.images[0] ? item.images[0] : "";
    return `
      <div class="item">
        <img class="thumb" src="${esc(img)}" alt="">
        <div class="body">
          <div class="row">
            <input class="nm" data-ci="${ci}" data-ii="${ii}" data-f="name" value="${esc(item.name)}" placeholder="Ürün adı">
            <input class="prc" type="number" data-ci="${ci}" data-ii="${ii}" data-f="price" value="${item.price}" placeholder="Fiyat">
            <label class="switch"><input type="checkbox" data-ci="${ci}" data-ii="${ii}" data-f="available" ${item.available !== false ? "checked" : ""}> Aktif</label>
          </div>
          <textarea rows="2" data-ci="${ci}" data-ii="${ii}" data-f="description" placeholder="Açıklama">${esc(item.description || "")}</textarea>
          <input type="text" data-ci="${ci}" data-ii="${ii}" data-f="tags" value="${esc((item.tags || []).join(", "))}" placeholder="Etiketler (virgülle): Acılı, Izgara">
          <div class="imgs">
            ${(item.images || []).map((src, i3) => `
              <span class="mini">
                <img src="${esc(src)}" alt="">
                <button data-action="delimg" data-ci="${ci}" data-ii="${ii}" data-i3="${i3}">✕</button>
              </span>`).join("")}
            <button class="mini-add" data-action="addimgurl" data-ci="${ci}" data-ii="${ii}" title="Görsel URL ekle">🔗</button>
            <button class="mini-add" data-action="addimgfile" data-ci="${ci}" data-ii="${ii}" title="Dosyadan yükle">📁</button>
          </div>
          <div><button class="del-item" data-action="delitem" data-ci="${ci}" data-ii="${ii}">Ürünü Sil</button></div>
        </div>
      </div>
    `;
  }

  function render() {
    list.innerHTML = "";
    menu.forEach((cat, ci) => {
      const card = document.createElement("div");
      card.className = "cat closed";
      card.style.borderLeftColor = cat.color || "#e66102";
      card.innerHTML = `
        <div class="cat-head">
          <div class="ic-wrap">
            <span class="ic-prev">${iconPreview(cat)}</span>
            <select class="ic-sel" data-ci="${ci}" data-f="icon" title="İkon seç">${iconOptions(cat)}</select>
          </div>
          <div class="grow">
            <input class="nm" data-ci="${ci}" data-f="name" value="${esc(cat.name)}" placeholder="Kategori adı">
            <input class="ds" data-ci="${ci}" data-f="description" value="${esc(cat.description || "")}" placeholder="Açıklama">
          </div>
          <input class="clr" type="color" data-ci="${ci}" data-f="color" value="${cat.color || "#e66102"}">
          <div class="rbtns">
            <button class="tgl" data-action="toggle" data-ci="${ci}" title="Aç / Kapat">▸</button>
            <button class="btn danger" data-action="delcat" data-ci="${ci}" title="Kategoriyi sil">🗑</button>
          </div>
        </div>
        <div class="items">
          ${cat.items.map((item, ii) => itemRow(ci, ii, item)).join("")}
        </div>
        <button class="add-item" data-action="additem" data-ci="${ci}">+ Ürün Ekle</button>
      `;
      list.appendChild(card);
    });
  }

  /* Metin/number/renk girişleri */
  list.addEventListener("input", (e) => {
    const t = e.target;
    const f = t.dataset.f;
    const ci = t.dataset.ci;
    if (f === undefined || ci === undefined) return;
    const ii = t.dataset.ii;

    if (ii === undefined) {
      if (f === "name" || f === "description" || f === "color") menu[ci][f] = t.value;
    } else {
      const item = menu[ci].items[ii];
      if (f === "name" || f === "description") item[f] = t.value;
      else if (f === "price") item.price = parseFloat(t.value) || 0;
      else if (f === "tags") item.tags = t.value.split(",").map((s) => s.trim()).filter(Boolean);
    }
    save();
  });

  /* Checkbox (aktif/pasif) ve ikon seçimi */
  list.addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.f === "available" && t.dataset.ci !== undefined && t.dataset.ii !== undefined) {
      menu[t.dataset.ci].items[t.dataset.ii].available = t.checked;
      save();
    } else if (t.dataset.f === "icon" && t.dataset.ci !== undefined) {
      menu[t.dataset.ci].icon = t.value;
      save();
      render();
    }
  });

  /* Butonlar */
  list.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-action]");
    if (!b) return;
    const action = b.dataset.action;
    const ci = parseInt(b.dataset.ci, 10);
    const ii = parseInt(b.dataset.ii, 10);
    const i3 = parseInt(b.dataset.i3, 10);

    if (action === "delcat") {
      if (!confirm("Kategoriyi ve içindeki tüm ürünleri silmek istiyor musunuz?")) return;
      menu.splice(ci, 1);
      save(); render();
    } else if (action === "toggle") {
      const card = b.closest(".cat");
      if (card) {
        card.classList.toggle("closed");
        const isClosed = card.classList.contains("closed");
        b.textContent = isClosed ? "▸" : "▾";
      }
    } else if (action === "additem") {
      menu[ci].items.push({ id: uid("item"), name: "", price: 0, description: "", tags: [], ingredients: [], images: [], available: true });
      save(); render();
    } else if (action === "delitem") {
      menu[ci].items.splice(ii, 1);
      save(); render();
    } else if (action === "delimg") {
      menu[ci].items[ii].images.splice(i3, 1);
      save(); render();
    } else if (action === "addimgurl") {
      const url = prompt("Görsel URL:");
      if (url && url.trim()) { menu[ci].items[ii].images.push(url.trim()); save(); render(); }
    } else if (action === "addimgfile") {
      pickFiles(ci, ii);
    }
  });

  addCatBtn.addEventListener("click", () => {
    menu.push({ id: uid("cat"), name: "", description: "", icon: "utensils", color: "#e66102", items: [] });
    save(); render();
  });

  let pendingFileTarget = null;
  function pickFiles(ci, ii) {
    pendingFileTarget = { ci, ii };
    fileInput.value = "";
    fileInput.click();
  }
  fileInput.addEventListener("change", () => {
    if (!pendingFileTarget) return;
    const { ci, ii } = pendingFileTarget;
    const files = Array.from(fileInput.files || []);
    pendingFileTarget = null;
    if (!files.length) return;
    let done = 0;
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        menu[ci].items[ii].images.push(reader.result);
        done++;
        if (done === files.length) { save(); render(); }
      };
      reader.readAsDataURL(file);
    });
  });

  /* Dışa aktarma */
  function buildDataJs() {
    return `/* ============================================================
   Esen Sofrası — Menü Verisi (Yönetim panelinden üretildi)
   ============================================================ */

const RESTAURANT = ${JSON.stringify(RESTAURANT, null, 2)};

const CAMPAIGN = ${JSON.stringify(CAMPAIGN, null, 2)};

const PLACEHOLDER = (text, bg = "7a1f1f", fg = "ffffff") =>
  \`https://placehold.co/600x450/\${bg}/\${fg}?text=\${encodeURIComponent(text)}\`;

const ICONS = ${JSON.stringify(ICONS, null, 2)};

const MENU = ${JSON.stringify(menu, null, 2)};

const formatPrice = (price) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);
`;
  }

  /* GitHub ile yayınlama */
  const GH = { owner: "metinilhan1-stack", repo: "esensofrasi", branch: "main" };

  function getToken() { return localStorage.getItem("gh-token") || ""; }

  function askToken() {
    const t = prompt(
      "GitHub Token girin (bir kez yeter):\n\n" +
      "github.com → Settings → Developer settings → Personal access tokens\n" +
      "(Fine-grained: 'Contents: Read and write' izni).\n" +
      "Token yalnızca bu cihazda (localStorage) saklanır."
    );
    if (t && t.trim()) {
      localStorage.setItem("gh-token", t.trim());
      toast("Token kaydedildi ✓");
      return true;
    }
    return false;
  }

  tokenBtn.addEventListener("click", askToken);

  function b64utf8(s) {
    return btoa(unescape(encodeURIComponent(s)));
  }

  async function publish() {
    const token = getToken();
    if (!token) {
      toast("Önce 🔑 Token girin");
      return;
    }
    publishBtn.disabled = true;
    publishBtn.textContent = "Yayınlanıyor...";
    const content = buildDataJs();
    const path = "data.js";
    try {
      const res = await fetch(`https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${path}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
      });
      let sha = null;
      if (res.ok) { const j = await res.json(); sha = j.sha; }
      else if (res.status !== 404) { toast("GitHub okuma hatası: " + res.status); return; }

      const put = await fetch(`https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${path}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Menü güncellendi (admin panel)",
          content: b64utf8(content),
          branch: GH.branch,
          ...(sha ? { sha } : {}),
        }),
      });
      if (put.ok) {
        toast("Yayınlandı ✓ (site ~1 dk içinde güncellenir)");
      } else {
        const j = await put.json().catch(() => ({}));
        toast("Hata: " + (j.message || put.status));
      }
    } catch (e) {
      toast("Hata: " + e.message);
    } finally {
      publishBtn.disabled = false;
      publishBtn.textContent = "🚀 Kaydet & Yayınla";
    }
  }

  publishBtn.addEventListener("click", () => {
    save();
    publish();
  });

  resetBtn.addEventListener("click", () => {
    if (!confirm("Tüm değişiklikleri silip orijinal menüye dönmek istiyor musunuz?")) return;
    localStorage.removeItem(KEY);
    menu = JSON.parse(JSON.stringify(MENU));
    save(); render();
    toast("Sıfırlandı");
  });

  render();

  /* İlk açılışta bir kerelik token iste */
  if (!getToken()) {
    setTimeout(() => {
      if (!askToken()) toast("Token girilmedi — yayınlama çalışmaz (🔑 Token ile sonra girebilirsiniz)");
    }, 500);
  }
})();
