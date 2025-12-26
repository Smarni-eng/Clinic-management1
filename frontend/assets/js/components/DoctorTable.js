import { $ } from "../utils/dom.js";
import { editDoctor, deleteDoctorAction } from "../controllers/doctorController.js";

// Renders the list of doctord into an HTML table
export function renderDoctorTable(doctors) {
  const body = $("doctorsTableBody");
  const noDoctors = $("noDoctors");

  body.innerHTML = "";

  if (doctors.length === 0) {
    noDoctors.style.display = "block";
    return;
  }

  noDoctors.style.display = "none";

  doctors.forEach(Doctor => {
    const row = document.createElement("tr");
    row.className = "border-b";

    row.innerHTML = `
      <td class="px-3 py-2">${doctor.id}</td>
      <td class="px-3 py-2">${doctor.name}</td>
      <td class="px-3 py-2">${doctor.age}</td>
      <td class="px-3 py-2">${doctor.gender}</td>
      <td class="px-3 py-2">${doctor.phone}</td>
      <td class="px-3 py-2">${doctor.email}</td>
      <td class="px-3 py-2">${doctor.specialisation}</td>
      <td class="px-3 py-2">${doctor.experience}</td>
      <td class="px-3 py-2 flex space-x-2">
        <button class="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded"
          data-edit="${doctor.id}">Edit</button>

        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          data-delete="${doctor.id}">Delete</button>
      </td>
    `;

    row.querySelector("[data-edit]").onclick = () => editDoctor(doctor.id);
    row.querySelector("[data-delete]").onclick = () => deleteDoctorAction(doctor.id);

    body.appendChild(row);
  });
}