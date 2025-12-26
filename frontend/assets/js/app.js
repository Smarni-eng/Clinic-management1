// Main entrypoint for frontend application
import { initPatientController } from "./controllers/patientController.js";
import { initDoctorController } from "./controllers/doctorController.js";
import { router } from "./router/viewRouter.js";

// Initialize app on page load
window.addEventListener("DOMContentLoaded", () => {
  router();
  initPatientController();
  initDoctorController();
});