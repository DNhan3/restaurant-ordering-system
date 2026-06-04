import { BillDetail } from '../models/bill-detail.entity.js';
import { BillStatus, BillStatusEnum } from '../models/bill-status.entity.js';
import { Food } from '../models/food.entity.js';

const STATUS_TO_NUMBER: Record<string, number> = {
  [BillStatusEnum.CANCELLED]: 0,
  [BillStatusEnum.PENDING]: 1,
  [BillStatusEnum.CONFIRMED]: 1,
  [BillStatusEnum.PREPARING]: 2,
  [BillStatusEnum.CHECKING]: 3,
  [BillStatusEnum.DELIVERING]: 4,
  [BillStatusEnum.DELIVERED]: 5,
  [BillStatusEnum.COMPLETED]: 6,
  [BillStatusEnum.PAID]: 6,
};

const toNumber = (value: unknown, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

export const mapFoodResponse = (food: Food | null | undefined) => {
  if (!food) return null;

  return {
    food_id: food.id,
    food_name: food.name,
    food_price: toNumber(food.price),
    food_discount: 0,
    food_desc: food.description ?? '',
    food_image: food.image ?? '',
    food_category: food.category ?? '',
    food_vote: 0,
    food_status: [],
    food_type: '',
    food_available: food.isAvailable,
  };
};

export const mapBillDetailResponse = (
  detail: BillDetail | null | undefined,
) => {
  if (!detail) return null;

  return {
    bill_detail_id: detail.id,
    bill_status_id: detail.billStatusId,
    food_id: detail.foodId,
    item_qty: detail.quantity,
    item_price: toNumber(detail.price),
    food: mapFoodResponse(detail.food),
  };
};

export const mapBillStatusResponse = (
  billStatus: BillStatus | null | undefined,
) => {
  if (!billStatus) return null;

  const details = billStatus.billDetails?.map(mapBillDetailResponse) ?? [];

  return {
    bill_id: billStatus.id,
    user_id: billStatus.userId,
    bill_status: STATUS_TO_NUMBER[billStatus.status] ?? 1,
    bill_paid: billStatus.paid ? 'true' : 'false',
    bill_total: toNumber(billStatus.total),
    bill_discount: toNumber(billStatus.discount),
    bill_delivery: toNumber(billStatus.deliveryFee),
    bill_phone: billStatus.phone ?? '',
    bill_address: billStatus.address ?? '',
    bill_payment_method: billStatus.paymentMethod ?? 'cash',
    bill_when: billStatus.createdAt,
    bill_details: details,
    user: billStatus.user,
    shipper_id: billStatus.shipperId ?? null,
    shipper: billStatus.shipper
      ? {
        user_id: billStatus.shipper.id,
        user_name: billStatus.shipper.name,
        user_email: billStatus.shipper.email,
      }
      : null,
  };
};

