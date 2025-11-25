import React,  { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

// Bạn có thể dùng icon từ thư viện (ví dụ heroicons) nếu muốn
// import { ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';

const AffiliateRegister = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);
  // const https = 'https://loyaty-be.onrender.com/api';
const https = 'https://loyaty-be.onrender.com';

  // Thêm state để theo dõi trạng thái copy
  const [isCopied, setIsCopied] = useState(false);

  const handleRegister = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessData(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Nên ném lỗi để hiển thị cho người dùng
        throw new Error('Bạn chưa đăng nhập. Vui lòng đăng nhập để đăng ký.');
      }
      const fetchdata = await axios.post(
        `${https}/api/auth/register-affiliate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessData(fetchdata.data);
    } catch (error) {
      let errorMessage = 'Đã có lỗi xảy ra, vui lòng thử lại.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || 'Lỗi từ máy chủ';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý copy link
  const handleCopy = () => {
    if (successData?.referralCode) {
      navigator.clipboard.writeText(successData.referralCode);
      setIsCopied(true);
      // Reset trạng thái "Đã copy" sau 2 giây
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  // ----------------------------------------------------------------
  // Giao diện khi ĐÃ ĐĂNG KÝ THÀNH CÔNG
  // ----------------------------------------------------------------
  if (successData) {
    return (
      <div className="max-w-lg mx-auto bg-white shadow-xl rounded-lg overflow-hidden border-t-4 border-green-500">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Đăng ký thành công!
          </h2>
          <p className="text-gray-600">{successData.message}</p>
          <p className="text-gray-600 mt-2">
            Giờ đây bạn đã là một thành viên Affiliate. Hãy dùng link bên dưới để
            giới thiệu và nhận hoa hồng.
          </p>

          <div className="mt-6">
            <label
              htmlFor="referralLink"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Link giới thiệu của bạn:
            </label>
            <div className="flex rounded-lg shadow-sm">
              <input
                id="referralLink"
                type="text"
                value={successData.referralCode}
                readOnly
                className="flex-1 block w-full rounded-none rounded-l-lg border-gray-300 p-3 bg-gray-50 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleCopy}
                className={`inline-flex items-center justify-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg text-sm font-medium transition-all duration-150
                  ${
                    isCopied
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
                style={{ minWidth: '90px' }} // Đặt chiều rộng cố định để nút không "nhảy"
              >
                {isCopied ? 'Đã copy!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------
  // Giao diện ĐĂNG KÝ (mặc định)
  // ----------------------------------------------------------------
  return (
    <div className="max-w-md mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Tham gia chương trình Affiliate
        </h2>
        <p className="text-gray-600 mt-3 text-center">
          Trở thành thành viên Affiliate của chúng tôi để nhận những phần hoa hồng
          hấp dẫn khi giới thiệu khách hàng mới.
        </p>

        <button
          onClick={handleRegister}
          disabled={isLoading}
          className="w-full mt-6 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              {/* SVG Spinner */}
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Đang xử lý...
            </div>
          ) : (
            'Đăng ký ngay'
          )}
        </button>

        {error && (
          <p className="text-red-600 text-center mt-4 text-sm">
            <strong>Lỗi:</strong> {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default AffiliateRegister;