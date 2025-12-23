import json
from core.responses import send_json, send_404
from core.request import parse_json_body
from services.appointment_service import (
    service_get_all
    , service_get_one
    , service_create
    , service_update
    , service_delete   
)

# ---------------------------
# GET all appointments
# ---------------------------
def get_all_appointments(handler):
    return send_json(handler, 200, service_get_all())


# ---------------------------
# GET one appointment
# ---------------------------
def get_appointment(handler, appointment_id):
    appointment = service_get_one(appointment_id)
    return send_json(handler, 200, appointment) if appointment else send_404(handler)


# ---------------------------
# CREATE appointment
# ---------------------------
def create_appointment(handler):
    data = parse_json_body(handler)
    new_appointment = service_create(data)
    return send_json(handler, 201, new_appointment)


# ---------------------------
# UPDATE appointment
# ---------------------------
def update_appointment(handler, appointment_id):
    data = parse_json_body(handler)
    updated = service_update(appointment_id, data)
    return send_json(handler, 200, updated) if updated else send_404(handler)


# ---------------------------
# DELETE doctor
# ---------------------------
def delete_appointment(handler, appointment_id):
    deleted = service_delete(appointment_id)
    return send_json(handler, 200, {"deleted": True}) if deleted else send_404(handler)
