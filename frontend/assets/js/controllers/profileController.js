import { $ } from "../utils/dom.js";
import { exportProfileToCSV, exportProfileToPDF } from "../utils/exportTools.js";

function show(id, yes) {
  const el = $(id);
  if (!el) return;
  el.classList[yes ? "remove" : "add"]("hidden");
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value ?? "";
}

/* Normalize JOIN rows from clinic-visits report */
function normalizeVisits(rows) {
  return (rows || []).map((r) => ({
    appointment_id: r.appointment_id ?? "-",
    doctor_name: r.doctor_name ?? "-",
    appointment_date: r.appointment_date ?? "-",
    visit_reason: r.reason ?? "-",
    bill_amount: r.bill_amount ?? 0,
    patient_id: r.patient_id,
  }));
}

const PROFILE_EXPORT_CONFIG = {
  patientFields: [
    { key: "id", label: "Patient ID" },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "phone", label: "Phone" },
  ],
  rowColumns: [
    { key: "appointment_id", label: "Appointment ID" },
    { key: "doctor_name", label: "Doctor" },
    { key: "appointment_date", label: "Date" },
    { key: "visit_reason", label: "Reason" },
    { key: "bill_amount", label: "Bill Amount" },
  ],
};

export async function initProfileController(patientId) {
  let patient = null;
  let visits = [];

  // Export buttons
  $("profileExportCsvBtn")?.addEventListener("click", () => {
    if (!patient) return;
    exportProfileToCSV(
      `patient_${patient.id}_profile.csv`,
      patient,
      visits,
      PROFILE_EXPORT_CONFIG
    );
  });

  $("profileExportPdfBtn")?.addEventListener("click", () => {
    if (!patient) return;
    exportProfileToPDF(
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

    /* 1️⃣ Load patient */
    const patientRes = await fetch(`/api/patients/${patientId}`);
    if (!patientRes.ok) throw new Error("Patient not found");
    patient = await patientRes.json();

    setText("patientId", patient.id);
    setText("patientName", patient.name);
    setText("patientAge", patient.age);
    setText("patientPhone", patient.phone);

    show("basicLoading", false);
    show("basicDetails", true);

    /* 2️⃣ Load clinic visit JOIN report */
    const repRes = await fetch(`/reports/clinic-visits`);
    if (!repRes.ok) throw new Error("Visit report failed");
    const all = await repRes.json();

    visits = normalizeVisits(
      (all || []).filter(
        (r) => Number(r.patient_id) === Number(patientId)
      )
    );

    setText("totalVisits", visits.length);

    /* 3️⃣ Render table */
    const body = $("joinTableBody");
    if (body) body.innerHTML = "";

    if (!visits.length) {
      show("noVisits", true);
    } else {
      visits.forEach((v) => {
        const tr = document.createElement("tr");
        tr.className = "border-b";
        tr.innerHTML = `
          <td class="px-3 py-2">${v.appointment_id}</td>
          <td class="px-3 py-2">${v.doctor_name}</td>
          <td class="px-3 py-2">${v.appointment_date}</td>
          <td class="px-3 py-2">${v.visit_reason}</td>
          <td class="px-3 py-2">₹${v.bill_amount}</td>
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
