import { $ } from "../utils/dom.js";

export function renderClinicVisitReportTable(rows) {
  const body = $("reportTableBody");
  const empty = $("noRows");

  if (!body) return;

  body.innerHTML = "";

  if (!rows || rows.length === 0) {
    empty?.classList.remove("hidden");
    return;
  }

  empty?.classList.add("hidden");

  rows.forEach((r) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="px-3 py-2 border">${r.appointment_id ?? ""}</td>

      <td class="px-3 py-2 border">
        ${r.patient_name ?? ""}
        <span class="text-xs text-gray-500">(ID: ${r.patient_id ?? ""})</span>
      </td>

      <td class="px-3 py-2 border">
        ${r.doctor_name ?? ""}
        <span class="text-xs text-gray-500">(ID: ${r.doctor_id ?? ""})</span>
      </td>

      <td class="px-3 py-2 border">
        ${r.visit_date ?? r.appointment_date ?? ""}
      </td>

      <td class="px-3 py-2 border">
        ₹${r.bill_amount ?? 0}
      </td>

       <td class="px-3 py-2">
        <a href="/profiles/${r.id ?? ""}" data-link
          class="inline-flex items-center justify-center px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">
          View
        </a>
      </td>
    `;

    body.appendChild(tr);
  });
}
