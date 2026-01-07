# Clinic-management
# 📘 **Clinic Management System – README**

### How to run the project

```shell
python app.py
```

### How to run the tests

```shell
python -m unittest -v
```

The app is deployed at this URL - https://pythonfullstack.onrender.com/

---------------------------------------------------------------------------

This mini full-stack project built with **Python (backend)** and **Vanilla JavaScript + Tailwind (frontend)**.

This project helps you understand how real web apps work:

* routing
* APIs
* HTTP requests
* DOM manipulation
* state management
* modular JavaScript
* frontend–backend communication

---

## 🚀 **What This Project Demonstrates**

### **Full Stack Basics**

* How a backend serves data over **REST APIs**
* How a frontend fetches that data and updates the UI
* How routing works in both frontend and backend
* How to organize files in a real project

### **Frontend Concepts**

* Single Page Application (SPA) basics
* Dynamic routing without page reload
* Importing JS modules
* Using Tailwind CSS for styling
* Using external CDNs: Google Fonts, Font Awesome, favicons
* DOM manipulation: creating elements, updating HTML, rendering tables
* Component structure (`Header`, `Footer`, `StudentForm`, `StudentTable`)
* Maintaining UI state (editing mode)

### **Backend Concepts**

* Python HTTP server using `BaseHTTPRequestHandler`
* Routing logic (UI routes vs API routes)
* Serving static files manually
* Basic CRUD operations
* Returning JSON responses
* Handling errors and sending 404 pages
* Working with a SQLite database

---

## 🏗️ **Project Structure**

```
pythonFullStack/
│
├── app.py                     # Starts the Python server
├── router.py                  # Handles API + UI routes
│
├── controllers/               # API logic (CRUD operations)
├── services/                  # Database interaction
├── database/                  # SQLite setup
│
├── frontend/
│   ├── pages/                 # SPA HTML pages (home, students, docs)
│   ├── assets/
│   │   ├── css/               # Custom styles
│   │   ├── js/
│   │   │   ├── router/        # SPA router
│   │   │   ├── components/    # UI components
│   │   │   ├── controllers/   # Frontend business logic
│   │   │   ├── services/      # API calls
│   │   │   └── utils/         # Helper functions
│   │   └── favicon/           # Favicon (remote in our case)
│   └── env.js                 # Frontend config
│
└── students.db                # SQLite database
```

---

## 🔌 **How the App Works (Big Picture)**

### **1. User visits `/students`**

* Browser loads `index.html` (SPA shell)
* SPA router loads the correct page into `<main id="app">`

### **2. JavaScript controller runs**

* Initializes form events
* Calls API to load all students
* Renders the list in a table

### **3. When user submits the form**

* JS collects form data
* Sends `POST /api/students`
* On success → reloads the list
* Updates the table without refreshing the page

### **4. Edit / Delete actions**

* Edit → loads student into the form
* Delete → triggers `DELETE /api/students/:id`
* Table refreshes dynamically

---

## 🧱 **Frontend Key Files**

### **✔ `viewRouter.js`**

* Controls SPA page navigation
* Updates URL without page reload
* Injects HTML into the `<main>` container

### **✔ `studentController.js`**

* Handles form events
* Calls student API
* Controls loading spinner
* Manages editing state

### **✔ `studentService.js`**

* Contains all fetch() calls
* Talks to backend API
* Safe JSON parser to avoid crashes

### **✔ Components**

* `Header` – page navigation
* `Footer` – branding
* `StudentForm` – Add/Edit UI
* `StudentTable` – renders the table rows
* `Alert` – success messages

---

## 🗄️ **Backend Key Files**

### **✔ `router.py`**

* Splits routes into:

  * UI routes (`/students`, `/home`)
  * Static files (`/frontend/...`)
  * API routes (`/api/students`)
* Sends 404 for unknown paths
* Prevents JSON errors and crashes

### **✔ `controllers/students.py`**

* Contains CRUD operations
* Reads/Writes to database
* Sends JSON responses

### **✔ `database/queries.py`**

* SQL statements
* Helper functions
* Connects to SQLite

---

## 🎨 **Styling & UI Enhancements**

* TailwindCSS via CDN
* Google Fonts (Outfit)
* Font Awesome icons
* External favicon
* Clean layout with card-style design


---

## 📦 **Run the App**

```
python app.py
```

Visit:

```
http://localhost:8000
```



# 🖥️ **Backend Architecture (Explained Simply)**

The backend is a lightweight Python server built WITHOUT frameworks.
No Flask, no FastAPI — just raw Python.

