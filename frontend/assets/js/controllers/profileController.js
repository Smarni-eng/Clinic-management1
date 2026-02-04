import { $ } from "../utils/dom.js";
import { exportToCSV, exportToPDF } from "../utils/exportTools.js";

function show(id, yes) {
  const el = $(id);
  if (!el) return;
  el.classList[yes ? "remove" : "add"]("hidden");
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value ?? "";
}

// ✅ safe json parser (prevents crash when HTML returned)
async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Response is not JSON:", text);
    throw new Error("Invalid JSON response");
  }
}

/* Normalize JOIN rows from clinic-visits report */
function normalizeVisits(rows) {
  return (rows || []).map((r) => ({
    visit_id: r.visit_id ?? r.id ?? "-",
    doctor: r.doctor ?? r.doctor_name ?? "-",
    speciality: r.speciality ?? r.speciality ?? "-",
    date: r.date ?? r.appointment_date ?? "-",
    fees: r.fees ?? r.bill_amount ?? 0,
    status: r.status ?? r.payment_status ?? "-",
    patient_id: r.patient_id,
  }));
}


const PROFILE_EXPORT_CONFIG = {
  entityFields: [
    { key: "id", label: "Patient ID" },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "phone", label: "Phone" },
  ],
  rowColumns: [
    { key: "visit_id", label: "Visit ID" },
    { key: "doctor", label: "Doctor" },
    { key: "speciality", label: "Speciality" },
    { key: "date", label: "Date" },
    { key: "fees", label: "Fees" },
    { key: "status", label: "Status" },
  ],
};


export async function initProfileController(patientId) {
  let patient = null;
  let visits = [];

  // Export buttons
  $("exportCsvBtn")?.addEventListener("click", () => {
    if (!patient) return;

    exportToCSV(
      `patient_${patient.id}_profile.csv`,
      patient,
      visits,
      PROFILE_EXPORT_CONFIG
    );
  });

  $("exportPdfBtn")?.addEventListener("click", () => {
    if (!patient) return;

    exportToPDF(
      `Patient ${patient.id} - Visit Profile`,
      patient,
      visits,
      PROFILE_EXPORT_CONFIG
    );
  });

  try {
    show("basicLoading", true);
    show("basicDetails", false);

    show("joinLoading", true);
    show("joinTableContainer", false);
    show("noVisits", false);

    // 1️⃣ Load patient
    const patientRes = await fetch(`/api/patients/${patientId}`);
    if (!patientRes.ok) throw new Error("Patient not found");

    patient = await safeJson(patientRes);

    setText("patientId", patient.id);
    setText("patientName", patient.name);
    setText("patientAge", patient.age);
    setText("patientPhone", patient.phone);

    show("basicLoading", false);
    show("basicDetails", true);

    // 2️⃣ Load clinic visit JOIN report
    // ✅ IMPORTANT FIX: use /api/reports/clinic-visits
    const repRes = await fetch(`/api/reports/clinic-visits`);
    if (!repRes.ok) throw new Error("Visit report failed");

    const all = await safeJson(repRes);

    visits = normalizeVisits(
      (all || []).filter((r) => Number(r.patient_id) === Number(patientId))
    );

    setText("totalVisits", visits.length);

    // 3️⃣ Render table
    const body = $("joinTableBody");
    if (body) body.innerHTML = "";

    if (!visits.length) {
      show("noVisits", true);
    } else {
      visits.forEach((v) => {
        const tr = document.createElement("tr");
        tr.className = "border-b";
        tr.innerHTML = `
  <td class="px-3 py-2">${v.visit_id}</td>
  <td class="px-3 py-2">${v.doctor}</td>
  <td class="px-3 py-2">${v.speciality}</td>
  <td class="px-3 py-2">${v.date}</td>
  <td class="px-3 py-2">₹${v.fees}</td>
  <td class="px-3 py-2">${v.status}</td>
`;

        body.appendChild(tr);
      });
    }

    show("joinLoading", false);
    show("joinTableContainer", true);
  } catch (err) {
    console.error("[profileController] error:", err);
    show("basicLoading", false);
    show("joinLoading", false);
    show("noVisits", true);
    setText("totalVisits", 0);
  }
}

export default { initProfileController };
