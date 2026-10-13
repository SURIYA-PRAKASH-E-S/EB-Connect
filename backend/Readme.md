# Electricity Board Connections - Backend

Backend API for the **Electricity Board Connections** project.

This backend is built using **Python, Django, and Django REST Framework**. It manages customers, electricity connections, applications, meters, bills and payments.

> **Note:** This project is created for learning and project demonstration purposes.

## Technologies

* Python 3.12
* Django
* Django REST Framework
* SQLite
* CSV
* Git & GitHub

## Backend Features

* Customer management
* Electricity connection management
* Connection applications
* Meter management
* Bill management
* Payment management
* REST API
* CSV data import
* Django Admin
* CRUD operations

## Project Structure

```text
backend/
│
├── accounts/
│   ├── management/
│   │   └── commands/
│   │       └── import_customers.py
│   ├── migrations/
│   ├── admin.py
│   ├── models.py
│   └── ...
│
├── connections/
│   ├── migrations/
│   ├── models.py
│   └── ...
│
├── bills/
│   ├── migrations/
│   ├── models.py
│   └── ...
│
├── config/
│   ├── settings.py
│   ├── urls.py
│   └── ...
│
├── data/
│   └── customers.csv
│
├── db.sqlite3
├── manage.py
└── requirements.txt
```

## Setup

### 1. Create virtual environment

```bash
python -m venv venv
```

### 2. Activate virtual environment

Windows:

```bash
venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` is not available:

```bash
pip install django djangorestframework django-cors-headers
```

### 4. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Import CSV data

Customer data is stored in:

```text
data/customers.csv
```

Import the data using:

```bash
python manage.py import_customers data/customers.csv
```

### 6. Create admin user

```bash
python manage.py createsuperuser
```

### 7. Start the server

```bash
python manage.py runserver
```

Backend will run at:

```text
http://127.0.0.1:8000/
```

## Django Admin

Open:

```text
http://127.0.0.1:8000/admin/
```

Login using the superuser account.

## Database

The development database uses SQLite:

```text
db.sqlite3
```

CSV files are used to provide initial/sample data.

## API

The backend REST API will provide endpoints for:

```text
/api/customers/
/api/applications/
/api/connections/
/api/meters/
/api/bills/
/api/payments/
```

CRUD operations will be implemented using Django REST Framework.

## Development Flow

```text
CSV Data
   ↓
Django Models
   ↓
SQLite Database
   ↓
Django REST Framework
   ↓
REST API
   ↓
React Frontend
```

## Frontend

The frontend will be developed separately using:

* React
* Bootstrap
* Axios

The React application will communicate with this Django backend through REST APIs.

## Future Deployment

Planned deployment:

```text
React Frontend → Vercel

Django Backend → Render

Database → PostgreSQL
```

## Learning Purpose

This backend project is developed for **learning full-stack development using Django, REST API, SQL/database concepts, CSV data handling, and React integration**.
