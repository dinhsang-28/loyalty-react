import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns'; // Cần cài: npm install date-fns
import { CheckCircle, XCircle, DollarSign, Loader2 } from 'lucide-react'; // Icon từ lucide-react

import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"; // Sử dụng Table component của shadcn cho đẹp

// Interface khớp với Mongoose Model
interface Affiliate {
  _id: string;
  name: string;
  email: string;
  referral_code:string;
}

interface Payout {
  _id: string;
  affiliate: Affiliate | string; // Có thể là ID hoặc Object đã populate
  amount: number;
  status: 'requested' | 'approved' | 'rejected' | 'paid';
  createdAt: string;
}

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null); // Để hiện loading trên nút đang bấm
  const { toast } = useToast();

  const API_URL = "https://loyaty-be.onrender.com"; // Nên đưa vào biến môi trường

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/payouts`);
      setPayouts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
      toast({
        title: 'Error',
        description: 'Không thể tải danh sách yêu cầu rút tiền.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  console.log("data payouts",payouts);

  // Xử lý Duyệt (Approved) hoặc Từ chối (Rejected)
  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setProcessingId(id);
    try {
      // Backend: PATCH /admin/payouts/:payoutId/status
      await axios.patch(`${API_URL}/api/admin/payouts/${id}/status`, { status });
      
      toast({ 
        title: 'Thành công', 
        description: `Yêu cầu đã được chuyển sang trạng thái: ${status}` 
      });
      
      // Cập nhật state trực tiếp để đỡ phải gọi lại API (Optimistic update)
      setPayouts(prev => prev.map(p => p._id === id ? { ...p, status: status } : p));
      
    } catch (error: any) {
      toast({ 
        title: 'Lỗi', 
        description: error.response?.data?.message || 'Không thể cập nhật trạng thái', 
        variant: 'destructive' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Xử lý Đã thanh toán (Paid)
  const handleMarkAsPaid = async (id: string) => {
    setProcessingId(id);
    try {
      // Backend: PATCH /admin/payouts/:payoutId/paid
      await axios.patch(`${API_URL}/api/admin/payouts/${id}/paid`);
      
      toast({ 
        title: 'Thành công', 
        description: 'Đã xác nhận thanh toán thành công.' 
      });

      setPayouts(prev => prev.map(p => p._id === id ? { ...p, status: 'paid' } : p));

    } catch (error: any) {
      toast({ 
        title: 'Lỗi', 
        description: error.response?.data?.message || 'Lỗi hệ thống', 
        variant: 'destructive' 
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Helper để hiển thị tên Affiliate an toàn
  const getAffiliateName = (affiliate: Affiliate | string) => {
    if (typeof affiliate === 'string') return 'Unknown ID: ' + affiliate.substring(0, 6);
    return affiliate?.name || 'Unknown User';
  };

  // Helper format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Helper render Badge trạng thái
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-600 hover:bg-green-700">Đã thanh toán</Badge>;
      case 'approved':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Đã duyệt (Chờ ck)</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Đã từ chối</Badge>;
      default: // requested
        return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600">Yêu cầu mới</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Rút tiền</h1>
        <Badge variant="outline" className="text-lg px-4 py-1">
          Tổng yêu cầu: {payouts.length}
        </Badge>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Đối tác (Affiliate)</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Ngày yêu cầu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    Không có yêu cầu rút tiền nào.
                  </TableCell>
                </TableRow>
              ) : (
                payouts.map((payout) => (
                  <TableRow key={payout._id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{getAffiliateName(payout.affiliate)}</span>
                        <span className="text-xs text-muted-foreground">
                           {typeof payout.affiliate !== 'string' && payout.affiliate?.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      {formatCurrency(payout.amount)}
                    </TableCell>
                    <TableCell>
                      {payout.createdAt ? format(new Date(payout.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
                    </TableCell>
                    <TableCell>{renderStatusBadge(payout.status)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      
                      {/* TRƯỜNG HỢP 1: Mới yêu cầu -> Hiện nút Duyệt / Từ chối */}
                      {payout.status === 'requested' && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleUpdateStatus(payout._id, 'approved')}
                            disabled={!!processingId}
                          >
                            {processingId === payout._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                            Duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUpdateStatus(payout._id, 'rejected')}
                            disabled={!!processingId}
                          >
                             {processingId === payout._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
                            Từ chối
                          </Button>
                        </div>
                      )}

                      {/* TRƯỜNG HỢP 2: Đã Duyệt -> Hiện nút Xác nhận đã chuyển khoản */}
                      {payout.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50"
                          onClick={() => handleMarkAsPaid(payout._id)}
                          disabled={!!processingId}
                        >
                           {processingId === payout._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <DollarSign className="h-4 w-4 mr-1" />}
                          Xác nhận đã CK
                        </Button>
                      )}

                      {/* TRƯỜNG HỢP 3: Đã thanh toán hoặc Từ chối -> Không làm gì cả */}
                      {(payout.status === 'paid' || payout.status === 'rejected') && (
                        <span className="text-sm text-muted-foreground italic">Hoàn tất</span>
                      )}

                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default AdminPayouts;