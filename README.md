LoanVerse 💸 – A Modern Loan Management System
LoanVerse is a full-stack Loan Management System built using Django for the backend and React for the frontend. It provides a robust platform for managing loan applications, repayments, user and admin dashboards, and transaction history in real-time.

🚀 Features
🧑‍💼 User Panel:
Sign up/login with session-based auth

Apply for new loans from available categories

Track approved, pending, and rejected loan status

Make repayments and view repayment progress

Access detailed loan history and transaction summaries

🛠 Admin Panel:
View and manage all user loan requests

Approve/reject/disburse loans

Manage loan categories (create, update, delete)

Dashboard with key loan statistics and charts

Monitor repayment and outstanding balances

🛠 Tech Stack
Frontend: - React (Vite)

Tailwind CSS

Recharts (for charts)

Backend: - Django + Django REST Framework

Session Authentication

SQLite/PostgreSQL (pluggable)

📦 Installation
Backend (Django)
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend (React)
cd frontend
npm install
npm run dev

📊 Dashboard Preview
Clean Tailwind UI cards for stats

Pie/Bar charts showing repayment vs pending loans

Role-based redirection (Admin/User)

📁 Folder Structure
LoanVerse/
├── backend/
│   ├── manage.py
│   ├── loan_app/
│   ├── users/
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
└── README.md

📜 License
This project is licensed under the MIT License.

🤝 Contributing
Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

👨‍💻 Author
Muhammad Abu Hurairah
GitHub | LinkedIn
