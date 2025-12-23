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
            patient_id = int(path.split("/")[-1])
            return get_patient(self, patient_id)

        #doctors
        if path == "/api/doctors":
            return get_all_doctors(self)

        if path.startswith("/api/doctors/"):
            doctor_id = int(path.split("/")[-1])
            return get_doctor(self, doctor_id)

        #appointments
        if path == "/api/appointments":
            return get_all_appointments(self)

        if path.startswith("/api/appointments/"):
           appointment_id = int(path.split("/")[-1])
           return get_appointment(self, appointment_id)

        return send_404(self)


    # ---------------------------
    # CREATE (POST)
    # ---------------------------
    #patients
    def do_POST(self):
        if self.path == "/api/patients":
            return create_patient(self)

    #doctors
        if self.path == "/api/doctors":
            return create_doctor(self)

    #appointments
        if self.path == "/api/appointments":
            return create_appointment(self)
        return send_404(self)


    # ---------------------------
    # UPDATE (PUT)
    # ---------------------------
    #patients
    def do_PUT(self):
        if self.path.startswith("/api/patients/"):
            patient_id = int(self.path.split("/")[-1])
            return update_patient(self, patient_id)
       
    #doctors
        if self.path.startswith("/api/doctors/"):
           doctor_id = int(self.path.split("/")[-1])
           return update_doctor(self, doctor_id)

    #ppointments
        if self.path.startswith("/api/appointments/"):
          appointment_id = int(self.path.split("/")[-1])
          return update_appointment(self, appointment_id)
        return send_404(self)


    # ---------------------------
    # DELETE (DELETE)
    # ---------------------------
    #patients
    def do_DELETE(self):
        if self.path.startswith("/api/patients/"):
            patient_id = int(self.path.split("/")[-1])
            return delete_patient(self, patient_id)

    #doctors
        if self.path.startswith("/api/doctors/"):
            doctor_id = int(self.path.split("/")[-1])
            return delete_doctor(self, doctor_id)

    #appointments
        if self.path.startswith("/api/appointments/"):
            appointment_id = int(self.path.split("/")[-1])
            return delete_appointment(self, appointment_id)
        return send_404(self)


    def log_message(self, format, *args):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [ClinicServer] {format % args}")
