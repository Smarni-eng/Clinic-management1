import { $ } from "../utils/dom.js";
import { editAppointment, deleteAppointmentAction } from "../controllers/appointmentController.js";

// Renders the list of appointments into an HTML table
export function renderAppointmentTable(appointments) {
  const body = $("appointmentsTableBody");
  const noAppointments = $("noAppointments");

  body.innerHTML = "";

  if (appointments.length === 0) {
    noAppointments.style.display = "block";
    return;
  }

  noAppointments.style.display = "none";

  appointments.forEach(appointment => {
    const row = document.createElement("tr");
    row.className = "border-b";

    row.innerHTML = `
      <td class="px-3 py-2">${appointment.id}</td>
      <td class="px-3 py-2">${appointment.patient_id}</td>
      <td class="px-3 py-2">${appointment.doctor_id}</td>
      <td class="px-3 py-2">${appointment.appointment_date}</td>
      <td class="px-3 py-2">${appointment.appointment_time}</td>
      <td class="px-3 py-2">${appointment.status}</td>
      <td class="px-3 py-2 flex space-x-2">
        <button class="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded"
          data-edit="${appointment.id}">Edit</button>

        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          data-delete="${appointment.id}">Delete</button>
      </td>
    `;

    row.querySelector("[data-edit]").onclick = () => editAppointment(appointment.id);
    row.querySelector("[data-delete]").onclick = () => deleteAppointmentAction(appointment.id);

    body.appendChild(row);
  });
}