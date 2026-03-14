import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useLanguage } from '../hooks/useLanguage';
import { Moon, Sun, Globe, Coins, Crown, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/assets/generated/astrology-app-logo.dim_200x200.png" alt="Logo" className="h-10 w-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('appName')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/panchang"
              className="text-sm font-medium transition-colors hover:text-primary"
              activeProps={{ className: 'text-primary' }}
            >
              {t('panchang')}
            </Link>
            <Link
              to="/kundali"
              className="text-sm font-medium transition-colors hover:text-primary"
              activeProps={{ className: 'text-primary' }}
            >
              {t('kundali')}
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/coins"
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
                  activeProps={{ className: 'text-primary' }}
                >
                  <Coins className="h-4 w-4" />
                  {userProfile?.coinBalance?.toString() || '0'}
                </Link>
                <Link
                  to="/subscription"
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
                  activeProps={{ className: 'text-primary' }}
                >
                  {userProfile?.isPremium && <Crown className="h-4 w-4 text-amber-500" />}
                  {t('subscription')}
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleLanguage}>
              <Globe className="h-5 w-5" />
            </Button>
            {isAuthenticated && userProfile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    {userProfile.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate({ to: '/admin' })}>
                    {t('admin')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button onClick={handleAuth} disabled={disabled} variant={isAuthenticated ? 'outline' : 'default'}>
              {disabled ? t('loggingIn') : isAuthenticated ? t('logout') : t('login')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border/40">
            <Link
              to="/panchang"
              className="block text-sm font-medium transition-colors hover:text-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('panchang')}
            </Link>
            <Link
              to="/kundali"
              className="block text-sm font-medium transition-colors hover:text-primary py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('kundali')}
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/coins"
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Coins className="h-4 w-4" />
                  {t('coins')}: {userProfile?.coinBalance?.toString() || '0'}
                </Link>
                <Link
                  to="/subscription"
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {userProfile?.isPremium && <Crown className="h-4 w-4 text-amber-500" />}
                  {t('subscription')}
                </Link>
                <Link
                  to="/admin"
                  className="block text-sm font-medium transition-colors hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('admin')}
                </Link>
              </>
            )}
            <div className="flex items-center gap-2 pt-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleLanguage}>
                <Globe className="h-5 w-5" />
              </Button>
              <Button onClick={handleAuth} disabled={disabled} variant={isAuthenticated ? 'outline' : 'default'} className="flex-1">
                {disabled ? t('loggingIn') : isAuthenticated ? t('logout') : t('login')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
