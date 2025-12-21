import json
from core.responses import send_json, send_404
from core.request import parse_json_body
from services.doctor_service import (
    service_get_all
    , service_get_one
    , service_create
    , service_update
    , service_delete   
)

# ---------------------------
# GET all doctors
# ---------------------------
def get_all_doctorts(handler):
    return send_json(handler, 200, service_get_all())


# ---------------------------
# GET one doctor
# ---------------------------
def get_doctor(handler, patient_id):
    patient = service_get_one(patient_id)
    return send_json(handler, 200, patient) if patient else send_404(handler)


# ---------------------------
# CREATE patient
# ---------------------------
def create_patient(handler):
    data = parse_json_body(handler)
    new_patient = service_create(data)
    return send_json(handler, 201, new_patient)


# ---------------------------
# UPDATE patient
# ---------------------------
def update_patient(handler, patient_id):
    data = parse_json_body(handler)
    updated = service_update(patient_id, data)
    return send_json(handler, 200, updated) if updated else send_404(handler)


# ---------------------------
# DELETE patient
# ---------------------------
def delete_patient(handler, patient_id):
    deleted = service_delete(patient_id)
    return send_json(handler, 200, {"deleted": True}) if deleted else send_404(handler)
