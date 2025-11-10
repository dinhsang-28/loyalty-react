import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import axios from 'axios';

interface AffiliateOrder {
  id: string;
  affiliateName: string;
  orderAmount: number;
  commission: number;
  status: string;
  date: string;
}

const AdminAffiliateOrders = () => {
  const [orders, setOrders] = useState<AffiliateOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/affiliate/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

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
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-smooth">
                    <td className="px-6 py-4 text-foreground">{order.affiliateName}</td>
                    <td className="px-6 py-4 text-foreground">${order.orderAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-foreground">${order.commission.toFixed(2)}</td>
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
                    <td className="px-6 py-4 text-foreground">{order.date}</td>
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
