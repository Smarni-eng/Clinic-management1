// frontend/assets/js/utils/profileExport.js
// Only export helpers for the PATIENT profile page (no DOM events)

function esc(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/*
  CSV columns for PATIENT VISIT REPORT
  (JOIN: patients + appointments + doctors + billings)
*/
export const PROFILE_CSV_COLUMNS = [
  { key: "appointment_id", label: "Appointment ID" },
  { key: "doctor_name", label: "Doctor Name" },
  { key: "specialization", label: "Specialization" },
  { key: "appointment_date", label: "Appointment Date" },
  { key: "fees", label: "Fees" },
  { key: "payment_status", label: "Payment Status" },
];

/*
  Normalize JOIN result rows
  (safe even if backend column names vary)
*/
export function normalizeProfileRows(rows) {
  return (rows || []).map((r) => ({
    appointment_id: r.appointment_id ?? r.id ?? "",
    doctor_name: r.doctor_name ?? "",
    specialization: r.specialization ?? "",
    appointment_date: r.appointment_date ?? "",
    fees: r.fees ?? "",
    payment_status: r.payment_status ?? "",
  }));
}

/*
  Build printable HTML for Patient Profile PDF
*/
export function buildProfilePDFHtml(patient, rows) {
  const safePatient = patient || {};
  const safeRows = normalizeProfileRows(rows);

  return `
    <h1>Patient Profile</h1>

    <h2>Basic Details</h2>
    <table>
      <tbody>
        <tr><th>Patient ID</th><td>${esc(safePatient.id)}</td></tr>
        <tr><th>Name</th><td>${esc(safePatient.name)}</td></tr>
        <tr><th>Age</th><td>${esc(safePatient.age)}</td></tr>
        <tr><th>Gender</th><td>${esc(safePatient.gender)}</td></tr>
        <tr><th>Phone</th><td>${esc(safePatient.phone)}</td></tr>
        <tr><th>Total Appointments</th><td>${esc(safeRows.length)}</td></tr>
      </tbody>
    </table>

    <h2>Appointment History</h2>
    <table>
      <thead>
        <tr>
          <th>Appointment ID</th>
          <th>Doctor</th>
          <th>Specialization</th>
          <th>Appointment Date</th>
          <th>Fees</th>
          <th>Payment Status</th>
        </tr>
      </thead>
      <tbody>
        ${
          safeRows.length
            ? safeRows
                .map(
                  (r) => `
          <tr>
            <td>${esc(r.appointment_id)}</td>
            <td>${esc(r.doctor_name)}</td>
            <td>${esc(r.specialization)}</td>
            <td>${esc(r.appointment_date)}</td>
            <td>${esc(r.fees)}</td>
            <td>${esc(r.payment_status)}</td>
          </tr>
        `
                )
                .join("")
            : `<tr><td colspan="6">No appointments found.</td></tr>`
        }
      </tbody>
    </table>
  `;
}
