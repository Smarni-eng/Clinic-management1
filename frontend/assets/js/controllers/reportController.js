// frontend/assets/js/controllers/ClinicVisitReportController.js

import { apiGetClinicVisitReport } from "../services/reportService.js";
import { renderClinicVisitReportTable } from "../components/ClinicVisitReportTable.js";
import { $ } from "../utils/dom.js";

// Store data locally for searching and exporting
let allRows = []; 

export async function initClinicVisitReportController() {
    // 1. Initial Load
    await loadClinicVisitReport();

    // 2. Setup Search Listener
    $("reportSearchInput")?.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allRows.filter(row => 
            row.patient_name.toLowerCase().includes(query) || 
            row.doctor_name.toLowerCase().includes(query) ||
            row.appointment_id.toString().includes(query)
        );
        renderClinicVisitReportTable(filtered);
    });

    // 3. Setup Export Listeners
    $("exportCsvBtn")?.addEventListener("click", () => exportToCSV(allRows));
    $("exportPdfBtn")?.addEventListener("click", () => exportToPDF(allRows));
}

async function loadClinicVisitReport() {
    const spinner = $("loadingSpinner");
    const container = $("reportTableContainer");

    spinner.style.display = "block";
    container.classList.add("hidden");

    allRows = await apiGetClinicVisitReport(); // Save to local state
    renderClinicVisitReportTable(allRows);

    spinner.style.display = "none";
    container.classList.remove("hidden");
}

// --- Export Functions ---

function exportToCSV(data) {
    const headers = ["ID,Patient,Doctor,Date,Amount"];
    const rows = data.map(r => `${r.appointment_id},${r.patient_name},${r.doctor_name},${r.visit_date},${r.bill_amount}`);
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Clinic_Report.csv");
    document.body.appendChild(link);
    link.click();
}

function exportToPDF(data) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Clinic Visit Report", 14, 15);
    
    // Using the autoTable plugin
    doc.autoTable({
        head: [['ID', 'Patient', 'Doctor', 'Date', 'Amount']],
        body: data.map(r => [r.appointment_id, r.patient_name, r.doctor_name, r.visit_date, r.bill_amount]),
        startY: 20
    });
    
    doc.save("Clinic_Report.pdf");
}