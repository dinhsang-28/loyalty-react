import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  SearchIcon, 
  UserIcon, 
  GiftIcon, 
  CreditCardIcon, 
  HistoryIcon, 
  TrendingUpIcon,
  CheckCircle2Icon
} from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';
import { format } from 'date-fns';

// --- Interfaces khớp với dữ liệu trả về từ Backend ---

interface MemberInfo {
  _id: string;
  name: string;
  phone: string;
  redeemablePoints: number;
  totalPoints: number;
  tier: string;
}

interface NextTierInfo {
  name: string;
  pointsNeeded: number;
}

interface Voucher {
  _id: string;
  title: string;
  description: string;
  pointsRequired: number;
  value: number;
  benefit: 'fixed' | 'percentage';
  validTo: string;
}

interface OwnedVoucher {
  _id: string;
  voucherCode: string;
  status: string;
  createdAt: string;
  voucherId: Voucher | null; // Sửa interface: voucherId có thể là null nếu voucher gốc bị xóa
}

interface PointHistory {
  _id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  createdAt: string;
}

interface CustomerData {
  memberInfo: MemberInfo;
  nextTierInfo: NextTierInfo | null;
  availableVouchers: Voucher[];
  ownedVouchers: OwnedVoucher[];
  pointHistory: PointHistory[];
}

