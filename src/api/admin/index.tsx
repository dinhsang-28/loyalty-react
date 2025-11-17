import axios from "axios";

const URL = "https://loyaty-be.onrender.com";



// 1. Tra cứu khách hàng
export const getAffiliateCustomer = async (phone: string) => {
  const endpoint = `${URL}/api/public/staff/lookup/${phone}`;
  try {
    const res = await axios.get(endpoint);
    console.log("AFFILIATE CUSTOMER DATA:", res.data?.data);
    return res.data?.data;
  } catch (error) {
    console.error("ERROR GET AFFILIATE CUSTOMER:", error);
    throw error;
  }
};

// 2. Tích điểm cho khách
export const addAffiliatePoints = async (phone: string, amount: number) => {
  const endpoint = `${URL}/api/public/staff/earn`;
  try {
    const res = await axios.post(endpoint, { phone, amount });
    console.log("ADD POINTS RESPONSE:", res.data?.data);
    return res.data?.data;
  } catch (error) {
    console.error("ERROR ADD POINTS:", error);
    throw error;
  }
};

// 3. Redeem voucher cho khách
export const redeemAffiliateVoucher = async (phone: string, voucherId: string) => {
  const endpoint = `${URL}/api/public/staff/redeem`;
  try {
    const res = await axios.post(endpoint, { phone, voucherId });
    console.log("REDEEM VOUCHER RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error("ERROR REDEEM VOUCHER:", error);
    throw error;
  }
};


// =====================
// 4. Lấy danh sách voucher (dành cho Admin/Staff quản lý)
// GET /api/public/staff/vouchers?page=1&limit=10
// Nếu có search: POST /api/public/staff/vouchers { search: "..." }
// =====================
export const getVouchers = async (page: number = 1, limit: number = 10, search?: string) => {
  const endpoint = `${URL}/api/public/staff/vouchers?page=${page}&limit=${limit}`;

  try {
    let res;
    if (search) {
      // POST với search
      res = await axios.get(endpoint, { params: { search } });
    } else {
      // GET bình thường
      res = await axios.get(endpoint);
    }
    console.log("VOUCHERS DATA:", res.data?.data);
    return res.data?.data;
  } catch (error) {
    console.error("ERROR GET VOUCHERS:", error);
    throw error;
  }
};

// =====================
// 5. CRUD Voucher
// =====================

// Tạo voucher mới
export const createVoucher = async (voucherData: any) => {
  const endpoint = `${URL}/api/public/staff/create/vouchers`;
  try {
    const res = await axios.post(endpoint, voucherData);
    console.log("CREATE VOUCHER RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error("ERROR CREATE VOUCHER:", error);
    throw error;
  }
};

// Cập nhật voucher
export const editVoucher = async (voucherId: string, updateData: any) => {
  const endpoint = `${URL}/api/public/staff/edit/vouchers/${voucherId}`;
  try {
    const res = await axios.patch(endpoint, updateData);
    console.log("EDIT VOUCHER RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error("ERROR EDIT VOUCHER:", error);
    throw error;
  }
};

// Xóa voucher
export const deleteVoucher = async (voucherId: string) => {
  const endpoint = `${URL}/api/public/staff/delete/vouchers/${voucherId}`;
  try {
    const res = await axios.delete(endpoint);
    console.log("DELETE VOUCHER RESPONSE:", res.data);
    return res.data;
  } catch (error) {
    console.error("ERROR DELETE VOUCHER:", error);
    throw error;
  }
};
