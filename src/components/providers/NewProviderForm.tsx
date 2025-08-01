
"use client";

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { submitProviderAction, type ProviderFormState } from '@/actions/providers';
import { SPECIALTIES, LOCATIONS, LANGUAGES_SPOKEN } from '@/lib/constants';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import type { Provider } from '@/lib/types';

interface NewProviderFormProps {
  existingProvider?: Provider;
}

const initialState: ProviderFormState = {
  message: '',
  success: false,
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isEditing ? 'Update Doctor' : 'Add Doctor'}
    </Button>
  );
}

export function NewProviderForm({ existingProvider }: NewProviderFormProps) {
  const isEditing = !!existingProvider;
  const [state, formAction] = useActionState(submitProviderAction, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        if (state.newProviderId) {
          router.push(`/providers/${state.newProviderId}`);
        } else {
            router.push('/providers');
        }
      } else {
        toast({
          title: state.issues ? 'Validation Error' : 'Error',
          description: state.issues ? state.issues.join('\n') : state.message,
          variant: 'destructive',
        });
      }
    }
  }, [state, toast, router]);

  const getErrorForField = (fieldName: string) => {
    if (!state.issues || !state.fields) return undefined;
    const fieldIssue = state.issues.find(issue => issue.startsWith(`${fieldName}:`));
    return fieldIssue ? fieldIssue.substring(fieldName.length + 1) : undefined;
  };
  
  if (!user) {
    return <p>You must be logged in to perform this action.</p>;
  }

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={existingProvider.id} />}
      <input type="hidden" name="submittedByUserId" value={user.id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" placeholder="e.g., Dr. Almaz Tesfaye" defaultValue={existingProvider?.name} required />
          {getErrorForField('name') && <p className="text-sm text-destructive">{getErrorForField('name')}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="specialty">Specialty</Label>
          <Select name="specialty" required defaultValue={existingProvider?.specialty}>
            <SelectTrigger><SelectValue placeholder="Select a specialty" /></SelectTrigger>
            <SelectContent>
              {SPECIALTIES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {getErrorForField('specialty') && <p className="text-sm text-destructive">{getErrorForField('specialty')}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select name="location" required defaultValue={existingProvider?.location}>
          <SelectTrigger><SelectValue placeholder="Select a location" /></SelectTrigger>
          <SelectContent>
            {LOCATIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>
        {getErrorForField('location') && <p className="text-sm text-destructive">{getErrorForField('location')}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Phone Number (Optional)</Label>
          <Input id="contactPhone" name="contactPhone" placeholder="+251 91 234 5678" defaultValue={existingProvider?.contact.phone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email Address (Optional)</Label>
          <Input id="contactEmail" name="contactEmail" type="email" placeholder="doctor@example.com" defaultValue={existingProvider?.contact.email} />
          {getErrorForField('contactEmail') && <p className="text-sm text-destructive">{getErrorForField('contactEmail')}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contactAddress">Practice Address (Optional)</Label>
        <Input id="contactAddress" name="contactAddress" placeholder="Bole Medhanialem, Addis Ababa" defaultValue={existingProvider?.contact.address} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biography (Optional)</Label>
        <Textarea id="bio" name="bio" placeholder="A brief bio about the doctor..." rows={4} defaultValue={existingProvider?.bio} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="qualifications">Qualifications (Optional, comma-separated)</Label>
        <Input id="qualifications" name="qualifications" placeholder="MD, Cardiology Fellowship" defaultValue={existingProvider?.qualifications?.join(', ')} />
      </div>

      <div className="space-y-3">
        <Label>Languages Spoken (Optional)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md">
          {LANGUAGES_SPOKEN.map(lang => (
            <div key={lang.value} className="flex items-center space-x-2">
              <Checkbox id={`lang-${lang.value}`} name="languages" value={lang.label} defaultChecked={existingProvider?.languagesSpoken?.includes(lang.label)} />
              <Label htmlFor={`lang-${lang.value}`} className="font-normal">{lang.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <SubmitButton isEditing={isEditing} />
    </form>
  );
}
