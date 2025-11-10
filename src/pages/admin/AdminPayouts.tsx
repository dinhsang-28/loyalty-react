import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';

interface Payout {
  id: string;
  affiliateName: string;
  amount: number;
  status: string;
  requestDate: string;
}

const AdminPayouts = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const response = await axios.get('/api/admin/payouts');
      setPayouts(response.data);
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`/api/admin/payouts/${id}`, { status });
      toast({ title: 'Success', description: `Payout ${status}` });
      fetchPayouts();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-foreground mb-8">Manage Payouts</h1>

      {loading ? (
        <p className="text-muted-foreground">Loading payouts...</p>
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
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-muted/50 transition-smooth">
                    <td className="px-6 py-4 text-foreground">{payout.affiliateName}</td>
                    <td className="px-6 py-4 text-foreground">${payout.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          payout.status === 'completed'
                            ? 'bg-success text-success-foreground'
                            : payout.status === 'pending'
                            ? 'bg-warning text-warning-foreground'
                            : 'bg-destructive text-destructive-foreground'
                        }
                      >
                        {payout.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-foreground">{payout.requestDate}</td>
                    <td className="px-6 py-4">
                      {payout.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleUpdateStatus(payout.id, 'completed')}
                            size="sm"
                            className="bg-success text-success-foreground hover:bg-success/90"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleUpdateStatus(payout.id, 'rejected')}
                            size="sm"
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Reject
                          </Button>
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

export default AdminPayouts;
