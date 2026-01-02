import { $ } from "../utils/dom.js";
import { editBilling, deleteBillingAction } from "../controllers/billingController.js";

// Renders the list of billing records into an HTML table
export function renderBillingTable(billingRecords) {
  const body = $("billingRecordsTableBody");
  const noBillingRecords = $("noBilling");

  body.innerHTML = "";

  if (billingRecords.length === 0) {
    noBillingRecords.style.display = "block";
    return;
  }

  noBillingRecords.style.display = "none";
  
  billingRecords.forEach(billing => {
    const row = document.createElement("tr");
    row.className = "border-b";

    row.innerHTML = `
      <td class="px-3 py-2">${billing.id}</td>
      <td class="px-3 py-2">${billing.patient_id}</td>
      <td class="px-3 py-2">${billing.doctor_id}</td>
      <td class="px-3 py-2">${billing.amount}</td>
      <td class="px-3 py-2">${billing.payment_status}</td>
      <td class="px-3 py-2">${billing.payment_method}</td>
      <td class="px-3 py-2">${billing.status}</td>
      <td class="px-3 py-2 flex space-x-2">
        <button class="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded"
          data-edit="${billing.id}">Edit</button>

        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          data-delete="${billing.id}">Delete</button>
      </td>
    `;

    row.querySelector("[data-edit]").onclick = () => editBilling(billing.id);
    row.querySelector("[data-delete]").onclick = () => deleteBillingAction(billing.id);

    body.appendChild(row);
  });
}