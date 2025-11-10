import { useState } from 'react';
import { useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';

const AdminLoyaltyUseCode = () => {
  const [code, setCode] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/admin/loyalty/use-code', { code, userId });
      toast({ title: 'Success', description: 'Code redeemed successfully' });
      setCode('');
      setUserId('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to redeem code', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-foreground mb-8">Redeem Code</h1>

      <Card className="p-8 bg-card text-card-foreground border-border max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="userId" className="text-foreground">
              User ID
            </Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              placeholder="Enter user ID"
              className="mt-2 bg-background text-foreground border-border"
            />
          </div>

          <div>
            <Label htmlFor="code" className="text-foreground">
              Voucher Code
            </Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="Enter voucher code"
              className="mt-2 bg-background text-foreground border-border"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? 'Redeeming...' : 'Redeem Code'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLoyaltyUseCode;