const StaffDashboard = () => {
  const [phoneSearch, setPhoneSearch] = useState('');
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [earnAmount, setEarnAmount] = useState('');
  
  const { toast } = useToast();
  const API_URL = "https://loyaty-be.onrender.com/api/public/staff";

  // --- 1. Tra cứu khách hàng ---
  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneSearch.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/lookup/${phoneSearch}`);
      setCustomer(res.data.data);
      // Reset form tích điểm khi tìm khách mới
      setEarnAmount('');
    } catch (error: any) {
      console.error(error);
      setCustomer(null);
      toast({
        title: "Không tìm thấy",
        description: error.response?.data?.message || "Không tìm thấy khách hàng với SĐT này",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // --- 2. Tích điểm (Earn Points) ---
  const handleEarnPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !earnAmount) return;

    try {
      const res = await axios.post(`${API_URL}/earn`, {
        phone: customer.memberInfo.phone,
        amount: Number(earnAmount)
      });

      toast({
        title: "Tích điểm thành công!",
        description: res.data.message,
        className: "bg-green-600 text-white border-none"
      });
      
      setEarnAmount('');
      // Reload lại data khách hàng để cập nhật điểm mới
      handleLookup(); 

    } catch (error: any) {
      toast({
        title: "Lỗi tích điểm",
        description: error.response?.data?.message || "Có lỗi xảy ra",
        variant: "destructive"
      });
    }
  };

  // --- 3. Đổi thưởng (Redeem Voucher) ---
  const handleRedeem = async (voucher: Voucher) => {
    if (!confirm(`Xác nhận đổi voucher "${voucher.title}" với ${voucher.pointsRequired} điểm?`)) return;

    try {
      const res = await axios.post(`${API_URL}/redeem`, {
        phone: customer?.memberInfo.phone,
        voucherId: voucher._id
      });

      toast({
        title: "Đổi thưởng thành công!",
        description: `Mã Voucher: ${res.data.data.voucherCode}`,
        className: "bg-blue-600 text-white border-none"
      });

      // Reload lại data
      handleLookup();

    } catch (error: any) {
      toast({
        title: "Đổi thưởng thất bại",
        description: error.response?.data?.message || "Không đủ điểm hoặc lỗi hệ thống",
        variant: "destructive"
      });
    }
  };

  // --- Helper: Format Tiền tệ ---
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-6">
      
      {/* --- HEADER & SEARCH BAR --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-6 rounded-lg shadow-sm border">
        <div>
          <h1 className="text-2xl font-bold font-headline text-foreground">Staff Portal</h1>
          <p className="text-muted-foreground">Tra cứu & Chăm sóc khách hàng thân thiết</p>
        </div>
        <form onSubmit={handleLookup} className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-[300px]">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Nhập số điện thoại khách..." 
              className="pl-8"
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Đang tìm...' : 'Tra cứu'}
          </Button>
        </form>
      </div>

      {customer ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* --- LEFT COLUMN: INFO & EARN POINTS --- */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* 1. Customer Profile Card */}
            <Card className="border-t-4 border-t-primary">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{customer.memberInfo.name}</CardTitle>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {customer.memberInfo.tier}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <UserIcon className="w-3 h-3" /> {customer.memberInfo.phone}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Điểm khả dụng</p>
                  <h2 className="text-3xl font-bold text-primary">
                    {new Intl.NumberFormat('vi-VN').format(customer.memberInfo.redeemablePoints)}
                  </h2>
                </div>

                {customer.nextTierInfo && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Hiện tại</span>
                      <span>Lên hạng {customer.nextTierInfo.name}</span>
                    </div>
                    <Progress value={
                      (customer.memberInfo.totalPoints / (customer.memberInfo.totalPoints + customer.nextTierInfo.pointsNeeded)) * 100
                    } className="h-2" />
                    <p className="text-xs text-center text-muted-foreground">
                      Cần tích thêm <strong>{customer.nextTierInfo.pointsNeeded}</strong> điểm
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2. Earn Points Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCardIcon className="w-5 h-5 text-green-600" />
                  Tích Điểm Mới
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEarnPoints} className="space-y-3">
                  <div className="space-y-1">
                    <Label>Giá trị đơn hàng (VNĐ)</Label>
                    <Input 
                      type="number" 
                      placeholder="VD: 500000" 
                      value={earnAmount}
                      onChange={(e) => setEarnAmount(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                    <TrendingUpIcon className="w-4 h-4 mr-2" />
                    Xác nhận Tích điểm
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* --- RIGHT COLUMN: TABS (REDEEM, MY VOUCHERS, HISTORY) --- */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="p-6">
                <Tabs defaultValue="redeem" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="redeem">Đổi thưởng ({customer.availableVouchers.length})</TabsTrigger>
                    <TabsTrigger value="owned">Đã sở hữu ({customer.ownedVouchers.length})</TabsTrigger>
                    <TabsTrigger value="history">Lịch sử</TabsTrigger>
                  </TabsList>

                  {/* TAB 1: REDEEM VOUCHERS */}
                  <TabsContent value="redeem" className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <GiftIcon className="w-5 h-5 text-primary" />
                      Danh sách quà có thể đổi
                    </h3>
                    {customer.availableVouchers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        Khách hàng chưa đủ điểm đổi thêm quà nào.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customer.availableVouchers.map((voucher) => (
                          <div key={voucher._id} className="border rounded-lg p-4 flex flex-col justify-between hover:bg-muted/50 transition-colors">
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-foreground line-clamp-1">{voucher.title}</h4>
                                <Badge variant="outline" className="border-primary text-primary">
                                  -{voucher.pointsRequired} điểm
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {voucher.description}
                              </p>
                              <div className="text-xs text-muted-foreground mb-4">
                                HSD: {format(new Date(voucher.validTo), 'dd/MM/yyyy')}
                              </div>
                            </div>
                            <Button 
                              onClick={() => handleRedeem(voucher)} 
                              size="sm" 
                              className="w-full"
                              variant={customer.memberInfo.redeemablePoints < voucher.pointsRequired ? "secondary" : "default"}
                              disabled={customer.memberInfo.redeemablePoints < voucher.pointsRequired}
                            >
                              Đổi ngay
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB 2: OWNED VOUCHERS */}
                  <TabsContent value="owned" className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CheckCircle2Icon className="w-5 h-5 text-green-600" />
                      Voucher khách đang có (Chưa dùng)
                    </h3>
                    <div className="space-y-3">
                      {customer.ownedVouchers.length === 0 ? (
                         <div className="text-center py-8 text-muted-foreground">
                           Khách hàng chưa có voucher nào khả dụng.
                         </div>
                      ) : (
                        customer.ownedVouchers.map((item) => (
                          <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm">
                             <div>
                               <h4 className="font-bold text-lg text-primary">{item.voucherCode}</h4>
                               {/* SỬA LỖI Ở ĐÂY: Thêm dấu ? (Optional Chaining) và giá trị dự phòng */}
                               <p className="font-medium">
                                 {item.voucherId?.title || <span className="text-destructive italic">Voucher không còn tồn tại</span>}
                               </p>
                               <p className="text-xs text-muted-foreground">
                                 Đổi ngày: {format(new Date(item.createdAt), 'HH:mm dd/MM/yyyy')}
                               </p>
                             </div>
                             <div className="text-right">
                               <Badge className="bg-green-100 text-green-800 hover:bg-green-100 mb-2">
                                 Sẵn sàng sử dụng
                               </Badge>
                               <p className="text-sm font-bold text-foreground">
                                  {/* SỬA LỖI Ở ĐÂY CŨNG VẬY */}
                                 -{item.voucherId?.value ?? 0} {item.voucherId?.benefit === 'percentage' ? '%' : 'VND'}
                               </p>
                             </div>
                          </div>
                        ))
                      )}
                    </div>
                  </TabsContent>

                  {/* TAB 3: HISTORY */}
                  <TabsContent value="history" className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <HistoryIcon className="w-5 h-5 text-gray-500" />
                      Lịch sử giao dịch gần nhất
                    </h3>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-muted text-muted-foreground font-medium">
                          <tr>
                            <th className="p-3">Thời gian</th>
                            <th className="p-3">Loại</th>
                            <th className="p-3">Điểm</th>
                            <th className="p-3">Nội dung</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {customer.pointHistory.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="p-4 text-center text-muted-foreground">Chưa có lịch sử</td>
                            </tr>
                          ) : (
                            customer.pointHistory.map((hist) => (
                              <tr key={hist._id} className="hover:bg-muted/30">
                                <td className="p-3 text-muted-foreground">
                                  {format(new Date(hist.createdAt), 'dd/MM/yyyy HH:mm')}
                                </td>
                                <td className="p-3">
                                  {hist.type === 'earn' ? (
                                    <Badge variant="outline" className="border-green-500 text-green-600">Tích điểm</Badge>
                                  ) : (
                                    <Badge variant="outline" className="border-red-500 text-red-600">Tiêu điểm</Badge>
                                  )}
                                </td>
                                <td className={`p-3 font-bold ${hist.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {hist.amount > 0 ? '+' : ''}{hist.amount}
                                </td>
                                <td className="p-3 max-w-[200px] truncate" title={hist.description}>
                                  {hist.description}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // STATE: EMPTY / INTRO
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-lg border-2 border-dashed">
          <SearchIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h2 className="text-xl font-semibold text-muted-foreground">Nhập số điện thoại để bắt đầu tra cứu</h2>
          <p className="text-sm text-muted-foreground mt-2">Hệ thống sẽ hiển thị thông tin thành viên, tích điểm và đổi quà.</p>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;