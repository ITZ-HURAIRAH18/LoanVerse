
# 💸 LoanVerse – A Modern Loan Management System

**LoanVerse** is a full-stack Loan Management System built using **Django** (backend) and **React (Vite)** (frontend). Designed for financial institutions, startups, or loan-based platforms, it enables seamless loan application, approval, repayment tracking, and role-based dashboards with real-time insights.

---

## 🚀 Features

### 🧑‍💼 User Panel
- Secure sign-up and login (session-based auth)
- Apply for loans from various categories
- Track loan status: **Approved**, **Pending**, or **Rejected**
- Repay loans with progress tracking
- View complete **loan history** and **transaction summaries**

### 🛠 Admin Panel
- View, approve, reject, and disburse loan requests
- Manage loan categories (Create/Update/Delete)
- Dashboard with real-time statistics and charts
- Monitor repayments and outstanding balances

---

## 🛠 Tech Stack

### Frontend:
- **React (Vite)**
- **Tailwind CSS**
- **Recharts** (for dynamic charts)

### Backend:
- **Django** + **Django REST Framework**
- **Session Authentication**
- **SQLite** or **PostgreSQL** (easily switchable)

---

## 📦 Installation

### 🔧 Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
````

### 🎨 Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Dashboard Preview

* Clean **Tailwind UI** cards displaying key metrics
* **Pie** and **Bar charts** visualizing loan status
* **Role-based redirection** (User/Admin)
* Intuitive and responsive UI for all devices

---

## 📁 Project Structure

```
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
```

---



## 🤝 Contributing

Contributions are welcome!
For major changes, please open an issue first to discuss what you'd like to change.

---

## 👨‍💻 Author

**Muhammad Abu Hurairah**

* 🌐 GitHub: [@ITZ-HURAIRAH18](https://github.com/ITZ-HURAIRAH18)
* 💼 LinkedIn: [Muhammad Abu Hurairah](https://linkedin.com/in/muhammad-abu-hurairah-988ba1303)

---

> “Empowering digital lending through modern technology.” – *LoanVerse*

```
