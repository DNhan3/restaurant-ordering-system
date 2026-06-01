# VNFood Restaurant Ordering System

## 1. Project Description

VNFood is a full-stack restaurant ordering system for Vietnamese food. Customers can browse dishes, manage a cart, place delivery orders, view receipts, update their profiles, and book tables. The system also includes an admin area for managing dishes, users, bookings, orders, and shipper accounts, plus a shipper dashboard for delivery processing.

## 2. Team Members and Roles

The application presents the following team members on the About page:

| Team member | Role |
| --- | --- |
| Chef. Đức Nhân | Bếp Trưởng |
| Chef. Nguyên Trung | Chuyên Gia Phở |
| Chef. Triều Hưng | Nghệ Nhân Bánh Mì |

> Before submission, update this table if your course requires software-development responsibilities such as frontend, backend, database, testing, or documentation.

## 3. Technology Stack

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

## 4. Prerequisites

- Node.js `^20.19.0` or `>=22.12.0`
- npm `10+`
- MySQL `8.x`
- Git

Java and PostgreSQL are not required for this project.

## 5. Step-by-Step Setup

1. Clone the repository and enter the project folder:

   ```bash
   git clone <repository-url>
   cd restaurant-ordering-system
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Create the backend environment file:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Generate a bcrypt hash for the admin password and paste the output into `ADMIN_PASSWORD_HASH` in `backend/.env`:

   ```bash
   node -e "console.log(require('bcryptjs').hashSync('ChangeMe123!', 10))"
   ```

5. Create the MySQL database and tables. From Command Prompt, run:

   ```bat
   mysql -u root -p < sql\schema.sql
   mysql -u root -p wad_restaurant < sql\add-more-dishes.sql
   ```

   The second command is optional, but recommended because it adds sample dishes. You can also run both SQL files from MySQL Workbench.

6. Install frontend dependencies and create its optional environment file:

   ```powershell
   cd ..\frontend
   npm install
   Copy-Item .env.example .env
   ```

## 6. Environment Variables

### Backend: `backend/.env`

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `DB_HOST` | No | `localhost` | MySQL host |
| `DB_PORT` | No | `3306` | MySQL port |
| `DB_USERNAME` | No | `root` | MySQL user |
| `DB_PASSWORD` | Yes for secured MySQL | Empty | MySQL password |
| `DB_NAME` | No | `wad_restaurant` | MySQL database |
| `PORT` | No | `3000` | Backend HTTP port |
| `JWT_SECRET` | Required in production | Development fallback | JWT signing secret |
| `JWT_TTL_SECONDS` | No | `86400` | JWT lifetime in seconds |
| `ADMIN_PASSWORD_HASH` | Yes for admin login | None | bcrypt hash of the admin password |
| `NODE_ENV` | No | Development mode | Set to `production` when deploying |

### Frontend: `frontend/.env`

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | No | `http://localhost:3000` | Backend API base URL |

## 7. Run Locally

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
- Admin login: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

## 8. Run Tests

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

Current verification status:

- `backend`: `npm test -- --runInBand` passes with 3 tests.
- `backend`: `npm run build` passes.
- `frontend`: `npm run build` passes.
- `backend`: `npm run test:e2e -- --runInBand` currently fails because its starter assertion still expects `Hello World!`.
- `frontend`: `npm run lint` currently reports existing hook-rule and unused-variable issues.

## 9. Known Issues and Limitations

- Checkout still accepts item prices and totals submitted by the client. A production version should recalculate them from database values on the server.
- JWT access tokens are stored in `localStorage`. Refresh tokens and HTTP-only authentication cookies are not implemented.
- TypeORM `synchronize: true` is enabled for development convenience and should be replaced with migrations before production deployment.
- Backend CORS currently allows only `http://localhost:5173`.
- The e2e starter assertion and frontend lint errors described above still need cleanup.

## 10. Live Demo URL

No public deployment URL is currently stored in this repository.

**Submission placeholder:** `<add-live-demo-url-here>`

## 11. Test Account Credentials

Shared plaintext passwords are intentionally not committed. Prepare demo-only accounts before submission and record their credentials here:

| Account type | Login | Password | Setup |
| --- | --- | --- | --- |
| Customer | `<demo-customer-email>` | `<demo-customer-password>` | Register from `/register` |
| Admin | Password-only login | `<demo-admin-password>` | Must match `ADMIN_PASSWORD_HASH` |
| Shipper | `<demo-shipper-email>` | `<demo-shipper-password>` | Create from the admin dashboard |

## 12. Screenshots

### Homepage

![VNFood homepage](docs/screenshots/home.png)

### Customer Login

![VNFood customer login](docs/screenshots/login.png)

### Admin Login

![VNFood admin login](docs/screenshots/admin-login.png)
