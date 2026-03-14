import { useState } from 'react';
import { useIsCallerAdmin, useAddPanchang } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '../hooks/useLanguage';
import { Shield, Lock } from 'lucide-react';
import type { Panchang } from '../backend';

export default function AdminPage() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();
  const addPanchang = useAddPanchang();
  const { t } = useLanguage();

  const [date, setDate] = useState('');
  const [tithi, setTithi] = useState('');
  const [nakshatra, setNakshatra] = useState('');
  const [yoga, setYoga] = useState('');
  const [karana, setKarana] = useState('');
  const [sunrise, setSunrise] = useState('');
  const [sunset, setSunset] = useState('');
  const [festivals, setFestivals] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const panchang: Panchang = {
      date,
      tithi,
      nakshatra,
      yoga,
      karana,
      sunrise,
      sunset,
      festivals: festivals.split(',').map((f) => f.trim()).filter(Boolean),
    };

    await addPanchang.mutateAsync(panchang);

    setDate('');
    setTithi('');
    setNakshatra('');
    setYoga('');
    setKarana('');
    setSunrise('');
    setSunset('');
    setFestivals('');
  };

  if (isLoading) {
    return <div className="text-center py-12">{t('loading')}</div>;
  }

  if (!isAdmin) {
    return (
      <div className="text-center space-y-6 py-12">
        <Lock className="h-16 w-16 mx-auto text-muted-foreground" />
        <h2 className="text-2xl font-bold">{t('accessDenied')}</h2>
        <p className="text-muted-foreground">{t('adminOnly')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <Shield className="h-16 w-16 mx-auto text-primary" />
        <h1 className="text-4xl font-bold">{t('adminPanel')}</h1>
        <p className="text-muted-foreground">{t('adminDescription')}</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('addPanchang')}</CardTitle>
          <CardDescription>{t('addPanchangDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="date">{t('date')}</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tithi">{t('tithi')}</Label>
                <Input
                  id="tithi"
                  value={tithi}
                  onChange={(e) => setTithi(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nakshatra">{t('nakshatra')}</Label>
                <Input
                  id="nakshatra"
                  value={nakshatra}
                  onChange={(e) => setNakshatra(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yoga">{t('yoga')}</Label>
                <Input
                  id="yoga"
                  value={yoga}
                  onChange={(e) => setYoga(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="karana">{t('karana')}</Label>
                <Input
                  id="karana"
                  value={karana}
                  onChange={(e) => setKarana(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sunrise">{t('sunrise')}</Label>
                <Input
                  id="sunrise"
                  type="time"
                  value={sunrise}
                  onChange={(e) => setSunrise(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sunset">{t('sunset')}</Label>
                <Input
                  id="sunset"
                  type="time"
                  value={sunset}
                  onChange={(e) => setSunset(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="festivals">{t('festivals')}</Label>
              <Textarea
                id="festivals"
                value={festivals}
                onChange={(e) => setFestivals(e.target.value)}
                placeholder={t('festivalsPlaceholder')}
              />
            </div>
            <Button type="submit" className="w-full" disabled={addPanchang.isPending}>
              {addPanchang.isPending ? t('adding') : t('addPanchang')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
