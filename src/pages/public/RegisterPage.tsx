import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone,setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await register(name,phone, email, password);
      toast({
        title: 'Success',
        description: 'Tao tai khoan thanh cong , vui long dang nhap',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Registration failed. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - LoyaltyHub</title>
        <meta name="description" content="Create your LoyaltyHub account" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center py-24 px-4 bg-background">
        <Card className="w-full max-w-md p-8 bg-card text-card-foreground border-border">
          <h1 className="font-headline text-3xl font-bold text-foreground mb-2 text-center">
            Create Account
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Join LoyaltyHub and start earning rewards
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-2 bg-background text-foreground border-border"
              />
            </div>
            <div>
              <Label htmlFor='phone' className='text-foreground'>Phone</Label>
              <Input
                id='phone'
                type='tel'
                value={phone}
                onChange={(e)=> setPhone(e.target.value)}
                required
                className='bt-2 bg-background text-foreground border-border'
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <div>
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-2 bg-background text-foreground border-border"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
};

export default RegisterPage;
