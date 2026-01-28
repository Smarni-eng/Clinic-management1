from database.connection import get_connection
from core.responses import send_json

def get_clinic_visit_report(handler):
    conn = get_connection()

    rows = conn.execute("""
        SELECT 
            a.id AS appointment_id,
            a.appointment_date AS visit_date,
            a.status,

            p.name AS patient_name,
            d.name AS doctor_name,

            COALESCE(b.amount, 0) AS bill_amount
        FROM appointments a
        LEFT JOIN patients p ON p.id = a.patient_id
        LEFT JOIN doctors d ON d.id = a.doctor_id
        LEFT JOIN billings b ON b.appointment_id = a.id
        ORDER BY a.appointment_date DESC
    """).fetchall()

    conn.close()
    send_json(handler, 200, [dict(row) for row in rows])
