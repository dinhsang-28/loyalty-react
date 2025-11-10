import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { GiftIcon } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../../hooks/use-toast';

interface Voucher {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  code: string;
  expiryDate: string;
}

const RewardsPage = () => {
  const { user, updateUser } = useAuth();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchVouchers = async () => {
      try {
        const response = await axios.get('/api/loyalty/vouchers');
        setVouchers(response.data);
      } catch (error) {
        console.error('Failed to fetch vouchers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  const handleRedeem = async (voucher: Voucher) => {
    if (!user || user.points < voucher.pointsCost) {
      toast({
        title: 'Insufficient Points',
        description: 'You do not have enough points to redeem this voucher',
        variant: 'destructive',
      });
      return;
    }

    try {
      await axios.post(`/api/loyalty/redeem/${voucher.id}`);
      updateUser({ points: user.points - voucher.pointsCost });
      toast({
        title: 'Success',
        description: `Voucher redeemed! Code: ${voucher.code}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to redeem voucher',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 lg:px-8 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-headline text-3xl lg:text-4xl font-bold text-foreground">
            Available Rewards
          </h1>
          {user && (
            <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">
              {user.points} Points
            </Badge>
          )}
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading rewards...</p>
        ) : vouchers.length === 0 ? (
          <Card className="p-12 bg-card text-card-foreground border-border text-center">
            <GiftIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No rewards available at the moment</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vouchers.map((voucher) => {
              const canRedeem = user && user.points >= voucher.pointsCost;
              return (
                <Card
                  key={voucher.id}
                  className="p-6 bg-card text-card-foreground border-border flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <GiftIcon className="w-10 h-10 text-tertiary" />
                    <Badge className="bg-accent text-accent-foreground">
                      {voucher.pointsCost} pts
                    </Badge>
                  </div>

                  <h3 className="font-headline text-xl font-semibold text-foreground mb-2">
                    {voucher.name}
                  </h3>
                  <p className="text-muted-foreground mb-4 flex-grow">{voucher.description}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Expires: {voucher.expiryDate}
                  </p>

                  <Button
                    onClick={() => handleRedeem(voucher)}
                    disabled={!canRedeem}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    {canRedeem ? 'Redeem' : 'Not Enough Points'}
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