This teaches students:

* how HTTP actually works
* how routing is handled manually
* how APIs process requests
* how data flows from browser → server → database

Perfect for understanding fundamentals.

---

# 🧩 **Key Concepts Used in the Backend**

### **✔ Raw HTTP server**

* Uses Python's built-in `BaseHTTPRequestHandler`
* You handle `GET`, `POST`, `PUT`, `DELETE` manually
* Great for learning how web servers work under the hood

### **✔ Custom Router**

* You decide which URL goes to which function
* Splits routes into:

  * **UI routes** (serving HTML/JS/CSS)
  * **API routes** (JSON responses)
  * **Static file routes** (anything inside `/frontend`)

### **✔ SQLite database**

* Simple file-based database (`students.db`)
* Stores all student data permanently
* No server setup required

### **✔ CRUD operations**

Backend supports:

| HTTP Method | Path                | What it Does         |
| ----------- | ------------------- | -------------------- |
| GET         | `/api/students`     | Get all students     |
| GET         | `/api/students/:id` | Get a single student |
| POST        | `/api/students`     | Add a new student    |
| PUT         | `/api/students/:id` | Update a student     |
| DELETE      | `/api/students/:id` | Delete a student     |

### **✔ JSON responses**

* Python returns JSON strings manually
* Browser reads JSON using `fetch()`

### **✔ Error handling**

* If a route does not exist → return 404
* If parsing errors happen → safe 404
* Prevents server crashes and 502 errors

---

# 🏛️ **Backend Folder Structure (Explained)**

```
backend/
├── app.py               # Starts the server
├── router.py            # Handles all HTTP routing
│
├── controllers/         # Business logic (API handlers)
│   └── students.py      # CRUD functions
│
├── services/            # Database helpers
│   └── student_service.py
│
├── database/
│   ├── connection.py    # Opens SQLite connection
│   └── queries.py       # SQL functions
│
└── core/
    ├── static.py        # Serves static files (HTML, CSS, JS)
    ├── middleware.py    # Adds CORS headers
    ├── request.py       # (Optional) request parsing
    └── responses.py     # Helpers for sending JSON & 404
```

---

# 🔌 **How the Backend Serves the Frontend**

### 1️⃣ Browser visits `/students`

Backend returns:

```
frontend/pages/index.html
```

That HTML loads:

* Tailwind CDN
* JS modules
* SPA router

Everything else (JS/CSS/images) is served by the backend through:

```python
if path.startswith("/frontend/"):
    serve_static(...)
```

### 2️⃣ Browser loads the SPA

The browser now requests:

```
/frontend/assets/js/router/viewRouter.js
/frontend/assets/js/components/Header.html
/frontend/env.js
...
```

Backend serves all of these using the static file server.

---

# 🧠 **UI Router vs API Router**

The backend router distinguishes:

### **UI Routes (Frontend Pages)**

```
/
 /home
 /students
 /docs
```

These always return:

```
index.html (SPA shell)
```

### **Static Routes**

Everything under:

```
/frontend/
```

gets served as a file.

### **API Routes**

Only URLs beginning with:

```
/api/students
```

go to backend Python functions.

This separation is extremely important for SPAs.

---

# 🛠️ **How the API Functions Work**

Example: `create_student()`
Runs when the browser does:

```
fetch("/api/students", { method: "POST" })
```

Backend steps:

1. Read request body (JSON)
2. Convert into Python dictionary
3. Insert into SQLite (`INSERT INTO students ...`)
4. Send back success response

Example success JSON:

```json
{"status": "ok"}
```

---

# 🧱 **Database Layer (Services + Queries)**

### **connection.py**

* Opens a connection to SQLite
* Ensures the table exists

### **queries.py**

Contains SQL like:

```sql
SELECT * FROM students;
INSERT INTO students (name, email, course, year)
```

### **controllers/students.py**

Uses queries to fulfill API calls:

* Get all students
* Get one
* Add
* Update
* Delete

This clean separation teaches:

* controller = business logic
* service = database logic
* router = HTTP logic

---

# 🔄 **Request Cycle (Big Picture)**

Here’s what happens when user clicks "Add Student":

1. Frontend JS reads form values
2. Sends JSON to backend (`POST /api/students`)
3. Backend:

   * Parses JSON
   * Inserts record into database
   * Responds with success
4. Frontend:

   * Shows alert
   * Reloads student list (`GET /api/students`)
   * Renders table

This is **the full loop of a real full-stack application**.