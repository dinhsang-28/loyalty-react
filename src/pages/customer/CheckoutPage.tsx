import { useState } from 'react';
import { useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../hooks/use-toast';
import axios from 'axios';

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/orders', formData);
      toast({
        title: 'Success',
        description: 'Order placed successfully!',
      });
      setFormData({
        fullName: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        notes: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to place order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 lg:px-8 bg-background">
      <div className="container mx-auto max-w-3xl">
        <h1 className="font-headline text-3xl lg:text-4xl font-bold text-foreground mb-8">
          Checkout
        </h1>

        <Card className="p-8 bg-card text-card-foreground border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName" className="text-foreground">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-foreground">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-2 bg-background text-foreground border-border"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="city" className="text-foreground">
                  City
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>

              <div>
                <Label htmlFor="postalCode" className="text-foreground">
                  Postal Code
                </Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>

              <div>
                <Label htmlFor="country" className="text-foreground">
                  Country
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="mt-2 bg-background text-foreground border-border"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-foreground">
                Order Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="mt-2 bg-background text-foreground border-border"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? 'Processing...' : 'Place Order'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
