
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
import { submitFacilityAction, type FacilityFormState } from '@/actions/facilities';
import { FACILITY_TYPES, LOCATIONS } from '@/lib/constants';
import { Loader2 } from 'lucide-react';

const initialState: FacilityFormState = {
  message: '',
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Add Facility
    </Button>
  );
}

const DUMMY_SERVICES = ['Emergency Care', 'Surgery', 'Radiology', 'Cardiology', 'Pediatrics'];
const DUMMY_AMENITIES = ['Parking', 'Wi-Fi', 'Cafeteria', 'Pharmacy On-site', 'Wheelchair Accessible'];

export function NewFacilityForm() {
  const [state, formAction] = useActionState(submitFacilityAction, initialState);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        if (state.newFacilityId) {
          router.push(`/facilities/${state.newFacilityId}`);
        } else {
            router.push('/facilities');
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

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Facility Name</Label>
          <Input id="name" name="name" placeholder="e.g., St. Paulos Hospital" required />
          {getErrorForField('name') && <p className="text-sm text-destructive">{getErrorForField('name')}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Facility Type</Label>
          <Select name="type" required>
            <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
            <SelectContent>
              {FACILITY_TYPES.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
            </SelectContent>
          </Select>
          {getErrorForField('type') && <p className="text-sm text-destructive">{getErrorForField('type')}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select name="location" required>
          <SelectTrigger><SelectValue placeholder="Select a location" /></SelectTrigger>
          <SelectContent>
            {LOCATIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>
        {getErrorForField('location') && <p className="text-sm text-destructive">{getErrorForField('location')}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactAddress">Address</Label>
        <Input id="contactAddress" name="contactAddress" placeholder="e.g., Gulele Sub-city, Addis Ababa" required />
        {getErrorForField('contactAddress') && <p className="text-sm text-destructive">{getErrorForField('contactAddress')}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Phone Number (Optional)</Label>
          <Input id="contactPhone" name="contactPhone" placeholder="+251 11 123 4567" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email Address (Optional)</Label>
          <Input id="contactEmail" name="contactEmail" type="email" placeholder="contact@facility.com" />
          {getErrorForField('contactEmail') && <p className="text-sm text-destructive">{getErrorForField('contactEmail')}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea id="description" name="description" placeholder="A brief description of the facility..." rows={4} />
      </div>

      <div className="space-y-3">
        <Label>Services Offered (Optional)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md">
          {DUMMY_SERVICES.map(service => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox id={`service-${service}`} name="servicesOffered" value={service} />
              <Label htmlFor={`service-${service}`} className="font-normal">{service}</Label>
            </div>
          ))}
        </div>
      </div>

       <div className="space-y-3">
        <Label>Amenities (Optional)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md">
          {DUMMY_AMENITIES.map(amenity => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox id={`amenity-${amenity}`} name="amenities" value={amenity} />
              <Label htmlFor={`amenity-${amenity}`} className="font-normal">{amenity}</Label>
            </div>
          ))}
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
