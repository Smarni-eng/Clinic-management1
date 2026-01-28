// frontend/assets/js/controllers/ClinicVisitReportController.js

import { apiGetClinicVisitReport } from "../services/reportService.js";
import { renderClinicVisitReportTable } from "../components/ClinicVisitReportTable.js";
import { $ } from "../utils/dom.js";

// Store data locally for searching and exporting
let allRows = [];

export async function initClinicVisitReportController() {
  // 1. Initial Load
  await loadClinicVisitReport();

  // 2. Setup Search Listener (SAFE)
  $("reportSearchInput")?.addEventListener("input", (e) => {
    const query = (e.target.value || "").toLowerCase();

    const filtered = allRows.filter((row) => {
      const patient = (row.patient_name || "").toLowerCase();
      const doctor = (row.doctor_name || "").toLowerCase();
      const apptId = String(row.appointment_id ?? row.id ?? "");

      return (
        patient.includes(query) ||
        doctor.includes(query) ||
        apptId.includes(query)
      );
    });

    renderClinicVisitReportTable(filtered);
  });

  // 3. Setup Export Listeners
  $("exportCsvBtn")?.addEventListener("click", () => exportToCSV(allRows));
  $("exportPdfBtn")?.addEventListener("click", () => exportToPDF(allRows));
}

async function loadClinicVisitReport() {
  const spinner = $("loadingSpinner");
  const container = $("reportTableContainer");

  if (spinner) spinner.style.display = "block";
  if (container) container.classList.add("hidden");

  try {
    allRows = await apiGetClinicVisitReport();

    // Debug: check keys returned from backend
    console.log("JOIN REPORT rows:", allRows);
    console.log("Sample row:", allRows?.[0]);

    // Ensure always an array
    if (!Array.isArray(allRows)) allRows = [];

    renderClinicVisitReportTable(allRows);
  } catch (err) {
    console.error("Error loading clinic visit report:", err);
    allRows = [];
    renderClinicVisitReportTable([]);
  } finally {
    if (spinner) spinner.style.display = "none";
    if (container) container.classList.remove("hidden");
  }
}

// --- Export Functions ---

function exportToCSV(data) {
  if (!Array.isArray(data) || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  const headers = ["ID,Patient,Doctor,Date,Amount"];

  const rows = data.map((r) => {
    const id = r.appointment_id ?? r.id ?? "";
    const patient = r.patient_name ?? "";
    const doctor = r.doctor_name ?? "";
    const date = r.appointment_date ?? "";   // ✅ correct key
    const amount = r.bill_amount ?? "";

    return `${id},${patient},${doctor},${date},${amount}`;
  });

  const csvContent =
    "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "Clinic_Report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportToPDF(data) {
  if (!Array.isArray(data) || data.length === 0) {
    alert("No data available to export.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Clinic Visit Report", 14, 15);

  doc.autoTable({
    head: [["ID", "Patient", "Doctor", "Date", "Amount"]],
    body: data.map((r) => [
      r.appointment_id ?? r.id ?? "",
      r.patient_name ?? "",
      r.doctor_name ?? "",
      r.appointment_date ?? "",   // ✅ correct key
      r.bill_amount ?? "",
    ]),
    startY: 20,
  });

  doc.save("Clinic_Report.pdf");
}
