// interfaces/affiliate.interface.ts
export interface IAffiliateCustomerResponse {
  success: boolean;
  data: IAffiliateCustomerData;
}

export interface IAffiliateCustomerData {
  memberInfo: IMemberInfo;
  nextTierInfo: INextTierInfo;
  availableVouchers: IAffiliateVoucher[];
  ownedVouchers: IOwnedVoucher[];
  pointHistory: IPointHistory[];
}

export interface IMemberInfo {
  _id: string;
  name: string;
  phone: string;
  redeemablePoints: number;
  totalPoints: number;
  tier: string;
}

export interface INextTierInfo {
  name: string;
  pointsNeeded: number;
}

export interface IAffiliateVoucher {
  _id: string;
  title: string;
  description?: string;
  pointsRequired: number;
  totalQuantity: number;
  remainingQuantity: number;
  validFrom: string;
  validTo: string;
  Status: string;
  benefit?: string;
  value?: number;
  minValue: number;
  maxDiscount?: number | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IOwnedVoucher {
  _id: string;
  memberId: string;
  voucherId: IAffiliateVoucher;
  voucherCode: string;
  pointsSpent: number;
  usedAt: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IPointHistory {
  _id: string;
  memberId: string;
  type: "earn" | "spend";
  amount: number;
  source: string;
  refId?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface IAffiliateVoucher {
  _id: string;
  title: string;
  pointsRequired: number;
  voucherCode?: string; // nếu đã redeem
  status?: string; // redeemed | used | expired
}

export interface IAffiliateTransaction {
  _id: string;
  type: "earn" | "spend";
  amount: number;
  source: string;
  description: string;
  createdAt: string;
}
export interface IEarnPointsResponse {
  success: boolean;
  message: string;
  data: IEarnPointsData;
}

export interface IEarnPointsData {
  memberId: string;
  pointsEarned: number;
  redeemablePoints: number;
}
