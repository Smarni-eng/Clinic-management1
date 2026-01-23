// ================================
// GENERIC PROFILE EXPORT (CLINIC)
// Works for: Patient, Doctor, Billing
// ================================

function buildProfileHTML(title, entity, entityFields, rows, rowColumns) {
  const metaLine = `Generated on: ${new Date().toLocaleString()}`;

  const entityBlock = `
    <h2>Details</h2>
    <div class="kv">
      ${(entityFields || [])
        .map(
          (f) => `
        <div class="kv-row">
          <div class="k">${escHtml(f.label)}</div>
          <div class="v">${escHtml(entity?.[f.key])}</div>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  const tableBlock = `
    <h2>Records</h2>
    ${
      rows?.length
        ? `
      <table>
        <thead>
          <tr>
            ${(rowColumns || []).map((c) => `<th>${escHtml(c.label)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${(rows || [])
            .map(
              (r) => `
            <tr>
              ${(rowColumns || [])
                .map((c) => `<td>${escHtml(r?.[c.key])}</td>`)
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `
        : `<div class="muted">No records found.</div>`
    }
  `;

  return `
    <h1>${escHtml(title)}</h1>
    <div class="meta">${escHtml(metaLine)}</div>
    ${entityBlock}
    ${tableBlock}
  `;
}

function buildProfileCSV(entity, entityFields, rows, rowColumns) {
  const entityLines = (entityFields || []).map(
    (f) => `${safeCsv(f.label)},${safeCsv(entity?.[f.key])}`
  );

  const tableHeader = (rowColumns || []).map((c) => safeCsv(c.label)).join(",");
  const tableBody = (rows || [])
    .map((r) => (rowColumns || []).map((c) => safeCsv(r?.[c.key])).join(","))
    .join("\n");

  return [
    "Details",
    "Field,Value",
    ...entityLines,
    "",
    "Records",
    tableHeader,
    tableBody,
  ].join("\n");
}

export function exportProfileToCSV(filename, entity, rows, config) {
  const csv = buildProfileCSV(
    entity,
    config?.entityFields || [],
    rows || [],
    config?.rowColumns || []
  );

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(filename, blob);
}

export function exportProfileToPDF(title, entity, rows, config) {
  const html = buildProfileHTML(
    title,
    entity,
    config?.entityFields || [],
    rows || [],
    config?.rowColumns || []
  );

  exportToPDF(title, html);
}
