import { $ } from "../utils/dom.js";

export function renderClinicVisitReportTable(rows) {
  const body = $("reportTableBody");
  const empty = $("noRows");

  body.innerHTML = "";

  if (!rows || rows.length === 0) {
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");

  rows.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-3 py-2 border">
        ${r.patient_name ?? ""}
        <span class="text-xs text-gray-500">(ID: ${r.patient_id ?? ""})</span>
      </td>

      <td class="px-3 py-2 border">
        ${r.doctor_name ?? ""}
        <span class="text-xs text-gray-500">(ID: ${r.doctor_id ?? ""})</span>
      </td>

      <td class="px-3 py-2 border">
        ${r.appointment_date ?? ""}
        <div class="text-xs text-gray-500">
          ${r.appointment_time ?? ""}
        </div>
      </td>

      <td class="px-3 py-2 border">
        ₹${r.amount ?? ""}
        <div class="text-xs ${
          r.payment_status === "Paid" ? "text-green-600" : "text-red-600"
        }">
          ${r.payment_status ?? ""}
        </div>
      </td>
    `;
    body.appendChild(tr);
  });
}
