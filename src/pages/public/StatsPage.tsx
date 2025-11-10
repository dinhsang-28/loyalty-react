import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Card } from '../../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUpIcon, MousePointerClickIcon, ShoppingCartIcon } from 'lucide-react';

interface Stats {
  clicks: number;
  orders: number;
  commission: number;
  chartData: Array<{ month: string; orders: number }>;
}

const StatsPage = () => {
  const { referral_code } = useParams();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`/api/stats/${referral_code}`);
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [referral_code]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground text-lg">Loading stats...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground text-lg">Stats not found</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Affiliate Stats - {referral_code} - LoyaltyHub</title>
        <meta name="description" content={`View public statistics for affiliate ${referral_code}`} />
      </Helmet>

      <div className="min-h-screen py-24 px-4 lg:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h1 className="font-headline text-3xl lg:text-4xl font-bold text-foreground mb-8">
            Affiliate Stats: {referral_code}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-card text-card-foreground border-border">
              <div className="flex items-center gap-4">
                <MousePointerClickIcon className="w-10 h-10 text-primary" />
                <div>
                  <p className="text-muted-foreground text-sm">Total Clicks</p>
                  <p className="font-headline text-2xl font-bold text-foreground">{stats.clicks}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card text-card-foreground border-border">
              <div className="flex items-center gap-4">
                <ShoppingCartIcon className="w-10 h-10 text-tertiary" />
                <div>
                  <p className="text-muted-foreground text-sm">Total Orders</p>
                  <p className="font-headline text-2xl font-bold text-foreground">{stats.orders}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card text-card-foreground border-border">
              <div className="flex items-center gap-4">
                <TrendingUpIcon className="w-10 h-10 text-accent" />
                <div>
                  <p className="text-muted-foreground text-sm">Total Commission</p>
                  <p className="font-headline text-2xl font-bold text-foreground">
                    ${stats.commission.toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-card text-card-foreground border-border">
            <h2 className="font-headline text-xl font-semibold text-foreground mb-6">
              Orders Over Time
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="hsl(205, 80%, 52%)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </>
  );
};

export default StatsPage;
