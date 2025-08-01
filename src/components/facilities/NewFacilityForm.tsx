
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
import { useAuth } from '@/context/AuthContext';
import type { Facility } from '@/lib/types';

interface NewFacilityFormProps {
  existingFacility?: Facility;
}

const initialState: FacilityFormState = {
  message: '',
  success: false,
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isEditing ? 'Update Facility' : 'Add Facility'}
    </Button>
  );
}

const DUMMY_SERVICES = ['Emergency Care', 'Surgery', 'Radiology', 'Cardiology', 'Pediatrics'];
const DUMMY_AMENITIES = ['Parking', 'Wi-Fi', 'Cafeteria', 'Pharmacy On-site', 'Wheelchair Accessible'];

export function NewFacilityForm({ existingFacility }: NewFacilityFormProps) {
  const isEditing = !!existingFacility;
  const [state, formAction] = useActionState(submitFacilityAction, initialState);
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
  
  if (!user) {
    // This should ideally be handled by the parent page component with a redirect.
    return <p>You must be logged in to perform this action.</p>;
  }

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && <input type="hidden" name="id" value={existingFacility.id} />}
      <input type="hidden" name="submittedByUserId" value={user.id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Facility Name</Label>
          <Input id="name" name="name" placeholder="e.g., St. Paulos Hospital" defaultValue={existingFacility?.name} required />
          {getErrorForField('name') && <p className="text-sm text-destructive">{getErrorForField('name')}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Facility Type</Label>
          <Select name="type" required defaultValue={existingFacility?.type}>
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
        <Select name="location" required defaultValue={existingFacility?.location}>
          <SelectTrigger><SelectValue placeholder="Select a location" /></SelectTrigger>
          <SelectContent>
            {LOCATIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
          </SelectContent>
        </Select>
        {getErrorForField('location') && <p className="text-sm text-destructive">{getErrorForField('location')}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactAddress">Address</Label>
        <Input id="contactAddress" name="contactAddress" placeholder="e.g., Gulele Sub-city, Addis Ababa" defaultValue={existingFacility?.contact.address} required />
        {getErrorForField('contactAddress') && <p className="text-sm text-destructive">{getErrorForField('contactAddress')}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Phone Number (Optional)</Label>
          <Input id="contactPhone" name="contactPhone" placeholder="+251 11 123 4567" defaultValue={existingFacility?.contact.phone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email Address (Optional)</Label>
          <Input id="contactEmail" name="contactEmail" type="email" placeholder="contact@facility.com" defaultValue={existingFacility?.contact.email} />
          {getErrorForField('contactEmail') && <p className="text-sm text-destructive">{getErrorForField('contactEmail')}</p>}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea id="description" name="description" placeholder="A brief description of the facility..." rows={4} defaultValue={existingFacility?.description} />
      </div>

      <div className="space-y-3">
        <Label>Services Offered (Optional)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md">
          {DUMMY_SERVICES.map(service => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox id={`service-${service}`} name="servicesOffered" value={service} defaultChecked={existingFacility?.servicesOffered?.includes(service)} />
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
              <Checkbox id={`amenity-${amenity}`} name="amenities" value={amenity} defaultChecked={existingFacility?.amenities?.includes(amenity)} />
              <Label htmlFor={`amenity-${amenity}`} className="font-normal">{amenity}</Label>
            </div>
          ))}
        </div>
      </div>

      <SubmitButton isEditing={isEditing} />
    </form>
  );
}
