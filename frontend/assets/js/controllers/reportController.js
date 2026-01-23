// frontend/assets/js/controllers/ClinicVisitReportController.js

import { apiGetClinicVisitReport } from "../services/reportService.js";
import { renderClinicVisitReportTable } from "../components/ClinicVisitReportTable.js";
import { $ } from "../utils/dom.js";

export function initClinicVisitReportController() {
  loadClinicVisitReport();
}

async function loadClinicVisitReport() {
  const spinner = $("loadingSpinner");
  const table = $("reportTableContainer");

  spinner.style.display = "block";
  table.style.display = "none";

  const rows = await apiGetClinicVisitReport();
  renderClinicVisitReportTable(rows);

  spinner.style.display = "none";
  table.style.display = "block";
}
