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
  $("sortOrder")?.addEventListener("change", refresh);

  // ✅ CSV Export (fixed)
  $("exportCsvBtn")?.addEventListener("click", () => {
    const rows = getRows();

    exportToCSV(
      "patients.csv",
      { total: rows.length }, // entity summary
      rows,
      {
        entityFields: [{ key: "total", label: "Total Patients" }],
        rowColumns: COLUMNS,
      }
    );
  });

  // ✅ PDF Export (fixed)
  $("exportPdfBtn")?.addEventListener("click", () => {
    const rows = getRows();

    exportToPDF(
      "Patient Directory",
      { total: rows.length },
      rows,
      {
        entityFields: [{ key: "total", label: "Total Patients" }],
        rowColumns: COLUMNS,
      }
    );
  });
}

async function loadProfiles() {
  const spinner = $("loadingSpinner");
  const container = $("profilesTableContainer");

  if (spinner) spinner.style.display = "block";
  if (container) container.style.display = "none";

  try {
    const res = await fetch(API_URL);
    allPatients = res.ok ? await res.json() : [];
  } catch (err) {
    console.error("Failed to load patients:", err);
    allPatients = [];
  }

  refresh();

  if (spinner) spinner.style.display = "none";
  if (container) container.style.display = "block";
}

function getRows() {
  const q = $("searchInput")?.value?.trim() ?? "";
  const sortKey = $("sortBy")?.value ?? "id";
  const sortDir = $("sortOrder")?.value ?? "asc";

  const filtered = filterList(allPatients, q, ["id", "name", "age", "phone"]);

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
      <td class="px-3 py-2">${p.id ?? "-"}</td>

      <td class="px-3 py-2">
        <a href="/profiles/${p.id}" data-link
           class="text-blue-600 hover:underline font-medium">
          ${p.name ?? "-"}
        </a>
      </td>

      <td class="px-3 py-2">${p.age ?? "-"}</td>
      <td class="px-3 py-2">${p.gender ?? "-"}</td>
      <td class="px-3 py-2">${p.phone ?? "-"}</td>

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
