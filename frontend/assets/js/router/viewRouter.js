// frontend/assets/js/router/viewRouter.js

async function loadView(path) {
  const res = await fetch(path);

  if (!res.ok) {
    const fallback = await fetch("/frontend/pages/404.html").then(r => r.text());
    document.querySelector("#app").innerHTML = fallback;
    return;
  }

  const html = await res.text();
  document.querySelector("#app").innerHTML = html;
}

export async function router() {
  let path = window.location.pathname;
  if (path.length > 1) path = path.replace(/\/$/, "");

  // --------------------
  // HOME
  // --------------------
  if (path === "/" || path === "/home") {
    await loadView("/frontend/pages/home.html");
    return;
  }

  // --------------------
  // PATIENTS
  // --------------------
  if (path === "/patients") {
    await loadView("/frontend/pages/patients.html");
    const mod = await import("../controllers/patientController.js");
    mod.initPatientController();
    return;
  }

  // --------------------
  // DOCTORS
  // --------------------
  if (path === "/doctors") {
    await loadView("/frontend/pages/doctors.html");
    const mod = await import("../controllers/doctorController.js");
    mod.initDoctorController();
    return;
  }

  // --------------------
  // APPOINTMENTS
  // --------------------
  if (path === "/appointments") {
    await loadView("/frontend/pages/appointments.html");
    const mod = await import("../controllers/appointmentController.js");
    mod.initAppointmentController();
    return;
  }

  // --------------------
  // BILLINGS
  // --------------------
  if (path === "/billings") {
    await loadView("/frontend/pages/billings.html");
    const mod = await import("../controllers/billingController.js");
    mod.initBillingController();
    return;
  }

  // --------------------
  // REPORTS (JOIN VIEW)
  // --------------------
  if (path === "/reports/clinic-visits") {
    await loadView("/frontend/pages/report_visits.html");
    const mod = await import("../controllers/reportController.js");
    mod.initClinicVisitReportController(); // you can rename later
    return;
  }

  // --------------------
  // PROFILES (LIST)
  // --------------------
  if (path === "/profiles") {
    await loadView("/frontend/pages/profiles.html");
    const mod = await import("../controllers/profilesController.js");
    mod.initProfilesController();
    return;
  }

  // --------------------
  // PROFILE (DYNAMIC)
  // --------------------
  if (path.startsWith("/profiles/")) {
    const idStr = path.split("/")[2];
    const id = Number(idStr);

    if (!Number.isInteger(id)) {
      await loadView("/frontend/pages/404.html");
      return;
    }

    await loadView("/frontend/pages/profile.html");
    const mod = await import("../controllers/profileController.js");
    mod.initProfileController(id);
    return;
  }

  // --------------------
  // DEFAULT
  // --------------------
  await loadView("/frontend/pages/404.html");
}

export function initRouterEvents() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-link]");
    if (!link) return;

    e.preventDefault();
    history.pushState(null, "", link.getAttribute("href"));
    router();
  });

  window.addEventListener("popstate", router);
}
