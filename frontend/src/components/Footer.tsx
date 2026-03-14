import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>© 2025. Built with</span>
          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
          <span>using</span>
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
