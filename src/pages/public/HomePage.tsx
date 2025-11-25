import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { AwardIcon, GiftIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>LoyaltyHub - Loyalty & Affiliate Management Platform</title>
        <meta
          name="description"
          content="Manage your loyalty programs and affiliate networks with ease. Track rewards, commissions, and grow your business."
        />
      </Helmet>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section
          className="relative py-32 px-4 lg:px-8 bg-gradient-1"
          style={{
            backgroundImage: 'url(https://c.animaapp.com/mhjz8vw5En6ose/img/ai_1.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-1 opacity-90"></div>
          <div className="container mx-auto text-purple-500 relative z-10 text-center">
            <h1 className="font-headline text-4xl lg:text-5xl font-bold text-purple-500 mb-6">
              Loyalty & Affiliate Management Made Simple
            </h1>
            <p className="text-xl text-purple-500/90 mb-8 max-w-2xl mx-auto">
              Reward your customers, empower your affiliates, and grow your business with our
              all-in-one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-500 hover:text-white">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-purple-700 hover:bg-purple-500 hover:text-white"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 lg:px-8 bg-background">
          <div className="container mx-auto">
            <h2 className="font-headline text-3xl lg:text-4xl font-bold text-foreground text-center mb-16">
              Everything You Need
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 bg-card text-card-foreground border-border">
                <AwardIcon className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-headline text-xl font-semibold text-foreground mb-3">
                  Loyalty Tiers
                </h3>
                <p className="text-muted-foreground">
                  Create custom loyalty tiers and reward your most valuable customers.
                </p>
              </Card>

              <Card className="p-6 bg-card text-card-foreground border-border">
                <GiftIcon className="w-12 h-12 text-tertiary mb-4" />
                <h3 className="font-headline text-xl font-semibold text-foreground mb-3">
                  Rewards & Vouchers
                </h3>
                <p className="text-muted-foreground">
                  Offer exclusive vouchers and rewards to keep customers engaged.
                </p>
              </Card>

              <Card className="p-6 bg-card text-card-foreground border-border">
                <TrendingUpIcon className="w-12 h-12 text-accent mb-4" />
                <h3 className="font-headline text-xl font-semibold text-foreground mb-3">
                  Affiliate Tracking
                </h3>
                <p className="text-muted-foreground">
                  Track referrals, clicks, and commissions with precision.
                </p>
              </Card>

              <Card className="p-6 bg-card text-card-foreground border-border">
                <UsersIcon className="w-12 h-12 text-secondary mb-4" />
                <h3 className="font-headline text-xl font-semibold text-foreground mb-3">
                  Member Management
                </h3>
                <p className="text-muted-foreground">
                  Manage all your members and affiliates from one dashboard.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 lg:px-8 bg-muted">
          <div className="container mx-auto text-center">
            <h2 className="font-headline text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using LoyaltyHub to grow their customer base and
              affiliate network.
            </p>
            {/* <Link to="/register">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Your Account
              </Button>
            </Link> */}
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
