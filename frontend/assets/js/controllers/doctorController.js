import { 
    apiGetAll, 
    apiGetOne, 
    apiCreate, 
    apiUpdate, 
    apiDelete 
} from "../services/doctorService.js";

import { showAlert } from "../components/Alert.js";
import { renderDoctorTable } from "../components/DoctorTable.js";
import { resetForm, fillForm } from "../components/DoctorForm.js";

import { setState, getState } from "../state/store.js";
import { $ } from "../utils/dom.js";

// Setup event listeners and load initial data
export function initDoctorController() {
  loadDoctors();

  // Handle Form Submissions
  $("doctorForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: $("name").value.trim(), 
      age: $("age").value.trim(), 
      gender: $("gender").value.trim(),
      phone: $("phone").value.trim(),    
      email: $("email").value.trim(), 
      specialisation: $("specialisation").value.trim(), 
      experience: $("experience").value.trim()    
    };

    const { editingId } = getState();

    editingId
      ? await updateDoctor(editingId, data)
      : await createNewDoctor(data);
  });

  // Handle Cancel Button Click
  $("cancelBtn").addEventListener("click", () => {
    setState({ editingId: null });
    resetForm();
  });
}


// Fetch all doctor data from the API and update the user interface
export async function loadDoctors() {
  const spinner = $("loadingSpinner");
  const table = $("doctorsTableContainer");

  spinner.style.display = "block";
  table.style.display = "none";

  const doctors = await apiGetAll();

  setState({ doctors });
  renderDoctorTable(doctors);

  spinner.style.display = "none";
  table.style.display = "block";
}


// Create a new doctor
export async function createNewDoctor(data) {
  const res = await apiCreate(data);
  if (res.ok) {
    showAlert("Doctor added!");
    resetForm();
    loadDoctors();
  } else {
    showAlert("Failed to add doctor!");
  }
}

// Load a doctor into the form for editing
export async function editDoctor(id) {
  const doctor = await apiGetOne(id);
  
  // ✅ Check if doctort exists before proceeding
  if (!doctor) {
    showAlert("Doctor not found!");
    return;
  }

  setState({ editingId: id });
  fillForm(doctor);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Update an existing doctor
export async function updateDoctor(id, data) {
  const res = await apiUpdate(id, data);
  if (res.ok) {
    showAlert("Updated!");
    resetForm();
    setState({ editingId: null });
    loadDoctors();
  } else {
    showAlert("Failed to update doctor!");
  }
}

// Delete a doctor
export async function deleteDoctorAction(id) {
  if (!confirm("Delete this doctor?")) return;

  const res = await apiDelete(id);
  if (res.ok) {
    showAlert("Deleted!");
    loadDoctors();
  } else {
    showAlert("Failed to delete doctor!");
  }
}