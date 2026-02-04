from database.connection import get_connection
from core.responses import send_json

def get_clinic_visit_report(handler):
    conn = get_connection()

    rows = conn.execute("""
        SELECT 
            a.id AS visit_id,
            a.patient_id,                     -- ✅ MUST ADD THIS
            a.doctor_id,

            a.appointment_date AS appointment_date,
            
            a.status AS status,

            p.name AS patient_name,
            d.name AS doctor_name,
            d.specialisation AS speciality,

            COALESCE(b.amount, 0) AS bill_amount,
            COALESCE(b.status, 'Pending') AS payment_status
        FROM appointments a
        LEFT JOIN patients p ON p.id = a.patient_id
        LEFT JOIN doctors d ON d.id = a.doctor_id
        LEFT JOIN billings b ON b.appointment_id = a.id
        ORDER BY a.appointment_date DESC
    """).fetchall()

    conn.close()
    send_json(handler, 200, [dict(row) for row in rows])
