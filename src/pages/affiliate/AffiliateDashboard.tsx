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
  total_commission_balance: number;
  total_sales: number;
  pending_request: number;
  approved_waiting_payment: number;
  paid_total: number;
  totalClicks: number;
  totalOrders: number;
  conversionRate: string;
}

interface AffiliateProfile {
  _id: string;
  name: string;
  email: string;
  referral_code: string;
}

interface PayoutHistory {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
}

const AffiliateDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<AffiliateSummary | null>(null);
  const [profile, setProfile] = useState<AffiliateProfile | null>(null);
  const [payoutHistory, setPayoutHistory] = useState<PayoutHistory[]>([]);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const https = "https://loyaty-be.onrender.com";
  // const https = "http://localhost:3000";

  // --- HÀM FORMAT TIỀN TỆ ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      // minimumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    if (user?.isAffiliate) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setLoading(false);
            return;
          }
          const [profileRes, summaryRes, historyRes] = await Promise.all([
            axios.get(`${https}/api/affiliate/profile`),
            axios.get(`${https}/api/affiliate/summary`),
            axios.get(`${https}/api/affiliate/payouts`),
          ]);

          setProfile(profileRes.data.data);
          setSummary(summaryRes.data.data);
          setPayoutHistory(historyRes.data.data);

        } catch (error) {
          console.error('Failed to fetch affiliate data:', error);
          toast({
            title: 'Error',
            description: 'Could not load affiliate data.',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else if (user && !user.isAffiliate) {
      setLoading(false);
    }
  }, [user, toast, payoutAmount]);

  const handleCopyLink = () => {
    if (profile?.referral_code) {
      const link = `${https}/track?ref=${profile.referral_code}`;
      navigator.clipboard.writeText(link);
      toast({
        title: 'Copied!',
        description: 'Referral link copied to clipboard',
      });
    }
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(payoutAmount);
    if (!payoutAmount || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid payout amount',
        variant: 'destructive',
      });
      return;
    }

    if (summary && amount > summary.total_commission_balance) {
      toast({
        title: 'Insufficient Balance',
        description: 'Your requested amount exceeds your available balance.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await axios.post(`${https}/api/affiliate/request-payout`, { amount: amount });
      toast({
        title: 'Success',
        description: 'Payout request submitted',
      });
      setPayoutAmount('');
      const summaryRes = await axios.get(`${https}/api/affiliate/summary`);
      setSummary(summaryRes.data.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to request payout',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen py-16 px-4 text-center">Loading...</div>;
  }

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
              value={`${https}/track?ref=${profile?.referral_code || ''}`}
              readOnly
              className="bg-background text-foreground border-border"
            />
            <Button
              onClick={handleCopyLink}
              disabled={!profile}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <CopyIcon className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </Card>

        {/* Summary Section */}
        {summary ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Card 1: Total Clicks */}
            <Card className="p-6 bg-card text-card-foreground border-border">
              <div className="flex items-center gap-4">
                <MousePointerClickIcon className="w-10 h-10 text-primary" />
                <div>
                  <p className="text-muted-foreground text-sm">Total Clicks</p>
                  <p className="font-headline text-2xl font-bold text-foreground">
                    {summary.totalClicks}
                  </p>
                </div>
              </div>
            </Card>

            {/* Card 2: Total Orders */}
            <Card className="p-6 bg-card text-card-foreground border-border">
              <div className="flex items-center gap-4">
                <ShoppingCartIcon className="w-10 h-10 text-tertiary" />
                <div>
                  <p className="text-muted-foreground text-sm">Total Orders</p>
                  <p className="font-headline text-2xl font-bold text-foreground">
                    {summary.totalOrders}
                  </p>
                </div>
              </div>
            </Card>

            {/* Card 3: Conversion Rate */}
            <Card className="p-6 bg-card text-card-foreground border-border">
              <div className="flex items-center gap-4">
                <TrendingUpIcon className="w-10 h-10 text-accent" />
                <div>
                  <p className="text-muted-foreground text-sm">Conversion Rate</p>
                  <p className="font-headline text-2xl font-bold text-foreground">
                    {summary.conversionRate}
                  </p>
                </div>
              </div>
            </Card>

            {/* Card 4: Available Balance (FORMATTED) */}
            <Card className="p-6 bg-card text-card-foreground border-border">
              <div className="flex items-center gap-4">
                <DollarSignIcon className="w-10 h-10 text-success" />
                <div>
                  <p className="text-muted-foreground text-sm">Available Balance</p>
                  <p className="font-headline text-2xl font-bold text-foreground">
                    {formatCurrency(summary.total_commission_balance)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Card 5: Total Sale (FORMATTED) */}
            <Card className="p-6 bg-card text-card-foreground border-border">
              <div className="flex items-center gap-4">
                <DollarSignIcon className="w-10 h-10 text-success" />
                <div>
                  <p className="text-muted-foreground text-sm">Total Sales</p>
                  <p className="font-headline text-2xl font-bold text-foreground">
                    {formatCurrency(summary.total_sales)}
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
            <p className="text-sm text-muted-foreground mb-4">
              Available:
              {/* (FORMATTED) */}
              <span className="font-bold text-success ml-1">
                {formatCurrency(summary?.total_commission_balance || 0)}
              </span>
            </p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="payoutAmount" className="text-foreground">
                  Amount (USD)
                </Label>
                <Input
                  id="payoutAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder={`e.g. ${summary?.total_commission_balance.toFixed(2) || '100.00'}`}
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
              <Button
                onClick={handleRequestPayout}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={!summary || summary.total_commission_balance <= 0}
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
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {payoutHistory.map((payout) => (
                  <div
                    key={payout._id}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg"
                  >
                    <div>
                      {/* (FORMATTED) */}
                      <p className="text-foreground font-normal">
                        {formatCurrency(payout.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(payout.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <Badge
                      className={
                        payout.status === 'paid' ? 'bg-success text-success-foreground'
                          : payout.status === 'requested' ? 'bg-warning text-warning-foreground'
                            : payout.status === 'approved' ? 'bg-blue-500 text-white'
                              : payout.status === 'rejected' ? 'bg-destructive text-destructive-foreground'
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