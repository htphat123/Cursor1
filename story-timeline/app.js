/* eslint-disable no-undef */
const FALLBACK_DATA = {
  companies: [
    {
      id: "apple",
      name: "Apple Inc.",
      summary: "Từ nhà sản xuất máy tính đến hệ sinh thái thiết bị và dịch vụ trị giá nghìn tỷ đô.",
      events: [
        { date: "2001-10-23", title: "Ra mắt iPod", summary: "Thiết lập nền tảng cho hệ sinh thái.", tags: ["Product", "Strategy"], metrics: { "Đơn vị bán năm đầu": "125K" } },
        { date: "2007-01-09", title: "Giới thiệu iPhone", summary: "Mở ra kỷ nguyên smartphone.", tags: ["Product"] },
        { date: "2008-07-10", title: "Ra mắt App Store", summary: "Tạo nền tảng dịch vụ.", tags: ["Strategy", "Finance"] }
      ]
    },
    {
      id: "vn_example",
      name: "Công ty Ví dụ Việt Nam",
      summary: "Minh họa cách kể chuyện cho một công ty Việt Nam.",
      events: [
        { date: "2016-03-01", title: "Thành lập công ty", summary: "Khởi đầu với SaaS cho SMEs.", tags: ["Strategy"] },
        { date: "2018-10-12", title: "Gọi vốn vòng A", summary: "Mở rộng đội ngũ và thị trường.", tags: ["Finance"], metrics: { "Số tiền": "$5M" } }
      ]
    }
  ]
};
const state = {
  companies: [],
  currentCompanyId: null,
  searchQuery: "",
  collapsedYears: new Set(),
};

const elements = {
  companySelect: document.getElementById("companySelect"),
  searchInput: document.getElementById("searchInput"),
  companySummary: document.getElementById("companySummary"),
  timeline: document.getElementById("timeline"),
  expandAllBtn: document.getElementById("expandAllBtn"),
  collapseAllBtn: document.getElementById("collapseAllBtn"),
};

async function loadData() {
  try {
    const response = await fetch("./data/companies.json");
    if (!response.ok) throw new Error("Không thể tải dữ liệu công ty");
    const data = await response.json();
    state.companies = data.companies || [];
  } catch (error) {
    console.warn("Tải JSON thất bại, dùng dữ liệu dự phòng.", error);
    state.companies = FALLBACK_DATA.companies;
  }
}

function formatDate(isoDateString) {
  const d = new Date(isoDateString);
  if (Number.isNaN(d.getTime())) return isoDateString;
  return d.toLocaleDateString("vi-VN", { year: "numeric", month: "short", day: "2-digit" });
}

