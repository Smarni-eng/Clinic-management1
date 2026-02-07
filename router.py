# router.py

from datetime import datetime
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse

from controllers.reports import get_clinic_visit_report

from controllers.patients import (
    get_all_patients,
    get_patient,
    create_patient,
    update_patient,
    delete_patient,
)

from controllers.doctors import (
    get_all_doctors,
    get_doctor,
    create_doctor,
    update_doctor,
    delete_doctor,
)

from controllers.appointments import (
    get_all_appointments,
    get_appointment,
    create_appointment,
    delete_appointment,
)

from controllers.billings import (
    get_all_billings,
    get_billing,
    create_billing,
    delete_billing,
)

from core.static import serve_static
from core.responses import send_404
from core.middleware import add_cors_headers


# -------------------------------
# UI ROUTER (SPA shell + static)
# -------------------------------

FRONTEND_ROUTES = {
    "/", "/home",
    "/patients", "/doctors", "/appointments", "/billings",
    "/reports/clinic-visits",
    "/profiles",
}


def handle_ui_routes(handler, path):
    if path in FRONTEND_ROUTES:
        serve_static(handler, "frontend/pages/index.html")
        return True

    if path.endswith(".html"):
        stripped = path.replace(".html", "")
        if stripped in FRONTEND_ROUTES:
            serve_static(handler, "frontend/pages/index.html")
            return True

    if path.startswith("/assets/"):
        serve_static(handler, "frontend" + path)
        return True

    if path.startswith("/frontend/"):
        serve_static(handler, path.lstrip("/"))
        return True

    if path == "/openapi.yaml":
        serve_static(handler, "openapi.yaml")
        return True

    if path.startswith("/profiles/"):
        serve_static(handler, "frontend/pages/index.html")
        return True

    return False


# -------------------------------
# Helpers
# -------------------------------

def _last_path_id_or_404(handler, path):
    last = path.split("/")[-1]
    if not last.isdigit():
        send_404(handler)
        return None
    return int(last)


# -------------------------------
# MAIN ROUTER CLASS
# -------------------------------

class ClinicRouter(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        add_cors_headers(self)
        self.end_headers()

    # ---------------------------
    # READ (GET)
    # ---------------------------
    def do_GET(self):
        path = urlparse(self.path).path

        if handle_ui_routes(self, path):
            return

        # PATIENTS
        if path == "/api/patients":
            return get_all_patients(self)

        if path.startswith("/api/patients/"):
            patient_id = _last_path_id_or_404(self, path)
            if patient_id is None:
                return
            return get_patient(self, patient_id)

        # DOCTORS
        if path == "/api/doctors":
            return get_all_doctors(self)

        if path.startswith("/api/doctors/"):
            doctor_id = _last_path_id_or_404(self, path)
            if doctor_id is None:
                return
            return get_doctor(self, doctor_id)

        # APPOINTMENTS
        if path == "/api/appointments":
            return get_all_appointments(self)

        if path.startswith("/api/appointments/"):
            appointment_id = _last_path_id_or_404(self, path)
            if appointment_id is None:
                return
            return get_appointment(self, appointment_id)

        # BILLINGS
        if path == "/api/billings":
            return get_all_billings(self)

        if path.startswith("/api/billings/"):
            billing_id = _last_path_id_or_404(self, path)
            if billing_id is None:
                return
            return get_billing(self, billing_id)

        # REPORTS (JOIN)
        if path == "/api/reports/clinic-visits":
            return get_clinic_visit_report(self)

        return send_404(self)

    # ---------------------------
    # CREATE (POST)
    # ---------------------------
    def do_POST(self):
        path = urlparse(self.path).path

        if path == "/api/patients":
            return create_patient(self)

        if path == "/api/doctors":
            return create_doctor(self)

        if path == "/api/appointments":
            return create_appointment(self)

        if path == "/api/billings":
            return create_billing(self)

        return send_404(self)

    # ---------------------------
    # UPDATE (PUT)
    # ---------------------------
    def do_PUT(self):
        path = urlparse(self.path).path

        if path.startswith("/api/patients/"):
            patient_id = _last_path_id_or_404(self, path)
            if patient_id is None:
                return
            return update_patient(self, patient_id)

        if path.startswith("/api/doctors/"):
            doctor_id = _last_path_id_or_404(self, path)
            if doctor_id is None:
                return
            return update_doctor(self, doctor_id)

        return send_404(self)

    # ---------------------------
    # DELETE (DELETE)
    # ---------------------------
    def do_DELETE(self):
        path = urlparse(self.path).path

        if path.startswith("/api/patients/"):
            patient_id = _last_path_id_or_404(self, path)
            if patient_id is None:
                return
            return delete_patient(self, patient_id)

        if path.startswith("/api/doctors/"):
            doctor_id = _last_path_id_or_404(self, path)
            if doctor_id is None:
                return
            return delete_doctor(self, doctor_id)

        if path.startswith("/api/appointments/"):
            appointment_id = _last_path_id_or_404(self, path)
            if appointment_id is None:
                return
            return delete_appointment(self, appointment_id)

        if path.startswith("/api/billings/"):
            billing_id = _last_path_id_or_404(self, path)
            if billing_id is None:
                return
            return delete_billing(self, billing_id)

        return send_404(self)

    def log_message(self, format, *args):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [Clinic Server] {format % args}")
