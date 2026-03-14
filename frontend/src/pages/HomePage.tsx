import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '../hooks/useLanguage';
import { Calendar, Star, Coins, Crown, Gift } from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="flex justify-center">
          <img
            src="/assets/generated/zodiac-wheel.dim_400x400.png"
            alt="Zodiac Wheel"
            className="w-64 h-64 object-contain animate-pulse"
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          {t('heroTitle')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('heroDescription')}</p>
        
        <Alert className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <Gift className="h-5 w-5 text-primary" />
          <AlertDescription className="ml-2">
            <span className="font-semibold text-lg">{t('heroFreeTrial')}</span>
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/panchang">{t('explorePanchang')}</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/kundali">{t('generateKundali')}</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{t('panchangFeature')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>{t('panchangFeatureDesc')}</CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>{t('kundaliFeature')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>{t('kundaliFeatureDesc')}</CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-1/10">
                <Coins className="h-6 w-6 text-chart-1" />
              </div>
              <CardTitle>{t('coinsFeature')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>{t('coinsFeatureDesc')}</CardDescription>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Crown className="h-6 w-6 text-amber-500" />
              </div>
              <CardTitle>{t('premiumFeature')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>{t('premiumFeatureDesc')}</CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl">
        <h2 className="text-3xl font-bold">{t('ctaTitle')}</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">{t('ctaDescription')}</p>
        <Button asChild size="lg">
          <Link to="/subscription">{t('subscribeCta')}</Link>
        </Button>
      </section>
    </div>
  );
}
