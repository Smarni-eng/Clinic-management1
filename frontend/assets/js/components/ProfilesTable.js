import { $ } from "../utils/dom.js";

export function renderProfilesTable(patients) {
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
