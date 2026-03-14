import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../hooks/useLanguage';
import { XCircle } from 'lucide-react';

export default function PaymentFailure() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-2xl">{t('paymentFailed')}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{t('paymentFailedDesc')}</p>
          <div className="flex gap-3">
            <Button onClick={() => navigate({ to: '/subscription' })} variant="outline" className="flex-1">
              {t('tryAgain')}
            </Button>
            <Button onClick={() => navigate({ to: '/' })} className="flex-1">
              {t('backToHome')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
