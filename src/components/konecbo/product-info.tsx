import { Users, FlaskConical, Lightbulb } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

const features = [
  {
    icon: <Users className="h-10 w-10 text-accent" />,
    title: 'Connect with Peers',
    description:
      'Find and connect with early career researchers and professionals who share your interests from around the globe.',
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-accent" />,
    title: 'Spark New Ideas',
    description:
      'Connect with the right research teams and create discoveries together.',
  },
  {
    icon: <FlaskConical className="h-10 w-10 text-accent" />,
    title: 'Showcase Your Work',
    description:
      'Share your ongoing research, pre-prints, and published papers to get feedback and citations.',
  },
  
];

export default function ProductInfo() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl text-primary">
              A New Era of Research Collaboration
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Konecbo is designed to break down silos and
              help you focus on what matters most: insights and discovery.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-12 lg:max-w-none mt-12">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1"
            >
              <CardHeader>
                {feature.icon}
                <CardTitle className="font-headline mt-4">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
