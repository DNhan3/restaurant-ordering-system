# VNFood Restaurant Ordering System

## 1. Project Description

VNFood is a full-stack restaurant ordering system for Vietnamese food. Customers can browse dishes, manage a cart, place delivery orders, view receipts, update their profiles, and book tables. The system also includes an admin area for managing dishes, users, bookings, orders, and shipper accounts, plus a shipper dashboard for delivery processing.

## 2. Technology Stack

Versions below are the installed versions from the current lockfiles.

| Layer | Technology | Version |
| --- | --- | --- |
| Frontend | React | 19.2.6 |
| Frontend | React Router DOM | 7.15.1 |
| Frontend | Vite | 8.0.13 |
| Frontend | Tailwind CSS | 4.3.0 |
| Frontend | Axios | 1.16.1 |
| Backend | NestJS | 11.1.21 |
| Backend | TypeScript | 5.9.3 |
| Backend | TypeORM | 1.0.0 |
| Database driver | mysql2 | 3.22.3 |
| Database | MySQL | 8.x recommended |
| Testing | Jest | 30.4.2 |

## 3. Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- npm `10+`
- MySQL `8.x`
- Git

Java and PostgreSQL are not required for this project.

## 4. Step-by-Step Setup

1. Clone the repository and enter the project folder:

   ```bash
   git clone [<repository-url>](https://github.com/DNhan3/restaurant-ordering-system.git)
   cd restaurant-ordering-system
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies and create its optional environment file:

   ```powershell
   cd ..\frontend
   npm install
   ```


## 5. Run Locally

On Windows, start both applications from the project root:

```powershell
.\run.bat
```

Or start them in separate terminals:

```bash
# Terminal 1
cd backend
npm run start:dev

# Terminal 2
cd frontend
npm run dev
```

Open:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000](http://localhost:3000)
- Admin login: [http://localhost:5173/admin/login](http://localhost:5173/admin)

## 6. Run Tests

Backend unit tests:

```bash
cd backend
npm test
npm run test:cov
```

Backend end-to-end tests:

```bash
cd backend
npm run test:e2e
```

Frontend verification:

```bash
cd frontend
npm run build
npm run lint
```

## 7. Live Demo URL

[https://successful-reverence-production-939c.up.railway.app/]

## 8. Test Account Credentials

Shared plaintext passwords are intentionally not committed. Prepare demo-only accounts before submission and record their credentials here:

| Account type | Login | Password |
| --- | --- | --- | 
| Customer | `<test@gmail.com>` | `<test1234>` |
| Admin | Password-only login | `<password123>` |
| Shipper | `<shipper1@gmail.com>` | `<123456>` |

