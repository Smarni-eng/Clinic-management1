// Global app state
let state = {
  editingId: null,   // which doctor is being edited
  doctors : []     // list of all doctors
};

// Update part of the state
export function setState(newState) {
  state = { ...state, ...newState };
}

// Read the current state
export function getState() {
  return state;
}