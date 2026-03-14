import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '../hooks/useLanguage';
import { useGetCallerUserProfile, useStartChatSession, useEndChatSession, useGetActiveChatSession, useGetRatePerMinute } from '../hooks/useQueries';
import { MessageCircle, Clock, Coins, AlertCircle, Send } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import type { Kundali } from '../backend';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatWidgetProps {
  kundali: Kundali | null;
}

export default function AIChatWidget({ kundali }: AIChatWidgetProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: activeSession } = useGetActiveChatSession();
  const { data: ratePerMinute } = useGetRatePerMinute();
  const startChat = useStartChatSession();
  const endChat = useEndChatSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const rate = Number(ratePerMinute || BigInt(5));
  const coinBalance = Number(userProfile?.coinBalance || BigInt(0));
  const hasEnoughCoins = coinBalance >= rate;
  const isSessionActive = activeSession?.isActive || false;

  useEffect(() => {
    if (isSessionActive && activeSession) {
      const startTime = Number(activeSession.startTime) / 1000000;
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 60000);
        setElapsedMinutes(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isSessionActive, activeSession]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartChat = async () => {
    if (!hasEnoughCoins) {
      toast.error(t('insufficientCoins'));
      return;
    }

    try {
      await startChat.mutateAsync();
      setMessages([
        {
          role: 'ai',
          content: `${t('chatWelcome')}\n\n${t('chatInstructions')}`,
          timestamp: new Date(),
        },
      ]);
      toast.success(t('chatActive'));
    } catch (error: any) {
      toast.error(error.message || 'Failed to start chat');
    }
  };

  const handleEndChat = async () => {
    try {
      await endChat.mutateAsync();
      const totalCost = elapsedMinutes * rate;
      toast.success(`${t('chatEnded')}. ${t('totalCost')}: ₹${totalCost}`);
      setMessages([]);
      setElapsedMinutes(0);
    } catch (error: any) {
      toast.error(error.message || 'Failed to end chat');
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    if (!kundali) {
      return 'Please generate your Kundali first to receive personalized predictions.';
    }

    const responses = [
      `Based on your planetary positions (${kundali.planetaryPositions.split(',')[0]}), I see strong influences in your life path.`,
      `Your birth chart shows interesting alignments. The houses (${kundali.houses.split(',')[0]}) indicate significant opportunities ahead.`,
      `Looking at your Kundali, the planetary positions suggest a favorable period for the matters you're asking about.`,
      `Your birth details reveal unique cosmic patterns. The alignment of planets indicates both challenges and growth opportunities.`,
      `According to your chart, the current planetary transits are creating positive energy around your question.`,
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isSessionActive) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsAiTyping(true);

    setTimeout(() => {
      const aiResponse: Message = {
        role: 'ai',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsAiTyping(false);
    }, 1500);
  };

  const estimatedCost = elapsedMinutes * rate;

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/ai-chat-icon-transparent.dim_64x64.png"
              alt="AI Chat"
              className="h-12 w-12"
            />
            <div>
              <CardTitle className="flex items-center gap-2">
                {t('aiChatTitle')}
                {isSessionActive && (
                  <Badge variant="default" className="animate-pulse">
                    {t('chatActive')}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{t('aiChatDescription')}</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{t('aiChatRate')}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Coins className="h-4 w-4" />
              {t('yourBalance')}: ₹{coinBalance}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {!hasEnoughCoins && !isSessionActive && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{t('insufficientCoins')}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate({ to: '/coins' })}
              >
                {t('purchaseCoins')}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isSessionActive && (
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/generated/chat-timer-icon-transparent.dim_32x32.png"
                  alt="Timer"
                  className="h-6 w-6"
                />
                <div>
                  <div className="text-sm font-medium">{t('elapsedTime')}</div>
                  <div className="text-lg font-bold">{t('minutes', { minutes: elapsedMinutes })}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-sm font-medium">{t('estimatedCost')}</div>
                  <div className="text-lg font-bold">₹{estimatedCost}</div>
                </div>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={handleEndChat}
              disabled={endChat.isPending}
            >
              {endChat.isPending ? t('processing') : t('endChat')}
            </Button>
          </div>
        )}

        {isSessionActive ? (
          <div className="space-y-4">
            <ScrollArea className="h-[400px] rounded-lg border p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">{t('aiTyping')}</p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('askQuestion')}
                disabled={isAiTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isAiTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-4">
            <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">{t('aiChatDescription')}</p>
            <Button
              onClick={handleStartChat}
              disabled={!hasEnoughCoins || startChat.isPending || !kundali}
              size="lg"
              className="w-full"
            >
              {startChat.isPending ? t('processing') : t('startChat')}
            </Button>
            {!kundali && (
              <p className="text-sm text-muted-foreground">
                {t('generateKundali')} first to use AI chat
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
