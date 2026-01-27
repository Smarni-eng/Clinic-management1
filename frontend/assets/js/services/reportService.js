// frontend/assets/js/services/reportService.js

const API_URL = window.ENV.API_BASE_URL; 
// example: /api (base URL)

const REPORT_URL = "/reports/clinic-visits"; 
// JOIN report endpoint for clinic management

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// Fetch JOIN report (appointments + patient + doctor + billing)
export async function apiGetClinicVisitReport() {
  const res = await fetch(REPORT_URL);
  if (!res.ok) return [];
  return safeJson(res);
}
