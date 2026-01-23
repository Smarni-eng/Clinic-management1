// Main entrypoint for frontend application
import { initPatientController } from "./controllers/patientController.js";
import { initDoctorController } from "./controllers/doctorController.js";
import { initAppointmentController } from "./controllers/appointmentController.js";
import { initBillingController } from "./controllers/billingController.js";
import { initReportController } from "./controllers/reportController.js"; 
import { router } from "./router/viewRouter.js";

window.addEventListener("DOMContentLoaded", () => {
  router();
  initPatientController();
  initAppointmentController();
  initDoctorController();
  initBillingController();
  initReportController(); 
});
