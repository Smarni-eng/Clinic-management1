// Global app state
// frontend/assets/js/state/store.js

// Global app state for Clinic Management
let state = {
  patients: [],
  doctors: [],
  appointments: [],
  billings: [],

  // currently editing records
  editingPatientId: null,
  editingDoctorId: null,
  editingAppointmentId: null,
  editingBillingId: null,
};

// Update part of the state
export function setState(newState) {
  state = { ...state, ...newState };
}

// Read the current state
export function getState() {
  return state;
}