function sortByDateAscending(events) {
  return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getYearFromISO(iso) {
  const year = new Date(iso).getFullYear();
  return Number.isNaN(year) ? "Khác" : String(year);
}

function buildCompanySelect() {
  elements.companySelect.innerHTML = "";
  for (const company of state.companies) {
    const option = document.createElement("option");
    option.value = company.id;
    option.textContent = company.name;
    elements.companySelect.appendChild(option);
  }
  if (!state.currentCompanyId && state.companies.length > 0) {
    state.currentCompanyId = state.companies[0].id;
  }
  elements.companySelect.value = state.currentCompanyId || "";
}

function renderCompanySummary(company) {
  elements.companySummary.innerHTML = `
    <h2>${company.name}</h2>
    <p>${company.summary || ""}</p>
  `;
}

function eventMatchesQuery(event, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  const text = [event.title, event.summary, event.details, ...(event.tags || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return text.includes(q);
}

function renderTimeline(company) {
  const events = sortByDateAscending(company.events || []);
  const filteredEvents = events.filter((evt) => eventMatchesQuery(evt, state.searchQuery));

  // Group by year
  const yearToEvents = new Map();
  for (const evt of filteredEvents) {
    const year = getYearFromISO(evt.date);
    if (!yearToEvents.has(year)) yearToEvents.set(year, []);
    yearToEvents.get(year).push(evt);
  }

  // Render
  elements.timeline.innerHTML = "";

  const sortedYears = [...yearToEvents.keys()].sort((a, b) => Number(a) - Number(b));
  for (const year of sortedYears) {
    const group = document.createElement("div");
    group.className = "year-group";

    const header = document.createElement("div");
    header.className = "year-header";

    const toggle = document.createElement("button");
    toggle.className = "year-toggle";
    toggle.textContent = state.collapsedYears.has(year) ? `Mở ${year}` : `Thu gọn ${year}`;
    toggle.addEventListener("click", () => {
      if (state.collapsedYears.has(year)) {
        state.collapsedYears.delete(year);
      } else {
        state.collapsedYears.add(year);
      }
      renderTimeline(company);
    });

    const title = document.createElement("div");
    title.textContent = year;

    header.appendChild(toggle);
    header.appendChild(title);
    group.appendChild(header);

    const list = document.createElement("div");
    if (!state.collapsedYears.has(year)) {
      for (const evt of yearToEvents.get(year)) {
        list.appendChild(renderEvent(evt));
      }
    }

    group.appendChild(list);
    elements.timeline.appendChild(group);
  }
}

function renderEvent(evt) {
  const wrapper = document.createElement("article");
  wrapper.className = "event";

  const card = document.createElement("div");
  card.className = "event-card";

  const header = document.createElement("div");
  header.className = "event-header";
  header.setAttribute("role", "button");
  header.setAttribute("tabindex", "0");

  const date = document.createElement("div");
  date.className = "event-date";
  date.textContent = formatDate(evt.date);

  const title = document.createElement("div");
  title.className = "event-title";
  title.textContent = evt.title;

  const caret = document.createElement("div");
  caret.className = "caret";
  caret.setAttribute("data-expanded", "false");
  caret.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5L16 12L8 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  header.appendChild(date);
  header.appendChild(title);
  header.appendChild(caret);

  const meta = document.createElement("div");
  meta.className = "event-meta";

  const tagsContainer = document.createElement("div");
  tagsContainer.className = "tags";
  for (const tag of evt.tags || []) {
    const t = document.createElement("span");
    const tagClass = String(tag).toLowerCase();
    t.className = `tag ${tagClass}`;
    t.textContent = tag;
    tagsContainer.appendChild(t);
  }
  meta.appendChild(tagsContainer);

  const details = document.createElement("div");
  details.className = "event-details";
  details.setAttribute("aria-hidden", "true");
  details.innerHTML = `
    <div class="summary">${evt.summary || ""}</div>
    ${evt.details ? `<div class="detail" style="margin-top: 8px; color: #cdd6e2;">${evt.details}</div>` : ""}
    ${renderMetrics(evt.metrics)}
    ${renderLinks(evt.links)}
  `;

  function toggleDetails() {
    const expanded = details.hasAttribute("open");
    if (expanded) {
      details.removeAttribute("open");
      details.setAttribute("aria-hidden", "true");
      caret.setAttribute("data-expanded", "false");
    } else {
      details.setAttribute("open", "");
      details.setAttribute("aria-hidden", "false");
      caret.setAttribute("data-expanded", "true");
    }
  }
  header.addEventListener("click", toggleDetails);
  header.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleDetails();
    }
  });

  card.appendChild(header);
  card.appendChild(meta);
  card.appendChild(details);
  wrapper.appendChild(card);
  return wrapper;
}

function renderMetrics(metrics) {
  if (!metrics) return "";
  const entries = Object.entries(metrics);
  if (entries.length === 0) return "";
  const chips = entries.map(([k, v]) => `<span class="tag finance">${k}: ${v}</span>`).join(" ");
  return `<div class="tags" style="margin-top:8px;">${chips}</div>`;
}

function renderLinks(links) {
  if (!links || links.length === 0) return "";
  const list = links.map((l) => `<a href="${l.url}" target="_blank" rel="noopener noreferrer">${l.label || "Link"}</a>`).join("");
  return `<div class="link-list">${list}</div>`;
}

function onCompanyChanged() {
  state.currentCompanyId = elements.companySelect.value;
  const company = state.companies.find((c) => c.id === state.currentCompanyId);
  state.collapsedYears.clear();
  renderCompanySummary(company);
  renderTimeline(company);
}

function onSearchChanged() {
  state.searchQuery = elements.searchInput.value.trim();
  const company = state.companies.find((c) => c.id === state.currentCompanyId);
  renderTimeline(company);
}

function expandOrCollapseAll(shouldExpand) {
  const detailsNodes = document.querySelectorAll(".event-details");
  detailsNodes.forEach((node) => {
    const caret = node.parentElement.querySelector(".caret");
    if (shouldExpand) {
      node.setAttribute("open", "");
      node.setAttribute("aria-hidden", "false");
      if (caret) caret.setAttribute("data-expanded", "true");
    } else {
      node.removeAttribute("open");
      node.setAttribute("aria-hidden", "true");
      if (caret) caret.setAttribute("data-expanded", "false");
    }
  });
}

async function init() {
  await loadData();
  buildCompanySelect();
  elements.companySelect.addEventListener("change", onCompanyChanged);
  elements.searchInput.addEventListener("input", onSearchChanged);
  elements.expandAllBtn.addEventListener("click", () => expandOrCollapseAll(true));
  elements.collapseAllBtn.addEventListener("click", () => expandOrCollapseAll(false));

  onCompanyChanged();
}

init().catch((err) => {
  console.error(err);
  alert("Có lỗi khi khởi tạo ứng dụng: " + err.message);
});