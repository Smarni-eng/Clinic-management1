import json
from core.responses import send_json, send_404
from core.request import parse_json_body
from services.billing_service import (
    service_get_all
    , service_get_one
    , service_create
    , service_update
    , service_delete   
)

# ---------------------------
# GET all billings
# ---------------------------
def get_all_billings(handler):
    return send_json(handler, 200, service_get_all())


# ---------------------------
# GET one billing
# ---------------------------
def get_billing(handler, billing_id):
    billing = service_get_one(billing_id)
    return send_json(handler, 200, billing) if billing else send_404(handler)

# ---------------------------
# CREATE billing
# ---------------------------
def create_billing(handler):
    data = parse_json_body(handler)
    new_billing = service_create(data)
    return send_json(handler, 201, new_billing)


# ---------------------------
# UPDATE billing
# ---------------------------
def update_billing(handler, billing_id):
    data = parse_json_body(handler)
    updated = service_update(billing_id, data)
    return send_json(handler, 200, updated) if updated else send_404(handler)


# ---------------------------
# DELETE billing
# ---------------------------
def delete_billing(handler, billing_id):
    deleted = service_delete(billing_id)
    return send_json(handler, 200, {"deleted": True}) if deleted else send_404(handler)
