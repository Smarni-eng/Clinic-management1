##################### API Observation Via Codespace URL
##################### API Observation Via Hopscotch
##################### API Observation Via CURL

# A. Get All Patients
curl -X GET "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/patients"

# B. Get One Patient
curl -X GET "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/patients/1"

# C. Create Patient
curl -X POST "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/patients" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Sharma",
    "age": 30,
    "gender": "Male",
    "phone": "9876543210",
    "email": "rahul45@gmail.com",
    "disease": "Diabetes",
    "doctor": "K.Ravi Kumar"
  }'
# D. Update Patient
curl -X PUT "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/patients/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Sharma",
    "age": 31,
    "gender": "Male",
    "phone": "9876543222",
    "email": "rahul45@gmail.com",
    "disease": "Low BP",
    "doctor": "K.Ravi Kumar" 
  }'

# E. Delete Patient
curl -X DELETE "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/patients/1"


##################### DB Observation Via SQLite Web
- install https://github.com/coleifer/sqlite-web
- pip install sqlite-web
- sqlite_web clinic.db

# A. Get All Doctors
curl -X GET "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/doctors"

# B. Get One Doctor
curl -X GET "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/doctors/1"

# C. Create Doctor
curl -X POST "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/doctors" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "K.Ravi Kumar ",
    "age": 35,
    "gender": "Male",
    "phone": "98765s44289",
    "email": "ravi99@gmail.com",
    "specialisation": "Endocrynologist",
    "experience": "10"
  }'
# D. Update Doctor
curl -X PUT "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/doctors/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Snajay Malhotra ",
    "age": 40,
    "gender": "Male",
    "phone": "9936544289",
    "email": "sanj12@gmail.com",
    "specialisation": "Pediatrist",
    "experience": "15"
  }'

# E. Delete Doctor
curl -X DELETE "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/doctors/1"


##################### DB Observation Via SQLite Web
- install https://github.com/coleifer/sqlite-web
- pip install sqlite-web
- sqlite_web clinic.db

# A. Get All Appointments
curl -X GET "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/appointments"

# B. Get One Appointment
curl -X GET "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/appointments/1"

# C. Create Appointment
curl -X POST "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/appointments" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": 1,
    "doctor_id": 2,
    "appointment_date": "2025-01-10",
    "appointment_time": "11:30",
    "status": "Scheduled"
  }'
# D. Update Appointment
curl -X PUT "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/appointments/1" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": 2,
    "doctor_id": 3,
    "appointment_date": "2025-05-23",
    "appointment_time": "02:00",
    "status": " Not Scheduled"
  }'

# E. Delete Appointment
curl -X DELETE "https://sturdy-fortnight-pj5qw4x64p97f7664-8000.app.github.dev/api/appointments/1"


##################### DB Observation Via SQLite Web
- install https://github.com/coleifer/sqlite-web
- pip install sqlite-web
- sqlite_web clinic.db