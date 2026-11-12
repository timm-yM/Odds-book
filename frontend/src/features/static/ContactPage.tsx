import { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Wire this up to a real endpoint or email service when you're ready to go live.
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thanks — we'll get back to you shortly.");
      (e.target as HTMLFormElement).reset();
    }, 600);
  };

  return (
    <div className="container max-w-lg py-16">
      <div className="mb-8 text-center">
        <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/15 text-primary">
          <Mail size={18} />
        </span>
        <h1 className="text-2xl font-bold">Get in touch</h1>
        <p className="mt-1 text-sm text-muted-foreground">Questions about buying, selling, or a pick you purchased? Send us a note.</p>
      </div>

      <form onSubmit={handleSubmit} className="surface-card flex flex-col gap-4 p-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required className="mt-1.5" />
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" required rows={5} className="mt-1.5" />
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send message'}
        </Button>
      </form>
    </div>
  );
}
