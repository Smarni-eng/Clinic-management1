// Global app state
let state = {
  editingId: null,   // which billing is being edited
  billings : []     // list of all billings
};

// Update part of the state
export function setState(newState) {
  state = { ...state, ...newState };
}

// Read the current state
export function getState() {
  return state;
}