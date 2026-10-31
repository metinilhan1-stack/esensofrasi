/* ============================================================
   Esen Sofrası — Uygulama Mantığı
   Accordion, modal, i18n, arama/filtre
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
  const langToggle = document.getElementById("langToggle");
  const searchInput = document.getElementById("searchInput");
  const installBtn = document.getElementById("installBtn");

  const productById = new Map();
  const byOrder = (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0);
  const sortedMenu = [...MENU].sort(byOrder);
  MENU.forEach((cat) =>
    cat.items.forEach((item) => productById.set(item.id, item))
  );

  let LANG = localStorage.getItem("lang") || "tr";
  let currentProduct = null;
  let currentSlide = 0;
  let searchTerm = "";
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
  function catIcon(cat) {
    const found = (typeof ICONS !== "undefined" ? ICONS : []).find((i) => i.id === cat.icon);
    return found ? found.svg : cat.icon;
  }

  /* ---------- Yardımcılar ---------- */
  function matchesFilters(item) {
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      const hay = (itemName(item) + " " + itemDesc(item)).toLowerCase();
      if (!hay.includes(q)) return false;
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

  /* ---------- Menüyü oluştur ---------- */
  const filteringActive = () => searchTerm.trim() !== "";

  function renderMenu() {
    menuEl.innerHTML = "";
    sortedMenu.forEach((cat) => {
      const availableItems = cat.items.filter((i) => i.available !== false);
      const visibleItems = availableItems.filter(matchesFilters);
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
        <span class="category-icon flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[14px] text-[22px] transition-transform duration-300" aria-hidden="true">${catIcon(cat)}</span>
        <span class="category-info min-w-0 flex-1">
          <span class="category-name block font-serif text-[18px] font-bold">${catName(cat)}</span>
          <span class="category-desc mt-0.5 block text-[12.5px] leading-snug text-muted">${catDesc(cat)}</span>
          <span class="category-count mt-1.5 inline-block rounded-full bg-[#f6efe6] px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-muted">${availableItems.length} ${t("items")}</span>
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
    const desc = itemDesc(item);
    el.innerHTML = `
      <span class="relative shrink-0">
        <img class="h-[66px] w-[66px] rounded-[14px] bg-[#eee5da] object-cover shadow-[0_2px_6px_rgba(0,0,0,0.08)]" src="${item.images[0]}" alt="${name}" loading="lazy" decoding="async" />
      </span>
      <span class="min-w-0 flex-1 overflow-hidden">
        <span class="flex items-center gap-1.5">
          ${item.featured ? `<span class="shrink-0 text-[14px] leading-none text-accent" title="${t("chefsChoice")}">★</span>` : ""}
          <span class="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-semibold tracking-wide">${name}</span>
        </span>
        ${desc ? `<span class="mt-0.5 line-clamp-2 text-[12px] leading-snug text-muted">${desc}</span>` : ""}
        ${tags ? `<span class="mt-1 flex flex-nowrap gap-1">${tags}</span>` : ""}
      </span>
      ${item.price > 0 ? `<span class="shrink-0 whitespace-nowrap text-[15px] font-bold text-accent">${formatPrice(item.price)}</span>` : ""}
    `;

    el.addEventListener("click", () => openProduct(item.id));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") openProduct(item.id);
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
    currentSlide = 0;

    modalTitle.textContent = itemName(item);
    modalPrice.textContent = formatPrice(item.price);
    modalPrice.style.display = item.price > 0 ? "" : "none";
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
    const multiple = images.length > 1;
    modal.querySelectorAll("[data-carousel]").forEach((a) => (a.style.display = multiple ? "" : "none"));
    const gc = document.getElementById("galleryCount");
    if (gc) gc.style.display = multiple ? "" : "none";
    galleryDots.style.display = multiple ? "" : "none";

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
    if (langToggle) langToggle.textContent = LANG === "tr" ? "EN" : "TR";
    if (installBtn) installBtn.textContent = "📲 " + t("install");
    renderCampaign();
    renderMenu();
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
