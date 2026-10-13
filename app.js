/* ============================================================
   Esen Sofrası — Uygulama Mantığı
   Accordion, modal, sepet, WhatsApp siparişi, i18n, arama/filtre
   ============================================================ */

(() => {
  "use strict";

  const menuEl = document.getElementById("menu");
  const modal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const modalDesc = document.getElementById("modalDesc");
  const modalMeta = document.getElementById("modalMeta");
  const galleryTrack = document.getElementById("galleryTrack");
  const galleryDots = document.getElementById("galleryDots");
  const qtyValue = document.getElementById("qtyValue");
  const qtyMinus = document.getElementById("qtyMinus");
  const qtyPlus = document.getElementById("qtyPlus");
  const addToCartBtn = document.getElementById("addToCart");
  const itemNote = document.getElementById("itemNote");

  const cartBar = document.getElementById("cartBar");
  const cartCount = document.getElementById("cartCount");
  const cartBarTotal = document.getElementById("cartBarTotal");
  const cartPanel = document.getElementById("cartPanel");
  const cartOverlay = document.getElementById("cartOverlay");
  const cartClose = document.getElementById("cartClose");
  const cartItems = document.getElementById("cartItems");
  const cartEmpty = document.getElementById("cartEmpty");
  const cartTotal = document.getElementById("cartTotal");
  const tableNo = document.getElementById("tableNo");
  const customerNote = document.getElementById("customerNote");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const toast = document.getElementById("toast");
  const langToggle = document.getElementById("langToggle");
  const searchInput = document.getElementById("searchInput");
  const installBtn = document.getElementById("installBtn");

  const productById = new Map();
  MENU.forEach((cat) =>
    cat.items.forEach((item) => productById.set(item.id, item))
  );

  let LANG = localStorage.getItem("lang") || "tr";
  let cart = new Map(); // id -> { qty, note }
  let currentProduct = null;
  let currentQty = 1;
  let currentSlide = 0;
  let searchTerm = "";
  let activeFilters = new Set();

  /* ---------- i18n yardımcıları ---------- */
  function t(key) {
    return (UI[LANG] && UI[LANG][key]) || (UI.tr && UI.tr[key]) || key;
  }
  function catName(cat) {
    return LANG === "en" && CATEGORY_EN[cat.id] ? CATEGORY_EN[cat.id].name : cat.name;
  }
  function catDesc(cat) {
    return LANG === "en" && CATEGORY_EN[cat.id] ? CATEGORY_EN[cat.id].description : cat.description;
  }
  function itemName(item) {
    return LANG === "en" && ITEM_EN[item.id] ? ITEM_EN[item.id].name : item.name;
  }
  function itemDesc(item) {
    return LANG === "en" && ITEM_EN[item.id] ? ITEM_EN[item.id].desc : item.description;
  }
  function itemIngredients(item) {
    return LANG === "en" && ITEM_EN[item.id] ? ITEM_EN[item.id].ingredients : item.ingredients;
  }
  function itemTags(item) {
    if (LANG !== "en") return item.tags || [];
    return (item.tags || []).map((tag) => TAG_EN[tag] || tag);
  }

  /* ---------- Yardımcılar ---------- */
  function toastMessage(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function cartTotalPrice() {
    let total = 0;
    cart.forEach((entry, id) => {
      const item = productById.get(id);
      if (item) total += item.price * entry.qty;
    });
    return total;
  }

  function cartCountValue() {
    let count = 0;
    cart.forEach((e) => (count += e.qty));
    return count;
  }

  function matchesFilters(item) {
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      const hay = (itemName(item) + " " + itemDesc(item)).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (activeFilters.size) {
      const trTags = item.tags || [];
      if (!trTags.some((tag) => activeFilters.has(tag))) return false;
    }
    return true;
  }

  /* ---------- Kampanya ---------- */
  function renderCampaign() {
    const el = document.getElementById("campaignBanner");
    if (!el) return;
    if (!CAMPAIGN.active) {
      el.innerHTML = "";
      return;
    }
    const title = LANG === "en" ? CAMPAIGN.title_en : CAMPAIGN.title;
    const sub = LANG === "en" ? CAMPAIGN.subtitle_en : CAMPAIGN.subtitle;
    el.innerHTML = `
      <div class="mx-auto mt-4 max-w-[720px] px-3.5">
        <div class="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-accent to-accent-dark p-4 text-white shadow-[0_6px_18px_rgba(230,97,2,0.35)]">
          <span class="text-2xl" aria-hidden="true">🎉</span>
          <div class="min-w-0 flex-1">
            <p class="text-[11px] font-bold uppercase tracking-widest opacity-80">${t("campaign")}</p>
            <p class="text-[15px] font-bold leading-tight">${title}</p>
            <p class="mt-0.5 text-[12.5px] opacity-90">${sub}</p>
          </div>
        </div>
      </div>
    `;
  }

  /* ---------- Filtre çipleri ---------- */
  const FILTERABLE_TAGS = ["Acılı", "Acısız", "Vejetaryen", "Etli", "Sıcak", "Soğuk", "Fıstıklı", "Taze"];

  function renderFilterChips() {
    const el = document.getElementById("filterChips");
    if (!el) return;
    el.innerHTML = "";

    const allChip = document.createElement("button");
    allChip.className =
      "rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors " +
      (activeFilters.size === 0 ? "bg-accent text-white" : "border border-line bg-white text-muted");
    allChip.textContent = t("all");
    allChip.addEventListener("click", () => {
      activeFilters.clear();
      renderFilterChips();
      renderMenu();
    });
    el.appendChild(allChip);

    const present = new Set();
    MENU.forEach((cat) => cat.items.forEach((item) => (item.tags || []).forEach((tag) => present.add(tag))));

    FILTERABLE_TAGS.filter((tag) => present.has(tag)).forEach((trTag) => {
      const label = LANG === "en" ? TAG_EN[trTag] || trTag : trTag;
      const b = document.createElement("button");
      const active = activeFilters.has(trTag);
      b.className =
        "rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors " +
        (active ? "bg-accent text-white" : "border border-line bg-white text-muted");
      b.textContent = label;
      b.addEventListener("click", () => {
        if (active) activeFilters.delete(trTag);
        else activeFilters.add(trTag);
        renderFilterChips();
        renderMenu();
      });
      el.appendChild(b);
    });
  }

  /* ---------- Menüyü oluştur ---------- */
  const filteringActive = () => searchTerm.trim() !== "" || activeFilters.size > 0;

  function renderMenu() {
    menuEl.innerHTML = "";
    MENU.forEach((cat) => {
      const visibleItems = cat.items.filter(matchesFilters);
      if (visibleItems.length === 0) return;

      const section = document.createElement("section");
      section.className =
        "category relative mb-3 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_2px_8px_rgba(42,33,24,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(42,33,24,0.1)]";
      section.dataset.id = cat.id;
      if (cat.color) section.style.setProperty("--cat-color", cat.color);

      const header = document.createElement("button");
      header.className =
        "category-header flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-4 py-4 text-left text-ink hover:bg-[#fbf6ef]";
      header.setAttribute("aria-expanded", "false");
      header.innerHTML = `
        <span class="category-icon flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[14px] text-[22px] transition-transform duration-300" aria-hidden="true">${cat.icon}</span>
        <span class="category-info min-w-0 flex-1">
          <span class="category-name block font-serif text-[18px] font-bold">${catName(cat)}</span>
          <span class="category-desc mt-0.5 block text-[12.5px] leading-snug text-muted">${catDesc(cat)}</span>
          <span class="category-count mt-1.5 inline-block rounded-full bg-[#f6efe6] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-muted">${cat.items.length} ${t("items")}</span>
        </span>
        <span class="category-chevron shrink-0 transition-transform duration-300" aria-hidden="true"><svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></span>
      `;
      header.addEventListener("click", () => toggleCategory(section));

      const panel = document.createElement("div");
      panel.className = "category-panel";

      visibleItems.forEach((item) => {
        panel.appendChild(renderProductItem(item));
      });

      section.appendChild(header);
      section.appendChild(panel);
      menuEl.appendChild(section);

      if (filteringActive()) {
        section.classList.add("open");
        header.setAttribute("aria-expanded", "true");
      }
    });
  }

  function renderProductItem(item) {
    const el = document.createElement("div");
    el.className =
      "product-item flex cursor-pointer items-center gap-3 border-t border-line px-4 py-2.5 transition-colors hover:bg-[#fbf6ef] active:bg-[#f5ede2]";
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    const tags = itemTags(item)
      .slice(0, 2)
      .map((tag) => `<span class="tag-chip whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-semibold tracking-wide">${tag}</span>`)
      .join("");
    const name = itemName(item);
    el.innerHTML = `
      <span class="relative shrink-0">
        <img class="h-[66px] w-[66px] rounded-[14px] bg-[#eee5da] object-cover shadow-[0_2px_6px_rgba(0,0,0,0.08)]" src="${item.images[0]}" alt="${name}" loading="lazy" />
        ${item.featured ? `<span class="absolute -left-1.5 -top-1.5 z-[2] flex h-[23px] w-[23px] items-center justify-center rounded-full bg-gradient-to-br from-[#ffc36b] to-accent text-[13px] leading-none text-white shadow-[0_2px_6px_rgba(0,0,0,0.3)]" title="${t("chefsChoice")}">★</span>` : ""}
        ${item.images.length > 1 ? `<span class="absolute bottom-1 right-1 rounded-lg bg-black/60 px-1.5 py-px text-[10px] text-white">${item.images.length}</span>` : ""}
      </span>
      <span class="min-w-0 flex-1 overflow-hidden">
        <span class="block overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-semibold tracking-wide">${name}</span>
        ${tags ? `<span class="mt-1 flex flex-nowrap gap-1">${tags}</span>` : ""}
      </span>
      <span class="shrink-0 whitespace-nowrap text-[15px] font-bold text-accent">${formatPrice(item.price)}</span>
      <button class="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-dark text-[20px] leading-none text-white shadow-[0_3px_10px_rgba(230,97,2,0.35)] transition-all hover:-translate-y-px hover:scale-[1.04] hover:shadow-[0_5px_14px_rgba(230,97,2,0.5)] active:scale-[0.88]" aria-label="${name} ${t("addToOrder")}" data-add="${item.id}">+</button>
    `;

    el.addEventListener("click", (e) => {
      if (e.target.closest("[data-add]")) return;
      openProduct(item.id);
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openProduct(item.id);
    });

    const addBtn = el.querySelector("[data-add]");
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      quickAdd(item.id);
    });

    return el;
  }

  function toggleCategory(section) {
    const isOpen = section.classList.contains("open");
    const header = section.querySelector(".category-header");

    menuEl.querySelectorAll(".category.open").forEach((c) => {
      c.classList.remove("open");
      c.querySelector(".category-header").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      section.classList.add("open");
      header.setAttribute("aria-expanded", "true");
    }
  }

  /* ---------- Ürün Modalı ---------- */
  function openProduct(id) {
    const item = productById.get(id);
    if (!item) return;
    currentProduct = item;
    currentQty = 1;
    currentSlide = 0;
    qtyValue.textContent = "1";
    if (itemNote) itemNote.value = "";

    modalTitle.textContent = itemName(item);
    modalPrice.textContent = formatPrice(item.price);
    modalDesc.textContent = itemDesc(item);

    modalMeta.innerHTML = "";
    const chips = [];
    itemTags(item).forEach((tag) => chips.push(tag));
    const ings = itemIngredients(item);
    if (ings && ings.length) chips.push(t("ingredients") + ": " + ings.join(", "));
    chips.forEach((c) => {
      const chip = document.createElement("span");
      chip.className =
        "meta-chip rounded-full border border-[#ffe0c2] bg-[#fff3e8] px-3 py-1.5 text-[12.5px] font-medium text-accent-dark";
      chip.textContent = c;
      modalMeta.appendChild(chip);
    });

    renderGallery(item.images);

    modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function renderGallery(images) {
    galleryTrack.innerHTML = "";
    galleryDots.innerHTML = "";

    images.forEach((src, i) => {
      const slide = document.createElement("div");
      slide.className = "flex h-full w-full shrink-0 items-center justify-center";
      const img = document.createElement("img");
      img.src = src;
      img.alt = `${itemName(currentProduct)} ${i + 1}`;
      img.loading = "lazy";
      img.className = "h-full w-full object-cover";
      slide.appendChild(img);
      galleryTrack.appendChild(slide);

      const dot = document.createElement("button");
      dot.className =
        "gallery-dot h-2 w-2 cursor-pointer rounded-full border-none bg-white/45 p-0" +
        (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", `${t("image")} ${i + 1}`);
      dot.addEventListener("click", () => goToSlide(i));
      galleryDots.appendChild(dot);
    });

    goToSlide(0);
  }

  function goToSlide(i) {
    const total = currentProduct.images.length;
    if (total === 0) return;
    currentSlide = (i + total) % total;
    galleryTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    galleryDots.querySelectorAll(".gallery-dot").forEach((d, idx) => {
      d.classList.toggle("active", idx === currentSlide);
    });
    const gc = document.getElementById("galleryCount");
    if (gc) gc.textContent = `${currentSlide + 1} / ${total}`;
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    currentProduct = null;
  }

  modal.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeModal));
  modal.addEventListener("click", (e) => {
    if (e.target.dataset.close !== undefined) closeModal();
  });
  modal.querySelectorAll("[data-carousel]").forEach((b) =>
    b.addEventListener("click", () => {
      goToSlide(currentSlide + (b.dataset.carousel === "next" ? 1 : -1));
    })
  );
  qtyMinus.addEventListener("click", () => {
    currentQty = Math.max(1, currentQty - 1);
    qtyValue.textContent = currentQty;
  });
  qtyPlus.addEventListener("click", () => {
    currentQty = Math.min(99, currentQty + 1);
    qtyValue.textContent = currentQty;
  });
  addToCartBtn.addEventListener("click", () => {
    if (!currentProduct) return;
    const note = itemNote ? itemNote.value.trim() : "";
    addToCart(currentProduct.id, currentQty, note);
    closeModal();
  });

  /* ---------- Sipariş ---------- */
  function addToCart(id, qty = 1, note = "") {
    const entry = cart.get(id);
    cart.set(id, {
      qty: (entry ? entry.qty : 0) + qty,
      note: note || (entry ? entry.note : ""),
    });
    renderCart();
    toastMessage(t("added"));
  }

  function quickAdd(id) {
    addToCart(id, 1);
  }

  function renderCart() {
    cartItems.innerHTML = "";
    const count = cartCountValue();
    const total = cartTotalPrice();

    cartBar.hidden = count === 0;
    document.body.classList.toggle("has-cart", count > 0);
    cartCount.textContent = count;
    cartBarTotal.textContent = formatPrice(total);
    cartTotal.textContent = formatPrice(total);
    cartEmpty.style.display = count === 0 ? "flex" : "none";

    cart.forEach((entry, id) => {
      const item = productById.get(id);
      if (!item) return;
      const name = itemName(item);
      const row = document.createElement("div");
      row.className = "cart-item flex items-center gap-3 px-5 py-3";
      row.innerHTML = `
        <img class="h-[52px] w-[52px] shrink-0 rounded-[10px] object-cover" src="${item.images[0]}" alt="${name}" />
        <span class="min-w-0 flex-1 overflow-hidden">
          <span class="block overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-semibold">${name}</span>
          ${entry.note ? `<span class="block overflow-hidden text-ellipsis whitespace-nowrap text-[11px] text-muted">${entry.note}</span>` : ""}
          <span class="mt-0.5 block text-[13px] font-semibold text-accent">${formatPrice(item.price)}</span>
        </span>
        <span class="flex items-center gap-1.5">
          <button class="h-7 w-7 rounded-lg border border-line bg-[#f6efe6] text-[16px] text-accent" data-dec="${id}" aria-label="-">−</button>
          <span class="min-w-[22px] text-center text-[14px] font-semibold">${entry.qty}</span>
          <button class="h-7 w-7 rounded-lg border border-line bg-[#f6efe6] text-[16px] text-accent" data-inc="${id}" aria-label="+">+</button>
        </span>
        <button class="text-[18px] text-accent-dark" data-remove="${id}" aria-label="✕">✕</button>
      `;
      cartItems.appendChild(row);
    });

    cartItems.querySelectorAll("[data-inc]").forEach((b) =>
      b.addEventListener("click", () => {
        const e = cart.get(b.dataset.inc);
        cart.set(b.dataset.inc, { qty: e.qty + 1, note: e.note });
        renderCart();
      })
    );
    cartItems.querySelectorAll("[data-dec]").forEach((b) =>
      b.addEventListener("click", () => {
        const id = b.dataset.dec;
        const e = cart.get(id);
        if (e.qty <= 1) cart.delete(id);
        else cart.set(id, { qty: e.qty - 1, note: e.note });
        renderCart();
      })
    );
    cartItems.querySelectorAll("[data-remove]").forEach((b) =>
      b.addEventListener("click", () => {
        cart.delete(b.dataset.remove);
        renderCart();
      })
    );
  }

  function openCart() {
    cartPanel.classList.add("open");
    cartPanel.setAttribute("aria-hidden", "false");
    cartOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeCart() {
    cartPanel.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
    cartOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  cartBar.addEventListener("click", openCart);
  cartClose.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  /* ---------- WhatsApp Siparişi ---------- */
  function buildOrderMessage() {
    const lines = [];
    lines.push(`*${RESTAURANT.name} — ${t("newOrder")}*`);
    lines.push("");
    cart.forEach((entry, id) => {
      const item = productById.get(id);
      const note = entry.note ? ` (${entry.note})` : "";
      lines.push(`• ${entry.qty} x ${itemName(item)}${note} — ${formatPrice(item.price * entry.qty)}`);
    });
    lines.push("");
    lines.push(`*${t("totalShort")}: ${formatPrice(cartTotalPrice())}*`);
    if (tableNo.value.trim()) lines.push(`${t("tableNoShort")}: ${tableNo.value.trim()}`);
    if (customerNote.value.trim()) lines.push(`${t("noteShort")}: ${customerNote.value.trim()}`);
    return lines.join("\n");
  }

  checkoutBtn.addEventListener("click", () => {
    if (cart.size === 0) {
      toastMessage(t("emptyCartToast"));
      return;
    }
    const msg = buildOrderMessage();
    const url = `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  });

  /* ---------- Sosyal / iletişim linkleri ---------- */
  const socialUrls = {
    instagram: RESTAURANT.instagram,
    facebook: RESTAURANT.facebook,
    whatsapp: `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(RESTAURANT.whatsappMessage || "")}`,
  };
  document.querySelectorAll("[data-social]").forEach((a) => {
    const url = socialUrls[a.dataset.social];
    if (url) a.href = url;
  });
  document.querySelectorAll("[data-phone]").forEach((a) => {
    a.href = "tel:" + (RESTAURANT.phone || "");
  });
  document.querySelectorAll("[data-location]").forEach((a) => {
    if (RESTAURANT.location) a.href = RESTAURANT.location;
  });

  /* ---------- Dil ---------- */
  function applyLanguage() {
    document.documentElement.lang = LANG === "en" ? "en" : "tr";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      el.placeholder = t(el.dataset.i18nPh);
    });
    if (langToggle) langToggle.textContent = LANG === "tr" ? "🌐 EN" : "🌐 TR";
    if (installBtn) installBtn.textContent = "📲 " + t("install");
    renderCampaign();
    renderFilterChips();
    renderMenu();
    renderCart();
  }

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      LANG = LANG === "tr" ? "en" : "tr";
      try { localStorage.setItem("lang", LANG); } catch (e) {}
      applyLanguage();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchTerm = searchInput.value;
      renderMenu();
    });
  }

  /* ---------- Başlangıç ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const params = new URLSearchParams(window.location.search);
  const qrMasa = params.get("masa") || params.get("masaNo") || params.get("table") || params.get("t");
  if (qrMasa) tableNo.value = qrMasa;

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  let deferredPrompt = null;
  if (installBtn) {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBtn.style.display = "flex";
      installBtn.textContent = "📲 " + t("install");
    });
    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installBtn.style.display = "none";
    });
    window.addEventListener("appinstalled", () => {
      installBtn.style.display = "none";
      deferredPrompt = null;
    });
  }

  const siteHeader = document.getElementById("siteHeader");
  function onScroll() {
    if (!siteHeader) return;
    const y = window.scrollY;
    if (y > 60 && !siteHeader.classList.contains("is-scrolled")) {
      siteHeader.classList.add("is-scrolled");
    } else if (y < 20 && siteHeader.classList.contains("is-scrolled")) {
      siteHeader.classList.remove("is-scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  applyLanguage();
})();
