import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUpdateSubscriptionStatus } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../hooks/useLanguage';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const updateSubscription = useUpdateSubscriptionStatus();
  const { t } = useLanguage();

  useEffect(() => {
    updateSubscription.mutate(true);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">{t('paymentSuccess')}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{t('paymentSuccessDesc')}</p>
          <Button onClick={() => navigate({ to: '/' })} className="w-full">
            {t('backToHome')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
