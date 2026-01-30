import {
  apiGetAll,
  apiGetOne,
  apiCreate,
  apiUpdate,
  apiDelete
} from "../services/billingService.js";

import { showAlert } from "../components/Alert.js";
import { renderBillingTable } from "../components/BillingTable.js";
import { resetForm, fillForm } from "../components/BillingForm.js";

import { setState, getState } from "../state/store.js";
import { $ } from "../utils/dom.js";

/* ✅ NEW: load appointments */
async function loadAppointments() {
  try {
    const res = await fetch("/api/appointments");
    const appointments = await res.json();

    const select = $("appointment_id");
    select.innerHTML = `<option value="">Select Appointment</option>`;

    appointments.forEach((appt) => {
      const option = document.createElement("option");
      option.value = appt.id;

      // show meaningful text in dropdown
      option.textContent = `#${appt.id} | Patient ${appt.patient_id} | Doctor ${appt.doctor_id} | ${appt.appointment_date}`;
      option.dataset.patientId = appt.patient_id;
      option.dataset.doctorId = appt.doctor_id;

      select.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load appointments", err);
    showAlert("Failed to load appointments!");
  }
}

/* ✅ NEW: when appointment changes auto-fill fields */
function setupAppointmentListener() {
  $("appointment_id").addEventListener("change", () => {
    const selectedOption = $("appointment_id").selectedOptions[0];

    if (!selectedOption || !selectedOption.value) {
      $("patient_id").value = "";
      $("doctor_id").value = "";
      return;
    }

    $("patient_id").value = selectedOption.dataset.patientId || "";
    $("doctor_id").value = selectedOption.dataset.doctorId || "";

    // If you want amount auto-fill, you can set default amount here
    // Example:
    // $("amount").value = "500";
  });
}

// Setup event listeners and load initial data
export function initBillingController() {
  loadBillings();

  // ✅ load appointments dropdown
  loadAppointments();
  setupAppointmentListener();

  // Handle Form Submissions
  $("billingForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      appointment_id: $("appointment_id").value.trim(),
      patient_id: $("patient_id").value.trim(),
      doctor_id: $("doctor_id").value.trim(),

      // ✅ convert amount properly to number
      amount: Number($("amount").value),

      payment_status: $("payment_status").value.trim(),
      payment_method: $("payment_method").value.trim(),
    };

    // ✅ prevent empty amount
    if (!data.amount || data.amount <= 0) {
      showAlert("Amount must be greater than 0!");
      return;
    }

    const { editingId } = getState();

    editingId
      ? await updateBilling(editingId, data)
      : await createNewBilling(data);
  });

  // Handle Cancel Button Click
  $("cancelBtn").addEventListener("click", () => {
    setState({ editingId: null });
    resetForm();
  });
}

// Fetch all billing data from the API and update the user interface
export async function loadBillings() {
  const spinner = $("loadingSpinner");
  const table = $("billingsTableContainer");

  spinner.style.display = "block";
  table.style.display = "none";

  const billingRecords = await apiGetAll();

  setState({ billingRecords });
  renderBillingTable(billingRecords);

  spinner.style.display = "none";
  table.style.display = "block";
}

// Create a new billing
export async function createNewBilling(data) {
  const res = await apiCreate(data);
  if (res.ok) {
    showAlert("Billing added!");
    resetForm();
    loadBillings();
  } else {
    showAlert("Failed to add billing!");
  }
}

// Load a billing into the form for editing
export async function editBilling(id) {
  const billing = await apiGetOne(id);

  if (!billing) {
    showAlert("Billing not found!");
    return;
  }

  setState({ editingId: id });
  fillForm(billing);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Update an existing billing
export async function updateBilling(id, data) {
  const res = await apiUpdate(id, data);
  if (res.ok) {
    showAlert("Updated!");
    resetForm();
    setState({ editingId: null });
    loadBillings();
  } else {
    showAlert("Failed to update billing!");
  }
}

// Delete a billing
export async function deleteBillingAction(id) {
  if (!confirm("Delete this billing?")) return;

  const res = await apiDelete(id);
  if (res.ok) {
    showAlert("Deleted!");
    loadBillings();
  } else {
    showAlert("Failed to delete billing!");
  }
}
