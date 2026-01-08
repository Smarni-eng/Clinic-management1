# Actual SQL queries — Create, Read, Update, Delete (CRUD)

from datetime import datetime
from .connection import get_connection


# ================================
# GET ALL PATIENTS (WITH JOIN)
# ================================
def db_get_all():
    conn = get_connection()
    rows = conn.execute(
        """
        SELECT
            patients.id,
            patients.name,
            patients.age,
            patients.gender,
            patients.phone,
            patients.email,
            patients.disease,
            doctors.name AS doctor_name,
            patients.created_at
        FROM patients
        LEFT JOIN doctors
        ON patients.doctor_id = doctors.id
        ORDER BY patients.id DESC
        """
    ).fetchall()
    conn.close()
    return [dict(row) for row in rows]


# ================================
# GET ONE PATIENT (WITH JOIN)
# ================================
def db_get_one(patient_id):
    conn = get_connection()
    row = conn.execute(
        """
        SELECT
            patients.id,
            patients.name,
            patients.age,
            patients.gender,
            patients.phone,
            patients.email,
            patients.disease,
            doctors.name AS doctor_name,
            patients.created_at,
            patients.updated_at
        FROM patients
        LEFT JOIN doctors
        ON patients.doctor_id = doctors.id
        WHERE patients.id = ?
        """,
        (patient_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


# ================================
# CREATE PATIENT
# ================================
def db_create(data):
    conn = get_connection()
    now = datetime.now().isoformat()

    cur = conn.execute(
        """
        INSERT INTO patients
        (name, age, gender, phone, email, disease, doctor_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            data["name"],
            data["age"],
            data["gender"],
            data["phone"],
            data["email"],
            data["disease"],
            data["doctor_id"],   # 👈 JOIN KEY
            now
        )
    )

    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_one(new_id)


# ================================
# UPDATE PATIENT
# ================================
def db_update(patient_id, data):
    conn = get_connection()
    now = datetime.now().isoformat()

    conn.execute(
        """
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
        """,
        (
            data["name"],
            data["age"],
            data["gender"],
            data["phone"],
            data["email"],
            data["disease"],
            data["doctor_id"],
            now,
            patient_id
        )
    )

    conn.commit()
    conn.close()
    return db_get_one(patient_id)


# ================================
# DELETE PATIENT
# ================================
def db_delete(patient_id):
    patient = db_get_one(patient_id)
    if not patient:
        return None

    conn = get_connection()
    conn.execute(
        "DELETE FROM patients WHERE id = ?",
        (patient_id,)
    )
    conn.commit()
    conn.close()
    return patient
