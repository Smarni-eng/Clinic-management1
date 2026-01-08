import { $ } from "../utils/dom.js";
import { editPatient, deletePatientAction } from "../controllers/patientController.js";

// Renders the list of patients into an HTML table
export function renderPatientTable(patients) {
  const body = $("patientsTableBody");
  const noPatients = $("noPatients");

  body.innerHTML = "";

  if (patients.length === 0) {
    noPatients.style.display = "block";
    return;
  }

  noPatients.style.display = "none";

  patients.forEach(patient => {
    const row = document.createElement("tr");
    row.className = "border-b";

    row.innerHTML = `
      <td class="px-3 py-2">${patient.id}</td>
      <td class="px-3 py-2">${patient.name}</td>
      <td class="px-3 py-2">${patient.age}</td>
      <td class="px-3 py-2">${patient.gender}</td>
      <td class="px-3 py-2">${patient.phone}</td>
      <td class="px-3 py-2">${patient.email}</td>
      <td class="px-3 py-2">${patient.disease}</td>

      <!-- ✅ JOIN COLUMN -->
      <td class="px-3 py-2 font-semibold text-indigo-600">
        ${patient.doctor_name ?? "Not Assigned"}
      </td>

      <td class="px-3 py-2 flex space-x-2">
        <button class="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded"
          data-edit="${patient.id}">Edit</button>

        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          data-delete="${patient.id}">Delete</button>
      </td>
    `;

    row.querySelector("[data-edit]").onclick = () => editPatient(patient.id);
    row.querySelector("[data-delete]").onclick = () => deletePatientAction(patient.id);

    body.appendChild(row);
  });
}
