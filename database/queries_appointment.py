 #appointment
from datetime import datetime
from .connection import get_connection


def db_get_all():
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM appointments ORDER BY id DESC"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def db_get_one(appointment_id):
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM appointments WHERE id = ?",
        (appointment_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


def db_create(data):
    conn = get_connection()
    now = datetime.now().isoformat()

    cur = conn.execute(
        """
        INSERT INTO appointments
        (patient_id, doctor_id, appointment_date, appointment_time, status,  created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (data["patient_id"], data["doctor_id"], data["appointment_date"], data["appointment_time"], data["status"], now))
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_one(new_id)


def db_update(appointment_id, data):
    conn = get_connection()
    now = datetime.now().isoformat()

    conn.execute(
        """
        UPDATE appointments
        SET patient_id=?, doctor_id=?, appointment_date=?, appointment_time=?, status=?, updated_at=?
        WHERE id=?
        """,
        (data["patient_id"], data["doctor_id"], data["appointment_date"], data["appointment_time"],  data["status"], now, appointment_id))
    conn.commit()
    conn.close()
    return db_get_one(appointment_id)


def db_delete(appointment_id):
   appointment = db_get_one(appointment_id)
   if not appointment:
        return None

   conn = get_connection()
   conn.execute("DELETE FROM appointments WHERE id=?", (appointment_id,))     
   conn.commit()
   conn.close()
   return appointment
