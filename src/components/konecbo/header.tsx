import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 lg:px-8 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="Konecbo Home">
          <Image
            src="/logo.png"
            alt="Konecbo Logo"
            width={120}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <nav className="hidden md:flex gap-4">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
          <a href="#waitlist" className="text-sm font-medium hover:text-primary transition-colors">Waitlist</a>
        </nav>
      </div>
    </header>
  );
}
