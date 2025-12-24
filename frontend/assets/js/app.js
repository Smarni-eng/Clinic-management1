// Main entrypoint for frontend
import { initPatientController } from "./controllers/patientController.js";
import { router } from "./router/viewRouter.js";

// Initialize app on page load
window.addEventListener("DOMContentLoaded", () => {
  router();
  initPatientController();
});