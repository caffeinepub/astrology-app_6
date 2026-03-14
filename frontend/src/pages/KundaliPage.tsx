import { useState } from 'react';
import { useGetKundali, useSaveKundali, useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '../hooks/useLanguage';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Star, Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AIChatWidget from '../components/AIChatWidget';
import type { Kundali } from '../backend';

export default function KundaliPage() {
  const { identity } = useInternetIdentity();
  const { data: kundali, isLoading } = useGetKundali();
  const { data: userProfile } = useGetCallerUserProfile();
  const saveKundali = useSaveKundali();
  const { t } = useLanguage();

  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');

  const isAuthenticated = !!identity;
  const isPremium = userProfile?.isPremium || false;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate || !birthTime || !birthPlace || !identity) return;

    const newKundali: Kundali = {
      userId: identity.getPrincipal(),
      birthDetails: {
        date: birthDate,
        time: birthTime,
        place: birthPlace,
      },
      planetaryPositions: generatePlanetaryPositions(),
      houses: generateHouses(),
      generatedAt: BigInt(Date.now() * 1000000),
    };

    await saveKundali.mutateAsync(newKundali);
  };

  const generatePlanetaryPositions = () => {
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return planets.map((planet) => `${planet}: ${signs[Math.floor(Math.random() * signs.length)]}`).join(', ');
  };

  const generateHouses = () => {
    const houses = Array.from({ length: 12 }, (_, i) => `House ${i + 1}: ${Math.floor(Math.random() * 360)}°`);
    return houses.join(', ');
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
            src="/assets/generated/kundali-template.dim_300x300.png"
            alt="Kundali"
            className="h-24 w-24"
          />
        </div>
        <h1 className="text-4xl font-bold">{t('kundaliTitle')}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t('kundaliDescription')}</p>
      </div>

      {!isPremium && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>{t('premiumRequired')}</AlertDescription>
        </Alert>
      )}

      {!kundali && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{t('generateKundali')}</CardTitle>
            <CardDescription>{t('enterBirthDetails')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={saveKundali.isPending || !isPremium}>
                {saveKundali.isPending ? t('generating') : t('generateKundali')}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : kundali ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('birthDetails')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>{t('date')}:</strong> {kundali.birthDetails.date}</p>
              <p><strong>{t('time')}:</strong> {kundali.birthDetails.time}</p>
              <p><strong>{t('place')}:</strong> {kundali.birthDetails.place}</p>
            </CardContent>
          </Card>

          {isPremium && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{t('planetaryPositions')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{kundali.planetaryPositions}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('houses')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{kundali.houses}</p>
                </CardContent>
              </Card>

              <AIChatWidget kundali={kundali} />
            </>
          )}

          {!isPremium && (
            <Card>
              <CardContent className="py-12 text-center space-y-4">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">{t('upgradeForDetails')}</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : null}
    </div>
  );
}
