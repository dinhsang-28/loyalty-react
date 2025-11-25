import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

interface AffiliateOrder {
  _id:string;
  id: string;
  affiliate:{
    name:string,
    email:string
  };
  order:{
    total_amount:number
  };
  commission_amount: number;
 status: 'pending' | 'paid' | 'canceled' | 'completed' | 'rejected';
  updatedAt: string;
  createdAt:string
}

const AdminAffiliateOrders = () => {
  const [orders, setOrders] = useState<AffiliateOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrders();
  }, []);
  const https = "https://loyaty-be.onrender.com";

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${https}/api/admin/affiliate/orders`);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleApprove = async (id:string)=>{
    try {
      await axios.patch(`${https}/api/admin/affiliate/orders/${id}/approve`)
      toast({ title: 'Thành công', description: 'Đã duyệt hoa hồng và cộng tiền cho Affiliate' });
      fetchOrders();
    } catch (error) {
      toast({ 
        title: 'Lỗi', 
        description: 'Không thể duyệt đơn này', 
        variant: 'destructive' 
      });
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn hủy hoa hồng này không?")) return;

    try {
      await axios.patch(`${https}/api/admin/affiliate/orders/${id}/cancel`);
      toast({ title: 'Thành công', description: 'Đã hủy hoa hồng' });
      fetchOrders(); 
    } catch (error: any) {
      toast({ 
        title: 'Lỗi', 
        description: error.response?.data?.message || 'Không thể hủy đơn này', 
        variant: 'destructive' 
      });
    }
  };
  const formatCurrency = (amount:any)=>{
    const number = parseFloat(amount);
    if(isNaN(number)) return '0d';

    return new Intl.NumberFormat('vi-VN',{
      style:'currency',
      currency:'VND',
      // minimumFractionDigits: 2,
    }).format(number)
  }
  const formmatDate = (dateString:any)=>{
    if(!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN',{
      day:'2-digit',
      month:'2-digit',
      year:'numeric',
      hour:'2-digit',
      minute:'2-digit'
    }).format(date)
  }

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-foreground mb-8">Affiliate Orders</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading orders...</p>
      ) : (
        <Card className="bg-card text-card-foreground border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Affiliate
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Order Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders && orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-smooth">
                    <td className="px-6 py-4 text-foreground">{order.affiliate.name}</td>
                    <td className="px-6 py-4 text-foreground">{formatCurrency(order.order.total_amount)}</td>
                    <td className="px-6 py-4 text-foreground">{formatCurrency(order.commission_amount)}</td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          order.status === 'completed'
                            ? 'bg-success text-success-foreground'
                            : order.status === 'pending'
                            ? 'bg-warning text-warning-foreground'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-foreground">{formmatDate(order.updatedAt)}</td>
                    {/* Cột Actions: Chỉ hiện nút khi status là pending */}
                    <td className="px-6 py-4">
                      {order.status === 'pending' ? (
                        <div className="flex justify-center gap-2">
                          <Button
                            onClick={() => handleApprove(order._id || order.id!)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white h-8"
                            title="Duyệt & Cộng tiền"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> Approve
                          </Button>
                          
                          <Button
                            onClick={() => handleCancel(order._id || order.id!)}
                            size="sm"
                            variant="destructive"
                            className="h-8"
                            title="Hủy hoa hồng"
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-xs text-muted-foreground italic">
                          Processed
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminAffiliateOrders;
