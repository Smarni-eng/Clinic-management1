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
- sqlite_web students.db