import { useGetCallerUserProfile, useCreateCheckoutSession, useIsFreeTrialActive } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '../hooks/useLanguage';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Crown, Check, Lock, Gift, Clock } from 'lucide-react';
import type { ShoppingItem } from '../backend';

export default function SubscriptionPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: isFreeTrialActive } = useIsFreeTrialActive();
  const createCheckout = useCreateCheckoutSession();
  const { t } = useLanguage();

  const isAuthenticated = !!identity;
  const isPremium = userProfile?.isPremium || false;
  const hasFreeTrial = isFreeTrialActive || false;

  const handleSubscribe = async () => {
    const items: ShoppingItem[] = [
      {
        productName: 'Premium Monthly Subscription',
        productDescription: 'Access to all premium astrology features',
        priceInCents: BigInt(3000),
        currency: 'INR',
        quantity: BigInt(1),
      },
    ];

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const successUrl = `${baseUrl}/payment-success`;
    const cancelUrl = `${baseUrl}/payment-failure`;

    const result = await createCheckout.mutateAsync({ items, successUrl, cancelUrl });
    const session = JSON.parse(result);
    window.location.href = session.url;
  };

  const calculateDaysRemaining = () => {
    if (!userProfile?.freeTrialEnd) return 0;
    const now = Date.now() * 1000000;
    const trialEnd = Number(userProfile.freeTrialEnd);
    const daysRemaining = Math.ceil((trialEnd - now) / (24 * 60 * 60 * 1000000000));
    return Math.max(0, daysRemaining);
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center space-y-6 py-12">
        <Lock className="h-16 w-16 mx-auto text-muted-foreground" />
        <h2 className="text-2xl font-bold">{t('loginRequired')}</h2>
        <p className="text-muted-foreground">{t('loginRequiredDesc')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <img
            src="/assets/generated/premium-badge-transparent.dim_100x100.png"
            alt="Premium"
            className="h-24 w-24"
          />
        </div>
        <h1 className="text-4xl font-bold">{t('subscriptionTitle')}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t('subscriptionDescription')}</p>
      </div>

      {hasFreeTrial && (
        <Alert className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <Gift className="h-5 w-5 text-primary" />
          <AlertDescription className="ml-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{t('freeTrialActive')}</span>
              <span className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4" />
                {t('daysRemaining', { days: calculateDaysRemaining() })}
              </span>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Crown className="h-12 w-12 text-amber-500" />
          </div>
          <CardTitle className="text-3xl">{t('premiumPlan')}</CardTitle>
          <CardDescription className="text-2xl font-bold mt-2">
            {hasFreeTrial ? (
              <span className="flex flex-col items-center gap-1">
                <span className="line-through text-muted-foreground text-lg">₹30 / {t('month')}</span>
                <span className="text-primary">{t('freeFirstMonth')}</span>
              </span>
            ) : (
              <span>₹30 / {t('month')}</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-3">
            {[
              t('feature1'),
              t('feature2'),
              t('feature3'),
              t('feature4'),
              t('feature5'),
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {isPremium && !hasFreeTrial ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-full">
                <Crown className="h-5 w-5" />
                <span className="font-semibold">{t('activePremium')}</span>
              </div>
            </div>
          ) : hasFreeTrial ? (
            <div className="space-y-3">
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full">
                  <Gift className="h-5 w-5" />
                  <span className="font-semibold">{t('enjoyingFreeTrial')}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {t('freeTrialInfo')}
              </p>
            </div>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={handleSubscribe}
              disabled={createCheckout.isPending}
            >
              {createCheckout.isPending ? t('processing') : t('subscribe')}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
