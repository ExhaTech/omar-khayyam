(function () {
  const catalog = window.OMAR_MENU;
  if (!catalog) return;

  const catsEl = document.getElementById("menu-cats");
  const listEl = document.getElementById("menu-list");
  const searchEl = document.getElementById("menu-search");
  const noteEl = document.getElementById("menu-note");
  const detailEl = document.getElementById("dish-detail");

  let activeCategory = "todo";
  let query = "";

  if (noteEl && catalog.note) {
    noteEl.textContent = catalog.note;
  }

  function formatPrecio(value) {
    const n = Number(value) || 0;
    return `₡${n.toLocaleString("es-CR").replace(/,/g, " ")}`;
  }

  function renderCategories() {
    const cats = ["Todo", ...catalog.categories];
    catsEl.innerHTML = cats
      .map((name) => {
        const id = name === "Todo" ? "todo" : name;
        const active = activeCategory === id ? " is-active" : "";
        return `<button type="button" role="tab" class="menu-page__cat${active}" data-cat="${escapeAttr(
          id
        )}" aria-selected="${activeCategory === id}">${escapeHtml(name)}</button>`;
      })
      .join("");
  }

  function filteredProducts() {
    const text = query.trim().toLowerCase();
    return catalog.products.filter((product) => {
      const byCategory =
        activeCategory === "todo" || product.categoria === activeCategory;
      if (!byCategory) return false;
      if (!text) return true;
      const haystack = [product.nombre, product.descripcion, product.categoria]
        .join(" ")
        .toLowerCase();
      return haystack.includes(text);
    });
  }

  function renderList() {
    const items = filteredProducts();
    if (!items.length) {
      listEl.innerHTML =
        '<p class="menu-page__empty">No hay platos con ese filtro. Pruebe otra búsqueda o categoría.</p>';
      return;
    }

    listEl.innerHTML = items
      .map((product) => {
        const initial = product.nombre.trim().charAt(0).toUpperCase() || "?";
        const desc = product.descripcion
          ? `<p class="dish-card__desc">${escapeHtml(product.descripcion)}</p>`
          : "";
        return `
          <button type="button" class="dish-card" data-id="${escapeAttr(product.id)}">
            <div class="dish-card__media" aria-hidden="true">
              <span class="dish-card__fallback">${escapeHtml(initial)}</span>
            </div>
            <div class="dish-card__body">
              <div class="dish-card__top">
                <h2 class="dish-card__name">${escapeHtml(product.nombre)}</h2>
                <p class="dish-card__price">${formatPrecio(product.precio)}</p>
              </div>
              ${desc}
            </div>
          </button>
        `;
      })
      .join("");
  }

  function openDetail(product) {
    const initial = product.nombre.trim().charAt(0).toUpperCase() || "?";
    const desc = product.descripcion
      ? `<p class="dish-detail__desc">${escapeHtml(product.descripcion)}</p>`
      : "";

    detailEl.hidden = false;
    detailEl.innerHTML = `
      <button type="button" class="dish-detail__backdrop" aria-label="Cerrar detalle" data-close></button>
      <div class="dish-detail__sheet" role="dialog" aria-modal="true" aria-labelledby="dish-detail-title">
        <div class="dish-detail__handle" aria-hidden="true"></div>
        <button type="button" class="dish-detail__close" aria-label="Cerrar" data-close>×</button>
        <div class="dish-detail__media" aria-hidden="true">
          <div class="dish-detail__fallback">${escapeHtml(initial)}</div>
        </div>
        <p class="dish-detail__cats">${escapeHtml(product.categoria)}</p>
        <div class="dish-detail__top">
          <h2 class="dish-detail__name" id="dish-detail-title">${escapeHtml(product.nombre)}</h2>
          <p class="dish-detail__price">${formatPrecio(product.precio)}</p>
        </div>
        ${desc}
      </div>
    `;
    document.body.style.overflow = "hidden";
  }

  function closeDetail() {
    detailEl.hidden = true;
    detailEl.innerHTML = "";
    document.body.style.overflow = "";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, "&#39;");
  }

  catsEl.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cat]");
    if (!button) return;
    activeCategory = button.getAttribute("data-cat") || "todo";
    renderCategories();
    renderList();
    button.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  });

  listEl.addEventListener("click", (event) => {
    const card = event.target.closest("[data-id]");
    if (!card) return;
    const product = catalog.products.find((item) => item.id === card.getAttribute("data-id"));
    if (product) openDetail(product);
  });

  detailEl.addEventListener("click", (event) => {
    if (event.target.closest("[data-close]")) closeDetail();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !detailEl.hidden) closeDetail();
  });

  searchEl.addEventListener("input", () => {
    query = searchEl.value;
    renderList();
  });

  renderCategories();
  renderList();
})();
