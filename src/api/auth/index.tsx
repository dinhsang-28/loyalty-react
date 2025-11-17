import axios from "axios";
import { showMessage } from "../../utils/showMessages.tsx";

interface PostRegisterProps {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface PostLoginProps {
  phone: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user?: any;
}

export const PostRegister = async({fullname,email,phone,password,confirmPassword}:PostRegisterProps) => {
  const Url = "https://loyaty-be.onrender.com/api/auth/register";
  try {
    const res = await axios.post(Url, { name: fullname, email, phone, password, confirmPassword });
    console.log("THANH CONG: ", res.data);
    showMessage('success','Đăng kí thành công!');
    return res.data; // ✅ trả về cho component
  } catch (err) {
    console.log("THAT BAI: ", err);
    showMessage('error','Đăng kí thất bại!');
    throw err; // optional: re-throw để component biết lỗi
  }
};

export const PostLogin = async({phone,password}:PostLoginProps): Promise<LoginResponse> => {
  const Url = "https://loyaty-be.onrender.com/api/auth/login";
  try {
    const res = await axios.post<LoginResponse>(Url, { phone, password });
    console.log("THANH CONG: ", res.data);
    showMessage('success','Đăng nhập thành công!');
    return res.data; // ✅ trả về token/data
  } catch (err) {
    console.log("THAT BAI: ", err);
    showMessage('error','Đăng nhập thất bại!');
    throw err;
  }
};
