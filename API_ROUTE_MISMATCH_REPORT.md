# API Route Mismatch Fix Report

## Summary

Updated the frontend API service routes to match the backend route naming convention and added the small backend endpoints needed by those service calls.

## Frontend Changes

- `frontend/src/services/orderService.js`
  - `/billstatus` -> `/bill-status`
  - `/billdetails` -> `/bill-details`
  - Order details now call `/bill-details/bill/:billId`
  - Removed the hardcoded `API_URL` import so requests use the configured Axios base URL.
- `frontend/src/services/bookingService.js`
  - `/booking` -> `/bookings`
  - Removed the hardcoded `API_URL` import.
- `frontend/src/services/cartService.js`
  - `/cartItem` -> `/cart-items`
  - User cart routes now use `/cart-items/user/:userId`
  - User and food deletion now uses `/cart-items/user/:userId/food/:foodId`
  - Removed the hardcoded `API_URL` import.

## Backend Changes

- `backend/src/controllers/bill-status.controller.ts`
  - Added `POST /bill-status` for creating bill status/order records.
  - Added `GET /bill-status/new` for the existing frontend `getNewBillId` service method.
- `backend/src/services/bill-status.service.ts`
  - Added `getNextBillId`.
- `backend/src/controllers/bill-details.controller.ts`
  - Added `GET /bill-details/bill/:billStatusId` for listing all detail rows for one bill/order.
- `backend/src/services/bill-details.service.ts`
  - Added `findByBillStatus`.
- `backend/src/controllers/bookings.controller.ts`
  - Added `GET /bookings`.
- `backend/src/services/bookings.service.ts`
  - Added `findAll`.
- `backend/src/controllers/cart-items.controller.ts`
  - Added `GET /cart-items/user/:userId`.
  - Added `DELETE /cart-items/user/:userId`.
- `backend/src/services/cart-items.service.ts`
  - Added `findByUser`.
  - Added `removeByUser`.
- `backend/src/app.service.ts`
  - Updated the route list from `/booking` to `/bookings`.

## Route Mapping

| Feature | Old Frontend Route | Fixed Route |
| --- | --- | --- |
| User orders | `/billstatus/user/:userId` | `/bill-status/user/:userId` |
| All orders | `/billstatus` | `/bill-status` |
| Order details | `/billdetails/:billId` | `/bill-details/bill/:billId` |
| Bill status | `/billstatus/bill/:billId` | `/bill-status/bill/:billId` |
| Create order | `/billstatus` | `/bill-status` |
| Update order | `/billstatus/:billId` | `/bill-status/:billId` |
| Mark paid | `/billstatus/paid/:billId` | `/bill-status/paid/:billId` |
| Cancel order | `/billstatus/cancel/:billId` | `/bill-status/cancel/:billId` |
| Create bill detail | `/billdetails` | `/bill-details` |
| Get new bill id | `/billstatus/new` | `/bill-status/new` |
| Booking create/list | `/booking` | `/bookings` |
| User cart | `/cartItem/:userId` | `/cart-items/user/:userId` |
| Add cart item | `/cartItem` | `/cart-items` |
| Update cart item | `/cartItem` | `/cart-items` |
| Remove cart item | `/cartItem/:userId/:foodId` | `/cart-items/user/:userId/food/:foodId` |
| Clear user cart | `/cartItem/:userId` | `/cart-items/user/:userId` |

## Verification

- Confirmed the old route strings no longer appear in `frontend/src` or `backend/src`.
- Backend build passed with `npm run build`.
- Frontend build passed with `npm run build`.
