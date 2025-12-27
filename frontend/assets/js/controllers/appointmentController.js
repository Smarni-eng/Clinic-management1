import { 
    apiGetAll, 
    apiGetOne, 
    apiCreate, 
    apiUpdate, 
    apiDelete 
} from "../services/appointmentService.js";

import { showAlert } from "../components/Alert.js";
import { renderAppointmentTable } from "../components/AppointmentTable.js";
import { resetForm, fillForm } from "../components/AppointmentForm.js";

import { setState, getState } from "../state/store.js";
import { $ } from "../utils/dom.js";

// Setup event listeners and load initial data
export function initAppointmentController() {
  loadAppointments();

  // Handle Form Submissions
  $("appointmentForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      patient_id: $("patient_id").value.trim(), 
      doctor_id: $("doctor_id").value.trim(), 
      appointment_date: $("appointment_date").value.trim(),
      appointment_time: $("appointment_time").value.trim(),    
      status: $("status").value.trim(),    
    };

    const { editingId } = getState();

    editingId
      ? await updateAppointment(editingId, data)
      : await createNewAppointment(data);
  });

  // Handle Cancel Button Click
  $("cancelBtn").addEventListener("click", () => {
    setState({ editingId: null });
    resetForm();
  });
}


// Fetch all appointment data from the API and update the user interface
export async function loadAppointments() {
  const spinner = $("loadingSpinner");
  const table = $("appointmentsTableContainer");

  spinner.style.display = "block";
  table.style.display = "none";

  const appointments = await apiGetAll();

  setState({ appointments });
  renderAppointmentTable(appointments);

  spinner.style.display = "none";
  table.style.display = "block";
}


// Create a new appointment
export async function createNewAppointment(data) {
  const res = await apiCreate(data);
  if (res.ok) {
    showAlert("Appointment added!");
    resetForm();
    loadAppointments();
  } else {
    showAlert("Failed to add appointment!");
  }
}

// Load an appointment into the form for editing
export async function editAppointment(id) {
  const appointment = await apiGetOne(id);
  
  // ✅ Check if appointment exists before proceeding
  if (!appointment) {
    showAlert("Appointment not found!");
    return;
  }

  setState({ editingId: id });
  fillForm(appointment);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Update an existing appointment
export async function updateAppointment(id, data) {
  const res = await apiUpdate(id, data);
  if (res.ok) {
    showAlert("Updated!");
    resetForm();
    setState({ editingId: null });
    loadAppointments();
  } else {
    showAlert("Failed to update appointment!");
  }
}

// Delete an appointment
export async function deleteAppointmentAction(id) {
  if (!confirm("Delete this appointment?")) return;

  const res = await apiDelete(id);
  if (res.ok) {
    showAlert("Deleted!");
    loadAppointments();
  } else {
    showAlert("Failed to delete appointment!");
  }
}