import { $, createElement } from "../utils/dom.js";

// Resets the input form to its default state for creating a new billing
export function resetForm() {
  // Use the native .reset() method on the HTML form element
  $("billingForm").reset();

  // Change the submit button text back to "Add Billing"
  $("submitBtn").textContent = "Add Billing";

  // Hide the "Cancel" button, as we are no longer in 'edit' mode
  $("cancelBtn").style.display = "none";
}

// Populates the input form fields with data from a selected doctor object (for editing)
export function fillForm(billing) {
  // Fill each input field with the corresponding property from the doctor data
  $("appointment_id").value = billing.appointment_id; 
  $("patient_id").value = billing.patient_id;
  $("doctor_id").value = billing.doctor_id;
  $("amount").value = billing.amount;
  $("payment_status").value = billing.payment_status;
  $("payment_method").value = billing.payment_method;
  $("status").value = billing.status;

  // Change the submit button text to "Update Billing"
  $("submitBtn").textContent = "Update Billing";
  // Show the "Cancel" button, allowing the user to exit 'edit' mode
  $("cancelBtn").style.display = "inline-block";
}