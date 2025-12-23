#doctor
from datetime import datetime
from .connection import get_connection


def db_get_all():
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM doctors ORDER BY id DESC"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def db_get_one(doctor_id):
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM doctors WHERE id = ?",
        (doctor_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


def db_create(data):
    conn = get_connection()
    now = datetime.now().isoformat()

    cur = conn.execute(
        """
        INSERT INTO doctors
        (name, age, gender, phone, email, specialisation, experience, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (data["name"], data["age"], data["gender"], data["phone"],  data["email"], data["specialisation"], data["experience"],  now))
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_one(new_id)


def db_update(doctor_id, data):
    conn = get_connection()
    now = datetime.now().isoformat()

    conn.execute(
        """
        UPDATE doctors
        SET name=?, age=?, gender=?, phone=?, email=?, specialisation=?, experience=?, updated_at=?
        WHERE id=?
        """,
        (data["name"], data["age"], data["gender"], data["phone"],  data["email"], data["specialisation"], data["experience"],  now, doctor_id))
    conn.commit()
    conn.close()
    return db_get_one(doctor_id)


def db_delete(doctor_id):
   doctor = db_get_one(doctor_id)
   if not doctor:
        return None

   conn = get_connection()
   conn.execute("DELETE FROM doctors WHERE id=?", (doctor_id,))     
   conn.commit()
   conn.close()
   return doctor