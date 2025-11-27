'use client';

import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { joinWaitlist, type WaitlistState } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RegistrationCount } from './registration-count';
import { Loader2 } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
      disabled={pending}
    >
      {pending ? <Loader2 className="animate-spin mr-2" /> : null}
      Join the Waitlist
    </Button>
  );
}

export function WaitlistForm() {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const initialState: WaitlistState = {
    message: '',
    status: 'idle',
    errors: null,
  };
  const [state, formAction] = useActionState(joinWaitlist, initialState);

  useEffect(() => {
    if (state.status === 'success') {
      toast({
        title: 'Success!',
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state.status === 'error' && !state.errors) {
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card className="w-full max-w-md shadow-2xl bg-card">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl">Get Early Access</CardTitle>
        <CardDescription>
          Join <RegistrationCount /> other researchers and be the first to know
          when Konecbo launches.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <Input id="name" name="name" placeholder="John Doe" required />
            {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email Address</label>
            <Input id="email" name="email" type="email" placeholder="John.doe@example.com" required />
            {state.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email[0]}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="researchInterests" className="text-sm font-medium">Research Interests</label>
            <Textarea
              id="researchInterests"
              name="researchInterests"
              placeholder="e.g., Computational biology, social sciences, machine learning, psychology..."
              required
            />
             {state.errors?.researchInterests && <p className="text-sm font-medium text-destructive">{state.errors.researchInterests[0]}</p>}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
