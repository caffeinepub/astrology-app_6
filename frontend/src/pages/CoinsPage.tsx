import { useState } from 'react';
import { useGetCallerUserProfile, useUpdateCoinBalance } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../hooks/useLanguage';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Coins, Lock } from 'lucide-react';

export default function CoinsPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const updateCoins = useUpdateCoinBalance();
  const { t } = useLanguage();

  const isAuthenticated = !!identity;
  const coinBalance = userProfile?.coinBalance?.toString() || '0';

  const coinPackages = [
    { amount: 100, price: '₹50' },
    { amount: 250, price: '₹100' },
    { amount: 500, price: '₹180' },
    { amount: 1000, price: '₹300' },
  ];

  const handlePurchase = async (amount: number) => {
    await updateCoins.mutateAsync(BigInt(amount));
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
            src="/assets/generated/coin-icon-transparent.dim_64x64.png"
            alt="Coins"
            className="h-16 w-16"
          />
        </div>
        <h1 className="text-4xl font-bold">{t('coinsTitle')}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t('coinsDescription')}</p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{t('yourBalance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 text-4xl font-bold">
            <Coins className="h-10 w-10 text-amber-500" />
            <span>{coinBalance}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coinPackages.map((pkg) => (
          <Card key={pkg.amount} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-amber-500" />
                {pkg.amount} {t('coins')}
              </CardTitle>
              <CardDescription className="text-2xl font-bold">{pkg.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => handlePurchase(pkg.amount)}
                disabled={updateCoins.isPending}
              >
                {updateCoins.isPending ? t('purchasing') : t('purchase')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
