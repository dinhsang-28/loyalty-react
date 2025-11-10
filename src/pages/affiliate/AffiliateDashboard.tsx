import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { CopyIcon, MousePointerClickIcon, ShoppingCartIcon, DollarSignIcon, TrendingUpIcon } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';

interface AffiliateSummary {
  clicks: number;
  orders: number;
  commission: number;
  pendingPayout: number;
}

interface PayoutHistory {
  id: string;
  amount: number;
  status: string;
  date: string;
}

const AffiliateDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<AffiliateSummary | null>(null);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistory[]>([]);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      try {
        const [summaryRes, historyRes] = await Promise.all([
          axios.get('/api/affiliate/summary'),
          axios.get('/api/affiliate/payouts'),
        ]);
        setSummary(summaryRes.data);
        setPayoutHistory(historyRes.data);
      } catch (error) {
        console.error('Failed to fetch affiliate data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCopyLink = () => {
    if (user?.referralCode) {
      const link = `${window.location.origin}/track?ref=${user.referralCode}`;
      navigator.clipboard.writeText(link);
      toast({
        title: 'Copied!',
        description: 'Referral link copied to clipboard',
      });
    }
  };

  const handleRequestPayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid payout amount',
        variant: 'destructive',
      });
      return;
    }

    try {
      await axios.post('/api/affiliate/request-payout', { amount: parseFloat(payoutAmount) });
      toast({
        title: 'Success',
        description: 'Payout request submitted',
      });
      setPayoutAmount('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to request payout',
        variant: 'destructive',
      });
    }
  };

  if (!user?.isAffiliate) {
    return (
      <div className="min-h-screen py-16 px-4 lg:px-8 bg-background">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="font-headline text-3xl font-bold text-foreground mb-4">
            Become an Affiliate
          </h1>
          <p className="text-muted-foreground mb-8">
            Join our affiliate program and start earning commissions
          </p>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Apply Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 lg:px-8 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h1 className="font-headline text-3xl lg:text-4xl font-bold text-foreground mb-8">
          Affiliate Dashboard
        </h1>

        {/* Profile Section */}
        <Card className="p-6 bg-card text-card-foreground border-border mb-8">
          <h2 className="font-headline text-xl font-semibold text-foreground mb-4">
            Your Referral Link
          </h2>
          <div className="flex gap-4">
            <Input
              value={`${window.location.origin}/track?ref=${user.referralCode}`}
              readOnly
              className="bg-background text-foreground border-border"
            />
            <Button
              onClick={handleCopyLink}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <CopyIcon className="w-4 h-4 mr-2" />
              CopyIcon
            </Button>
          </div>
        </Card>

        {/* Summary Section */}
        {loading ? (
          <p className="text-muted-foreground">Loading summary...</p>
        ) : summary ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-card text-card-foreground border-border">
              <div className="flex items-center gap-4">
                <MousePointerClickIcon className="w-10 h-10 text-primary" />
                <div>
                  <p className="text-muted-foreground text-sm">Total Clicks</p>
                  <p className="font-headline text-2xl font-bold text-foreground">
                    {summary.clicks}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card text-card-foreground border-border">
              <div className="flex items-center gap-4">
                <ShoppingCartIcon className="w-10 h-10 text-tertiary" />
                <div>
                  <p className="text-muted-foreground text-sm">Total Orders</p>
                  <p className="font-headline text-2xl font-bold text-foreground">
                    {summary.orders}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card text-card-foreground border-border">
              <div className="flex items-center gap-4">
                <DollarSignIcon className="w-10 h-10 text-accent" />
                <div>
                  <p className="text-muted-foreground text-sm">Total Commission</p>
                  <p className="font-headline text-2xl font-bold text-foreground">
                    ${summary.commission.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card text-card-foreground border-border">
              <div className="flex items-center gap-4">
                <TrendingUpIcon className="w-10 h-10 text-success" />
                <div>
                  <p className="text-muted-foreground text-sm">Pending Payout</p>
                  <p className="font-headline text-2xl font-bold text-foreground">
                    ${summary.pendingPayout.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payout Request */}
          <Card className="p-6 bg-card text-card-foreground border-border">
            <h2 className="font-headline text-xl font-semibold text-foreground mb-6">
              Request Payout
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="payoutAmount" className="text-foreground">
                  Amount
                </Label>
                <Input
                  id="payoutAmount"
                  type="number"
                  step="0.01"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <Button
                onClick={handleRequestPayout}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Request Payout
              </Button>
            </div>
          </Card>

          {/* Payout History */}
          <Card className="p-6 bg-card text-card-foreground border-border">
            <h2 className="font-headline text-xl font-semibold text-foreground mb-6">
              Payout History
            </h2>
            {payoutHistory.length === 0 ? (
              <p className="text-muted-foreground">No payout history yet</p>
            ) : (
              <div className="space-y-4">
                {payoutHistory.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="text-foreground font-normal">${payout.amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{payout.date}</p>
                    </div>
                    <Badge
                      className={
                        payout.status === 'completed'
                          ? 'bg-success text-success-foreground'
                          : payout.status === 'pending'
                          ? 'bg-warning text-warning-foreground'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {payout.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
