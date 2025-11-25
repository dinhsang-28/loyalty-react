import { useEffect, useState, useCallback } from 'react';
import { Card } from '../../components/ui/card'; 
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge'; 
import { GiftIcon } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast'; 
interface Voucher {
  _id: string; 
  title: string; 
  description: string;
  pointsRequired: number; 
  remainingQuantity: number;
  validTo: string; 
}

interface MemberInfo {
  name: string;
  tier: string;
  redeemablePoints: number; 
  totalPoints: number;
}

const RewardsPage = () => {
  const { toast } = useToast();

  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState<string | null>(null); // State để theo dõi việc đổi voucher
  // const https = 'https://loyaty-be.onrender.com/api';
const https = 'https://loyaty-be.onrender.com/api';
  const fetchRewardsData = useCallback(async () => {
    try {
      const response = await axios.post(`${https}/loyalty/check-rewards`);

      if (response.data.success) {
        // Lấy dữ liệu từ cấu trúc trả về của controller
        setVouchers(response.data.data.rewards);
        setMemberInfo(response.data.data.member);
      } else {
        toast({
          title: 'Lỗi',
          description: response.data.message || 'Không thể tải dữ liệu đổi thưởng',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to fetch rewards data:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải dữ liệu đổi thưởng',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);
  console.log("data voucher:",vouchers);
  console.log("data memberInfo:",memberInfo);


  // Gọi API khi component được mount
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRewardsData();
  }, [fetchRewardsData]);

  // --- 4. Cập nhật hàm Handle Redeem ---
  const handleRedeem = async (voucher: Voucher) => {
    if (!memberInfo || memberInfo.redeemablePoints < voucher.pointsRequired) {
      toast({
        title: 'Không đủ điểm',
        description: 'Bạn không có đủ điểm để đổi phần thưởng này',
        variant: 'destructive',
      });
      return;
    }

    setIsRedeeming(voucher._id); // Bắt đầu loading (chỉ cho nút này)

    try {
      // Gọi đúng endpoint [POST] /loyalty/redeem
      // Gửi voucherId trong body
      const response = await axios.post(`${https}/loyalty/redeem`, {
        voucherId: voucher._id,
      });

      if (response.data.success) {
        toast({
          title: 'Đổi thưởng thành công!',
          description: `Bạn đã đổi: ${voucher.title}. Mã: ${response.data.data.voucherCode}`,
        });

        // Tải lại dữ liệu để cập nhật điểm và danh sách voucher
        await fetchRewardsData();

        // (Tùy chọn: Cập nhật AuthContext nếu bạn vẫn dùng nó)
        // if (updateUser) {
        //   updateUser({ points: memberInfo.redeemablePoints - voucher.pointsRequired });
        // }
      } else {
        // Hiển thị lỗi từ backend (ví dụ: "Phần thưởng đã hết")
        toast({
          title: 'Lỗi đổi thưởng',
          description: response.data.message || 'Đã xảy ra lỗi',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Lỗi đổi thưởng',
        // Hiển thị lỗi chi tiết từ server nếu có
        description: error.response?.data?.message || 'Không thể đổi phần thưởng',
        variant: 'destructive',
      });
    } finally {
      setIsRedeeming(null); // Kết thúc loading
    }
  };

  // Hàm định dạng ngày
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch (error) {
      return 'N/A';
    }
  };

  // --- 5. Cập nhật JSX (Render) ---
  return (
    <div className="min-h-screen py-16 px-4 lg:px-8 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-headline text-3xl lg:text-4xl font-bold text-foreground">
            Đổi Thưởng
          </h1>
          {/* Lấy điểm từ memberInfo thay vì user context */}
          {memberInfo && (
            <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">
              {memberInfo.redeemablePoints} Điểm
            </Badge>
          )}
        </div>

        {loading ? (
          <p className="text-muted-foreground">Đang tải phần thưởng...</p>
        ) : vouchers.length === 0 ? (
          <Card className="p-12 bg-card text-card-foreground border-border text-center">
            <GiftIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Chưa có phần thưởng nào</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vouchers.map((voucher) => {
              // Kiểm tra đủ điểm
              const canRedeem = memberInfo && memberInfo.redeemablePoints >= voucher.pointsRequired;
              
              return (
                <Card
                  key={voucher._id} // Dùng _id
                  className="p-6 bg-card text-card-foreground border-border flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <GiftIcon className="w-10 h-10 text-tertiary" />
                    <Badge className="bg-accent text-accent-foreground">
                      {voucher.pointsRequired} điểm
                    </Badge>
                  </div>

                  <h3 className="font-headline text-xl font-semibold text-foreground mb-2">
                    {voucher.title} {/* Dùng title */}
                  </h3>
                  <p className="text-muted-foreground mb-4 flex-grow">{voucher.description}</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Còn lại: {voucher.remainingQuantity}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Hạn dùng: {formatDate(voucher.validTo)} {/* Dùng validTo */}
                  </p>

                  <Button
                    onClick={() => handleRedeem(voucher)}
                    disabled={!canRedeem || !!isRedeeming} // Vô hiệu hóa nếu không đủ điểm hoặc đang đổi
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isRedeeming === voucher._id
                      ? 'Đang đổi...'
                      : canRedeem
                      ? 'Đổi ngay'
                      : 'Không đủ điểm'}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsPage;