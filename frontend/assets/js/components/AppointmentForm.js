import { $, createElement } from "../utils/dom.js";

// Resets the input form to its default state for creating a new appointment
export function resetForm() {
  // Use the native .reset() method on the HTML form element
  $("appointmentForm").reset();

  // Change the submit button text back to "Add Appointment"
  $("submitBtn").textContent = "Add Appointment";

  // Hide the "Cancel" button, as we are no longer in 'edit' mode
  $("cancelBtn").style.display = "none";
}

// Populates the input form fields with data from a selected doctor object (for editing)
export function fillForm(appointment) {
  // Fill each input field with the corresponding property from the doctor data
  $("patient_id").value = appointment.patient_id;
  $("doctor_id").value = appointment.doctor_id;
  $("appointment_date").value = appointment.appointment_date;
  $("appointment_time").value = appointment.appointment_time;
  $("status").value = appointment.status;

  // Change the submit button text to "Update Doctor"
  $("submitBtn").textContent = "Update Appointment";

  // Show the "Cancel" button, allowing the user to exit 'edit' mode
  $("cancelBtn").style.display = "inline-block";
}