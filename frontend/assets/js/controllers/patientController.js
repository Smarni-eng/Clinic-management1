import { 
    apiGetAll, 
    apiGetOne, 
    apiCreate, 
    apiUpdate, 
    apiDelete 
} from "../services/patientService.js";

import { showAlert } from "../components/Alert.js";
import { renderPatientTable } from "../components/PatientTable.js";
import { resetForm, fillForm } from "../components/PatientForm.js";

import { setState, getState } from "../state/store.js";
import { $ } from "../utils/dom.js";

// Setup event listeners and load initial data
export function initPatientController() {
  loadPatients();

  // Handle Form Submissions
  $("patientForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: $("name").value.trim(), 
      age: $("age").value.trim(), 
      gender: $("gender").value.trim(),
      phone: $("phone").value.trim(),    
      email: $("email").value.trim(), 
      disease: $("disease").value.trim(), 
      doctor: $("doctor").value.trim()    
    };

    const { editingId } = getState();

    editingId
      ? await updatePatient(editingId, data)
      : await createNewPatient(data);
  });

  // Handle Cancel Button Click
  $("cancelBtn").addEventListener("click", () => {
    setState({ editingId: null });
    resetForm();
  });
}


// Fetch all patient data from the API and update the user interface
export async function loadPatients() {
  const spinner = $("loadingSpinner");
  const table = $("patientsTableContainer");

  spinner.style.display = "block";
  table.style.display = "none";

  const patients = await apiGetAll();

  setState({ patients });
  renderPatientTable(patients);

  spinner.style.display = "none";
  table.style.display = "block";
}


// Create a new patient
export async function createNewPatient(data) {
  const res = await apiCreate(data);
  if (res.ok) {
    showAlert("Patient added!");
    resetForm();
    loadPatients();
  } else {
    showAlert("Failed to add patient!");
  }
}

// Load a patient into the form for editing
export async function editPatient(id) {
  const patient = await apiGetOne(id);
  
  // ✅ Check if patient exists before proceeding
  if (!patient) {
    showAlert("Patient not found!");
    return;
  }

  setState({ editingId: id });
  fillForm(patient);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Update an existing patient
export async function updatePatient(id, data) {
  const res = await apiUpdate(id, data);
  if (res.ok) {
    showAlert("Updated!");
    resetForm();
    setState({ editingId: null });
    loadPatients();
  } else {
    showAlert("Failed to update patient!");
  }
}

// Delete a patient
export async function deletePatientAction(id) {
  if (!confirm("Delete this patient?")) return;

  const res = await apiDelete(id);
  if (res.ok) {
    showAlert("Deleted!");
    loadPatients();
  } else {
    showAlert("Failed to delete patient!");
  }
}