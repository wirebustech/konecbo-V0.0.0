import { CountdownTimer } from './countdown-timer';
import { WaitlistForm } from './waitlist-form';

export default function Hero() {
  return (
    <section id="waitlist" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-primary">
              Connecting Researchers.
              <br />
              <span className="text-foreground">Accelerating Trusted</span>
              <p className="text-foreground"> Co-Creation.</p>
            </h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Konecbo is a secure platform for researchers to connect, collaborate,
              and ensure ideas are protected and contributions recognised.
              Join our waitlist to be the first to know when we launch...
            </p>
            <CountdownTimer />
          </div>
          <div className="flex items-center justify-center">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}
