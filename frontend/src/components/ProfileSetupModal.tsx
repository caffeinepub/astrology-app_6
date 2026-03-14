import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useRegisterUser } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '../hooks/useLanguage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gift } from 'lucide-react';
import type { UserProfile } from '../backend';

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const registerUser = useRegisterUser();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [languagePreference, setLanguagePreference] = useState('en');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthDate || !birthTime || !birthPlace) return;

    const profile: UserProfile = {
      name,
      birthDate,
      birthTime,
      birthPlace,
      languagePreference,
      isPremium: true,
      coinBalance: BigInt(0),
      registrationTime: BigInt(0),
      freeTrialEnd: BigInt(0),
    };

    await registerUser.mutateAsync(profile);
  };

  return (
    <Dialog open={showProfileSetup}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{t('welcomeTitle')}</DialogTitle>
          <DialogDescription>{t('welcomeDescription')}</DialogDescription>
        </DialogHeader>

        <Alert className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <Gift className="h-5 w-5 text-primary" />
          <AlertDescription className="ml-2">
            <span className="font-semibold">{t('freeTrialWelcome')}</span>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('enterName')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">{t('birthDate')}</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthTime">{t('birthTime')}</Label>
            <Input
              id="birthTime"
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthPlace">{t('birthPlace')}</Label>
            <Input
              id="birthPlace"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder={t('enterBirthPlace')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">{t('preferredLanguage')}</Label>
            <Select value={languagePreference} onValueChange={setLanguagePreference}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={registerUser.isPending}>
            {registerUser.isPending ? t('saving') : t('continue')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
