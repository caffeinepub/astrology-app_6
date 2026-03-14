import { Outlet } from '@tanstack/react-router';
import Header from './Header';
import Footer from './Footer';
import ProfileSetupModal from './ProfileSetupModal';
import StripeSetupModal from './StripeSetupModal';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      <ProfileSetupModal />
      <StripeSetupModal />
    </div>
  );
}
