# Styroform

A website where you can create or respond some forms.
Deployment Link:

## References I use while developing this website:
1. https://youtu.be/Cz-NebfESNM?si=uPDlg38f64B2dzHM

2. https://youtu.be/kArTb1IDERo?si=4AOU3GC58zVECWCB

3. https://pbp-fasilkom-ui.github.io/ganjil-2026/docs/tutorial-4

Tech Stack:
- Backend: Django
- Frontend: React + Vite

This README contains a complete local setup guide, from installation to running the website.

## 1. Prerequisites

Make sure these are installed:
- Python 3.10+ (3.11+ recommended)
- Node.js 18+ (Node 20 LTS recommended)
- npm

Check versions:

```bash
python3 --version
node --version
npm --version
```

## 2. Project Structure

```text
styroform/
├── backend/   # Django API + admin
├── frontend/  # React + Vite
└── README.md
```

## 3. Backend Setup (Django)

Run these commands from the project root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
```

Optional (if you want Django Admin access):

```bash
python manage.py createsuperuser
```

Run the backend server:

```bash
python manage.py runserver 127.0.0.1:8000
```

Backend will be available at:
- `http://127.0.0.1:8000`
- Admin: `http://127.0.0.1:8000/admin/`
- Health check: `http://127.0.0.1:8000/core/health/`

## 4. Frontend Setup (React + Vite)

Open a new terminal, then run from the project root:

```bash
cd frontend
npm ci
```

Optional: create `frontend/.env` if you want to change the backend target in development:

```env
VITE_BACKEND_DEV_URL=http://127.0.0.1:8000
```

Run the frontend:

```bash
npm run dev
```

Frontend will be available at:
- `http://localhost:5173`

Notes:
- Vite is already configured to proxy `/accounts`, `/forms`, `/core`, and `/media` to the backend.
- In development, you only need to run backend and frontend at the same time.

## 5. Run the Website (Quick Start)

1. Terminal 1 (backend):

```bash
cd backend
source .venv/bin/activate
python manage.py runserver 127.0.0.1:8000
```

2. Terminal 2 (frontend):

```bash
cd frontend
npm run dev
```

3. Open:
- `http://localhost:5173`

If both servers run without errors, the website is ready to use.

## 6. Quick Troubleshooting

- `ModuleNotFoundError` on backend:
  - Make sure the virtual environment is active and `pip install -r requirements.txt` has been run.
- Frontend cannot connect to backend:
  - Make sure backend is running at `127.0.0.1:8000`.
  - If backend runs on another port, set `VITE_BACKEND_DEV_URL` in `frontend/.env`.
- Database errors:
  - Run `python manage.py migrate` again.

2026 All rights reserved.