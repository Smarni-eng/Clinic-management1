from .connection import get_connection

def clinic_visit_report():
    """
    Patient + Doctor + Appointment + Billing JOIN
    """
    conn = get_connection()
    rows = conn.execute("""
        SELECT
            a.id AS appointment_id,
            a.appointment_date AS visit_date,
            a.appointment_time,
            a.status AS appointment_status,

            p.id AS patient_id,
            p.name AS patient_name,
            p.phone AS patient_phone,
            p.age AS patient_age,

            d.id AS doctor_id,
            d.name AS doctor_name,
            d.specialization AS doctor_specialization,

            COALESCE(b.id, 0) AS billing_id,
            COALESCE(b.amount, 0) AS bill_amount,
            COALESCE(b.payment_status, 'Pending') AS payment_status,
            COALESCE(b.payment_method, '-') AS payment_method
        FROM appointments a
        LEFT JOIN patients p ON p.id = a.patient_id
        LEFT JOIN doctors d ON d.id = a.doctor_id
        LEFT JOIN billings b ON b.appointment_id = a.id
        ORDER BY a.appointment_date DESC
    """).fetchall()

    conn.close()
    return [dict(r) for r in rows]
