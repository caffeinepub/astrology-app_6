import { useState, useEffect } from 'react';
import { useIsStripeConfigured, useSetStripeConfiguration, useIsCallerAdmin } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '../hooks/useLanguage';
import type { StripeConfiguration } from '../backend';

export default function StripeSetupModal() {
  const { data: isConfigured, isLoading: configLoading } = useIsStripeConfigured();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const setConfig = useSetStripeConfiguration();
  const { t } = useLanguage();

  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('IN,US,GB,CA');

  const showSetup = !configLoading && !adminLoading && isAdmin && !isConfigured;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secretKey) return;

    const config: StripeConfiguration = {
      secretKey,
      allowedCountries: countries.split(',').map((c) => c.trim()),
    };

    await setConfig.mutateAsync(config);
  };

  return (
    <Dialog open={showSetup}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('stripeSetupTitle')}</DialogTitle>
          <DialogDescription>{t('stripeSetupDescription')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secretKey">{t('stripeSecretKey')}</Label>
            <Input
              id="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_test_..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="countries">{t('allowedCountries')}</Label>
            <Input
              id="countries"
              value={countries}
              onChange={(e) => setCountries(e.target.value)}
              placeholder="IN,US,GB,CA"
              required
            />
            <p className="text-xs text-muted-foreground">{t('countriesHelp')}</p>
          </div>
          <Button type="submit" className="w-full" disabled={setConfig.isPending}>
            {setConfig.isPending ? t('saving') : t('saveConfiguration')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
