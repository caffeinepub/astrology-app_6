import { useState } from 'react';
import { useGetAllPanchang } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '../hooks/useLanguage';
import { Calendar, Sunrise, Sunset, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PanchangPage() {
  const { data: panchangData, isLoading } = useGetAllPanchang();
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const todayPanchang = panchangData?.find((p) => p.date === selectedDate);

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <img
            src="/assets/generated/panchang-icon-transparent.dim_64x64.png"
            alt="Panchang"
            className="h-16 w-16"
          />
        </div>
        <h1 className="text-4xl font-bold">{t('panchangTitle')}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t('panchangDescription')}</p>
      </div>

      <div className="max-w-md mx-auto">
        <Label htmlFor="date">{t('selectDate')}</Label>
        <Input
          id="date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mt-2"
        />
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : todayPanchang ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle>{t('tithi')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{todayPanchang.tithi}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" />
                <CardTitle>{t('nakshatra')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{todayPanchang.nakshatra}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sunrise className="h-5 w-5 text-chart-1" />
                <CardTitle>{t('sunrise')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{todayPanchang.sunrise}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sunset className="h-5 w-5 text-chart-2" />
                <CardTitle>{t('sunset')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{todayPanchang.sunset}</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('yoga')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">{todayPanchang.yoga}</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{t('karana')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">{todayPanchang.karana}</p>
            </CardContent>
          </Card>

          {todayPanchang.festivals.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t('festivals')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {todayPanchang.festivals.map((festival, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span>{festival}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t('noPanchangData')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
