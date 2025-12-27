// Global app state
let state = {
  editingId: null,   // which appointment is being edited
  appointments : []     // list of all appointments
};

// Update part of the state
export function setState(newState) {
  state = { ...state, ...newState };
}

// Read the current state
export function getState() {
  return state;
}