# patient queries
from datetime import datetime
from database.connection import get_connection


# ---------------------------
# GET ALL PATIENTS
# ---------------------------
def db_get_all():
    conn = get_connection()
    rows = conn.execute("""
        SELECT
            patients.*,
            doctors.name AS doctor_name
        FROM patients
        LEFT JOIN doctors ON doctors.id = patients.doctor_id
        ORDER BY patients.id DESC
    """).fetchall()
    conn.close()
    return [dict(r) for r in rows]

# ---------------------------
# GET ONE PATIENT
# ---------------------------
def db_get_one(patient_id):
    conn = get_connection()
    row = conn.execute("""
        SELECT
            patients.*,
            doctors.name AS doctor_name
        FROM patients
        LEFT JOIN doctors ON doctors.id = patients.doctor_id
        WHERE patients.id = ?
    """, (patient_id,)).fetchone()
    conn.close()
    return dict(row) if row else None



# ---------------------------
# CREATE PATIENT
# ---------------------------
def db_create(data):
    conn = get_connection()
    now = datetime.now().isoformat()

    cur = conn.execute("""
        INSERT INTO patients
        (name, age, gender, phone, email, disease, doctor_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["name"],
        data["age"],
        data["gender"],
        data["phone"],
        data["email"],
        data["disease"],
        data.get("doctor_id"),   # ✅ doctor ID
        now
    ))

    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_one(new_id)


# ---------------------------
# UPDATE PATIENT
# ---------------------------
def db_update(patient_id, data):
    conn = get_connection()
    now = datetime.now().isoformat()

    conn.execute("""
        UPDATE patients
        SET
            name = ?,
            age = ?,
            gender = ?,
            phone = ?,
            email = ?,
            disease = ?,
            doctor_id = ?,
            updated_at = ?
        WHERE id = ?
    """, (
        data["name"],
        data["age"],
        data["gender"],
        data["phone"],
        data["email"],
        data["disease"],
        data.get("doctor_id"),   # ✅ doctor ID
        now,
        patient_id
    ))

    conn.commit()
    conn.close()
    return db_get_one(patient_id)


# ---------------------------
# DELETE PATIENT
# ---------------------------
def db_delete(patient_id):
    patient = db_get_one(patient_id)
    if not patient:
        return None

    conn = get_connection()
    conn.execute("DELETE FROM patients WHERE id = ?", (patient_id,))
    conn.commit()
    conn.close()
    return patient
