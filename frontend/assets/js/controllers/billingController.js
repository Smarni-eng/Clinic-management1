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

// Setup event listeners and load initial data
export function initBillingController() {
  loadBillings();

  // Handle Form Submissions
  $("billingForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      patient_id: $("patient_id").value.trim(), 
      doctor_id: $("doctor_id").value.trim(), 
      amount: $("amount").value.trim(),
      payment_status: $("payment_status").value.trim(),    
      payment_method: $("payment_method").value.trim(),    
    };

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

  // ✅ Check if billing exists before proceeding
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