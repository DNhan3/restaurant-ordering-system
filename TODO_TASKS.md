# Project To Do Tasks

## Completed Implementation

- [x] Finish real checkout by connecting the checkout page to backend order creation.
- [x] Fix frontend/backend data shape mismatches for foods, orders, and order details.
- [x] Complete the order system: create orders, create details, list customer/admin orders, update status, cancel, and mark paid.
- [x] Replace the hardcoded frontend admin password with backend admin login.

## Notes

- Checkout now posts to `POST /checkout` and creates both a `bill_status` record and related `bill_details` rows in one backend transaction.
- Backend API services now return existing UI fields like `food_id`, `food_name`, `bill_id`, and `item_qty` directly.
- Removed the frontend `normalizers.js` compatibility layer.
- Order status now advances through confirmed, preparing, checking, delivering, delivered, and completed. Cancel and paid actions are handled separately.
- Admin login now calls `POST /admin/login`; the backend reads `ADMIN_PASSWORD_HASH` or `ADMIN_PASSWORD` from environment config.
- Added `backend/.env.example` with the required admin auth variables.
- The local backend `.env` has an admin password configured for development.

## Verification

- Backend build passed with `npm run build`.
- Frontend build passed with `npm run build`.
- Frontend dev server responded at `http://127.0.0.1:5173`.
