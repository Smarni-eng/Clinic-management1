import { $ } from "../utils/dom.js";
import { filterList, sortList } from "../utils/listTools.js";
import { exportToCSV, exportToPDF } from "../utils/exportTools.js";

const API_URL = "/api/patients";

/* Table columns */
const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "name", label: "Patient Name" },
  { key: "age", label: "Age" },
  { key: "phone", label: "Phone" },
];

let allPatients = [];

export function initProfilesController() {
  loadProfiles();

  $("searchInput")?.addEventListener("input", refresh);
  $("sortBy")?.addEventListener("change", refresh);
  $("sortDir")?.addEventListener("change", refresh);

  $("exportCsvBtn")?.addEventListener("click", () => {
    exportToCSV("patients.csv", getRows(), COLUMNS);
  });

  $("exportPdfBtn")?.addEventListener("click", () => {
    const rows = getRows();
    const html = buildPrintableTableHTML(
      "Patient Directory",
      rows,
      COLUMNS
    );
    exportToPDF("Patient Directory", html);
  });
}

async function loadProfiles() {
  const spinner = $("loadingSpinner");
  const container = $("profilesTableContainer");

  if (spinner) spinner.style.display = "block";
  if (container) container.style.display = "none";

  const res = await fetch(API_URL);
  allPatients = res.ok ? await res.json() : [];

  refresh();

  if (spinner) spinner.style.display = "none";
  if (container) container.style.display = "block";
}

function getRows() {
  const q = $("searchInput")?.value?.trim() ?? "";
  const sortKey = $("sortBy")?.value ?? "id";
  const sortDir = $("sortDir")?.value ?? "asc";

  const filtered = filterList(
    allPatients,
    q,
    ["id", "name", "age", "phone"]
  );

  return sortList(filtered, sortKey, sortDir);
}

function refresh() {
  renderProfilesTable(getRows());
}

function renderProfilesTable(patients) {
  const body = $("profilesTableBody");
  const noProfiles = $("noProfiles");

  if (!body) return;

  body.innerHTML = "";

  if (!patients || patients.length === 0) {
    if (noProfiles) noProfiles.style.display = "block";
    return;
  }

  if (noProfiles) noProfiles.style.display = "none";

  patients.forEach((p) => {
    const tr = document.createElement("tr");
    tr.className = "border-b";

    tr.innerHTML = `
      <td class="px-3 py-2">${p.id}</td>

      <td class="px-3 py-2">
        <a href="/profiles/${p.id}" data-link
           class="text-blue-600 hover:underline font-medium">
          ${p.name}
        </a>
      </td>

      <td class="px-3 py-2">${p.age}</td>
      <td class="px-3 py-2">${p.phone}</td>

      <td class="px-3 py-2">
        <a href="/profiles/${p.id}" data-link
          class="inline-flex items-center justify-center px-3 py-1 rounded
                 bg-blue-600 text-white hover:bg-blue-700">
          View
        </a>
      </td>
    `;

    body.appendChild(tr);
  });
}

function buildPrintableTableHTML(title, rows, columns) {
  const esc = (v) =>
    String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  return `
    <h1>${esc(title)}</h1>
    <table border="1" cellpadding="6" cellspacing="0">
      <thead>
        <tr>
          ${columns.map((c) => `<th>${esc(c.label)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${(rows || [])
          .map(
            (r) => `
          <tr>
            ${columns
              .map((c) => `<td>${esc(r?.[c.key])}</td>`)
              .join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}
