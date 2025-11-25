import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(phone, password);
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      // navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid phone or password',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - LoyaltyHub</title>
        <meta name="description" content="Sign in to your LoyaltyHub account" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-24 px-4 bg-background">
        <Card className="w-full max-w-md p-8 bg-card text-card-foreground border-border">
          <h1 className="font-headline text-3xl font-bold text-foreground mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-center mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="phone" className="text-foreground">
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-2 bg-background text-foreground border-border"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 bg-background text-foreground border-border"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Don't have an account?{' '}
            {/* <Link to="/register" className="text-primary hover:underline">
              Register
            </Link> */}
          </p>
        </Card>
      </div>
    </>
  );
};

export default LoginPage;
