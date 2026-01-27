from database.connection import get_connection
from core.responses import send_json

def get_clinic_visit_report(handler):
    conn = get_connection()

    rows = conn.execute("""
        SELECT 
            a.id AS appointment_id,
            p.name AS patient_name,
            d.name AS doctor_name,
            a.appointment_date AS visit_date,
            a.status,
            COALESCE(b.amount, 0) AS bill_amount
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        LEFT JOIN billings b ON b.appointment_id = a.id
        ORDER BY a.appointment_date DESC
    """).fetchall()

    conn.close()
    send_json(handler, 200, [dict(row) for row in rows])