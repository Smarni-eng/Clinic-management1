# router.py

from datetime import datetime
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse

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
    update_appointment,
    delete_appointment,
)

from controllers.appointments import (
    get_all_appointments,
    get_appointment,
    create_appointment,
    update_appointment,
    delete_appointment,
)

from controllers.billings import (
    get_all_billings,
    get_billing,
    create_billing,
    update_billing,
    delete_billing,
)

from core.static import serve_static
from core.responses import send_404
from core.middleware import add_cors_headers


# -------------------------------
# UI ROUTER (SPA shell + static)
# -------------------------------

FRONTEND_ROUTES = {"/", "/home", "/patients", "/docs"}

def handle_ui_routes(handler, path):
    if path in FRONTEND_ROUTES:
        serve_static(handler, "frontend/pages/index.html")
        return True

    if path.endswith(".html"):
        stripped = path.replace(".html", "")
        if stripped in FRONTEND_ROUTES:
            serve_static(handler, "frontend/pages/index.html")
            return True

    if path.startswith("/frontend/"):
        serve_static(handler, path.lstrip("/"))
        return True

    if path == "/openapi.yaml":
        serve_static(handler, "openapi.yaml")
        return True

    return False


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

        # 1. UI routes first (SPA)
        if handle_ui_routes(self, path):
            return

        # 2. API READ routes
        # patients
        if path == "/api/patients":
            return get_all_patients(self)

        if path.startswith("/api/patients/"):
            try:
                patient_id = int(path.split("/")[-1])
                return get_patient(self, patient_id)
            except ValueError:
                return send_404(self)

        # doctors
        if path == "/api/doctors":
            return get_all_doctors(self)

        if path.startswith("/api/doctors/"):
            try:
                doctor_id = int(path.split("/")[-1])
                return get_doctor(self, doctor_id)
            except ValueError:
                return send_404(self)

        # appointments
        if path == "/api/appointments":
            return get_all_appointments(self)

        if path.startswith("/api/appointments/"):
            try:
                appointment_id = int(path.split("/")[-1])
                return get_appointment(self, appointment_id)
            except ValueError:
                return send_404(self)

         # billings
        if path == "/api/billings":
            return get_all_billings(self)

        if path.startswith("/api/billings/"):
            try:
                billing_id = int(path.split("/")[-1])
                return get_billing(self, billing_id)
            except ValueError:
                return send_404(self)

        return send_404(self)


    # ---------------------------
    # CREATE (POST)
    # ---------------------------
    def do_POST(self):
        # patients
        if self.path == "/api/patients":
            return create_patient(self)

        # doctors
        if self.path == "/api/doctors":
            return create_doctor(self)

        # appointments
        if self.path == "/api/appointments":
            return create_appointment(self)

        # billings
        if self.path == "/api/billings":
            return create_billing(self)

        return send_404(self)


    # ---------------------------
    # UPDATE (PUT)
    # ---------------------------
    def do_PUT(self):
        # patients
        if self.path.startswith("/api/patients/"):
            try:
                patient_id = int(self.path.split("/")[-1])
                return update_patient(self, patient_id)
            except ValueError:
                return send_404(self)
       
        # doctors
        if self.path.startswith("/api/doctors/"):
            try:
                doctor_id = int(self.path.split("/")[-1])
                return update_doctor(self, doctor_id)
            except ValueError:
                return send_404(self)

        # appointments
        if self.path.startswith("/api/appointments/"):
            try:
                appointment_id = int(self.path.split("/")[-1])
                return update_appointment(self, appointment_id)
            except ValueError:
                return send_404(self)

         # billings
        if self.path.startswith("/api/billings/"):
            try:
                billing_id = int(self.path.split("/")[-1])
                return update_billing(self, billing_id)
            except ValueError:
                return send_404(self)
                
        return send_404(self)


    # ---------------------------
    # DELETE (DELETE)
    # ---------------------------
    def do_DELETE(self):
        # patients
        if self.path.startswith("/api/patients/"):
            try:
                patient_id = int(self.path.split("/")[-1])
                return delete_patient(self, patient_id)
            except ValueError:
                return send_404(self)

        # doctors
        if self.path.startswith("/api/doctors/"):
            try:
                doctor_id = int(self.path.split("/")[-1])
                return delete_doctor(self, doctor_id)
            except ValueError:
                return send_404(self)

        # appointments
        if self.path.startswith("/api/appointments/"):
            try:
                appointment_id = int(self.path.split("/")[-1])
                return delete_appointment(self, appointment_id)
            except ValueError:
                return send_404(self)

        # billings
        if self.path.startswith("/api/billings/"):
            try:
                billing_id = int(self.path.split("/")[-1])
                return delete_billing(self, billing_id)
            except ValueError:
                return send_404(self)
                
        return send_404(self)


    def log_message(self, format, *args):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [ClinicServer] {format % args}")