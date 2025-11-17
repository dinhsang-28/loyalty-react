export interface ILoyaltyResponse {
  success: boolean;
  message: string;
  data: ILoyaltyData;
}

export interface ILoyaltyData {
  memberInfo: IMemberInfo;
  availableVouchers: IAvailableVoucher[];
  PointTransactionHistory: IPointTransaction[];
}

export interface IMemberInfo {
  name: string;
  phone: string;
  redeemablePoints: number;
  tier: string; // "Bronze" | "Silver" | "Gold" | ...
}

/* ===== VOUCHERS ===== */

export interface IAvailableVoucher {
  _id: string;
  memberId: string;
  voucherId: IVoucherDetail;
  voucherCode: string;
  pointsSpent: number;
  usedAt: string | null;
  status: string; // "redeemed" | "used" | "expired"
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IVoucherDetail {
  _id: string;
  title: string;
  pointsRequired: number;
  totalQuantity: number;
  remainingQuantity: number;
  validFrom: string;
  validTo: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  minValue: number;
}

/* ===== POINT TRANSACTION HISTORY ===== */

export interface IPointTransaction {
  _id: string;
  memberId: string;
  type: "earn" | "spend";
  amount: number; // ví dụ: -100
  source: string; // redeem_voucher, order, ...
  refId: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}




















// export interface ILoyaltyProfileResponse {
//   success: boolean;
//   data: ILoyaltyProfileData;
// }
// export interface ILoyaltyCheckRewardResponse {
//   success: boolean;
//   data: ILoyaltyCheckRewardData;
// }
// export interface ILoyaltyRedeemResponse {
//   success: boolean;
//   message: string;
//   data: ILoyaltyRedeemData;
// }
// export interface IMyVoucherResponse {
//   message: string;
//   data: IMyVoucher[];
// }
// export interface IOrderHistoryResponse {
//   message: string;
//   data: IOrder[];
// }
// export interface ILoyaltyProfileData {
//   _id: string;
//   user: string;
//   phone: string;
//   name: string;
//   tier: ILoyaltyTier;
//   totalPoints: number;
//   redeemablePoints: number;
//   source: string;
//   lastActiveAt: string; // ISO date string
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export interface ILoyaltyTier {
//   _id: string;
//   name: string;
//   min_points: number;
//   benefits: ILoyaltyBenefits;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export interface ILoyaltyBenefits {
//   discount: number;
//   pointMultiplier: number;
// }

// export interface ILoyaltyCheckRewardData {
//   member: ILoyaltyMember;
//   nextTier: INextTier;
//   rewards: ILoyaltyReward[]; // danh sách phần thưởng (rỗng trong ví dụ)
// }

// export interface ILoyaltyMember {
//   name: string;
//   tier: string;
//   redeemablePoints: number;
//   totalPoints: number;
// }

// export interface INextTier {
//   name: string;
//   pointsNeeded: number;
// }

// export interface ILoyaltyReward {
//   _id: string;
//   title: string;
//   /** optional fields: */
//   description?: string;
//   pointsRequired: number;
//   totalQuantity?: number;
//   remainingQuantity?: number;
//   validFrom?: string; // ISO date string
//   validTo?: string;   // ISO date string
//   status?: "active" | "inactive" | "expired" | string;
//   /** benefit type: e.g. "fixed" | "percentage" | "free_shipping" */
//   benefit?: "fixed" | "percentage" | "free_shipping" | string;
//   /** numeric value of benefit (e.g. 50000 for 50k, or percent) */
//   value?: number | null;
//   minValue?: number | null;     // if voucher có min order value
//   maxDiscount?: number | null;  // nếu có giới hạn tối đa
//   createdAt?: string;
//   updatedAt?: string;
//   __v?: number;
//   /** Nếu backend có thêm trường lạ, cho phép mở rộng */
  
// }


// export interface ILoyaltyRedeemData {
//   memberId: string;
//   voucherId: string;
//   voucherCode: string;
//   pointsSpent: number;
//   usedAt: string | null;
//   status: "redeemed" | "used" | "expired"; // có thể mở rộng nếu API trả thêm các trạng thái khác
//   _id: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }


// export interface IMyVoucher {
//   _id: string;
//   memberId: string;
//   voucherId: IVoucherDetail;
//   voucherCode: string;
//   pointsSpent: number;
//   usedAt: string | null;
//   status: "redeemed" | "used" | "expired"; // có thể mở rộng nếu cần
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export interface IVoucherDetail {
//   _id: string;
//   title: string;
//   pointsRequired: number;
//   totalQuantity: number;
//   remainingQuantity: number;
//   validFrom: string;
//   validTo: string;
//   status: "active" | "inactive" | "expired"; // mở rộng tùy backend
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   minValue: number;
// }

// export interface IOrder {
//   _id: string;
//   total_amount: number;
//   status: "pending" | "paid" | "cancelled" | "delivered" | string;
//   items: IOrderItem[];
//   createdAt?: string;
//   updatedAt?: string;
// }

// export interface IOrderItem {
//   productId: string;
//   productName: string;
//   quantity: number;
//   price: number;
//   image?: string;
// }