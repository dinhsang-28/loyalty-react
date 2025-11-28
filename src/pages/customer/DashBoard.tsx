"use client";
import  { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Ticket, ShoppingBag, Star, TrendingUp } from 'lucide-react';
import { format } from 'date-fns'; // Thư viện để format ngày

// Định nghĩa kiểu dữ liệu (Bạn nên điều chỉnh lại cho khớp với Model)
interface Member {
  _id: string;
  fullName: string;
  email: string;
  totalPoints: number;
  tier: {
    name: string;
  };
}

interface Order {
  _id: string;
  orderCode: string; // Giả sử có mã đơn hàng
  createdAt: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'cancelled'; // Giả sử có trạng thái
}

interface Redemption {
  _id: string;
  voucherCode: string;
  status: 'redeemed' | 'used' | 'expired'; // Giả sử có trạng thái
  voucherId: {
    title: string;
    description: string;
    validTo:Date,
    validFrom:Date
  };
  createdAt: string;
}

// API Base URL
// const API_URL = 'https://loyaty-be.onrender.com/api';
// const https = 'https://loyaty-be.onrender.com/api';
const https = 'https://loyaty-be.onrender.com/api';

const LoyaltyDashboard = () => {
  const [member, setMember] = useState<Member | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vouchers, setVouchers] = useState<Redemption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Bạn chưa đăng nhập.');
        setIsLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const [profileRes, ordersRes, vouchersRes] = await Promise.all([
          axios.get(`${https}/loyalty/profile`, { headers }),
          axios.get(`${https}/loyalty/order`, { headers }),
          axios.get(`${https}/loyalty/my-voucher`, { headers }),
        ]);

        setMember(profileRes.data.data);
        setOrders(ordersRes.data.data);
        setVouchers(vouchersRes.data.data);
      } catch (err: any) {
        console.error(err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
 //format dinh gia tien
    const formatCurrency = (amount:number)=>{
        return new Intl.NumberFormat('vi-VN',{
            style:'currency',
            currency:'VND',
        }).format(amount)
    };
  const totalSpent = orders
    .filter((order) => order.status === 'paid')
    .reduce((acc, order) => acc + order.total_amount, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!member) {
    return <p>Không tìm thấy thông tin thành viên.</p>;
  }
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      {/* 1. Tiêu đề chào mừng */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Chào mừng trở lại, {member.fullName}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Khám phá đặc quyền, điểm thưởng và các ưu đãi dành riêng cho bạn.
        </p>
      </div>

      {/* 2. Các thẻ thống kê nhanh */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm hiện tại</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.totalPoints}</div>
            <p className="text-xs text-muted-foreground">
              Điểm bạn có thể dùng để đổi thưởng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hạng thành viên</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{member.tier.name}</div>
            <p className="text-xs text-muted-foreground">
              Tận hưởng đặc quyền của hạng
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chi tiêu</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng tiền từ các đơn hàng thành công
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Bố cục chính: Đơn hàng và Vouchers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Lịch sử đơn hàng */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử giao dịch</CardTitle>
              <CardDescription>
                Các đơn hàng bạn đã thực hiện gần đây.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Ngày mua</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Tổng tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">
                          {order.orderCode || order._id.slice(-6)}
                        </TableCell>
                        <TableCell>
                          {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            // variant={
                            //   order.status === 'completed'
                            //     ? 'success' // Giả sử bạn có variant 'success'
                            //     : order.status === 'cancelled'
                            //     ? 'destructive'
                            //     : 'outline'
                            // }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(order.total_amount)} 
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    // Bạn có thể tạo component TableEmptyRow
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Bạn chưa có đơn hàng nào.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Cột phải: Voucher của bạn */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Voucher của bạn</CardTitle>
              <CardDescription>
                Các voucher bạn đã đổi và sẵn sàng sử dụng.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              { vouchers.length > 0 ? (
                vouchers
                  .filter((v) => v.status === 'redeemed' && v.voucherId!==null) // Chỉ hiển thị voucher chưa dùng
                  .map((voucher) => (
                    <div
                      key={voucher._id}
                      className="flex items-start p-4 border rounded-lg bg-background"
                    >
                      <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                         <Ticket className="w-5 h-5 text-primary" />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="font-semibold text-sm">
                          {voucher.voucherId.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Mã: <strong>{voucher.voucherCode}</strong>
                        </p>
                        <p className="text-xs text-muted-foreground">
                           Ngày đổi: {format(new Date(voucher.createdAt), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-muted-foreground text-center p-4">
                  Bạn chưa đổi voucher nào.
                </p>
              )}

              {/* Hiển thị thông báo nếu không có voucher "chưa sử dụng" */}
              {vouchers.length > 0 &&
                vouchers.filter((v) => v.status === 'redeemed').length === 0 && (
                  <p className="text-sm text-muted-foreground text-center p-4">
                    Bạn đã sử dụng hết voucher.
                  </p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyDashboard;