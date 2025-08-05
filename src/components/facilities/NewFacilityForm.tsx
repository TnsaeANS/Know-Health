
"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  submitFacilityAction,
  type FacilityFormState,
} from "@/actions/facilities";
import { FACILITY_TYPES, LOCATIONS } from "@/lib/constants";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Facility } from "@/lib/types";
import { CldUploadWidget } from "next-cloudinary";
import { PageWrapper } from "../ui/PageWrapper";


interface NewFacilityFormProps {
  existingFacility?: Facility;
}

const initialState: FacilityFormState = {
  message: "",
  success: false,
};

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      disabled={pending}
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isEditing ? "Update Facility" : "Add Facility"}
    </Button>
  );
}

const DUMMY_SERVICES = [
  "Emergency Care",
  "Surgery",
  "Radiology",
  "Cardiology",
  "Pediatrics",
];
const DUMMY_AMENITIES = [
  "Parking",
  "Wi-Fi",
  "Cafeteria",
  "Pharmacy On-site",
  "Wheelchair Accessible",
];

export function NewFacilityForm({ existingFacility }: NewFacilityFormProps) {
  const isEditing = !!existingFacility;
  const [state, formAction] = useActionState(
    submitFacilityAction,
    initialState
  );
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [uploadedImage, setUploadedImage] = useState<string | null>(
    existingFacility?.imageUrl || null
  );

  useEffect(() => {
    if (!authLoading && !user) {
        router.push(isEditing ? `/login?redirect=/facilities/${existingFacility?.id}/edit` : '/login?redirect=/facilities/new');
    }
  }, [user, authLoading, router, isEditing, existingFacility?.id]);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: "Success!",
          description: state.message,
        });
        if (state.newFacilityId) {
          router.push(`/facilities/${state.newFacilityId}`);
        } else {
          router.push("/facilities");
        }
      } else {
        toast({
          title: state.issues ? "Validation Error" : "Error",
          description: state.issues ? state.issues.join("\n") : state.message,
          variant: "destructive",
        });
      }
    }
  }, [state, toast, router]);

  const getErrorForField = (fieldName: string) => {
    if (!state.issues || !state.fields) return undefined;
    const fieldIssue = state.issues.find((issue) =>
      issue.startsWith(`${fieldName}:`)
    );
    return fieldIssue ? fieldIssue.substring(fieldName.length + 1) : undefined;
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-4">You must be logged in to add a new facility.</p>
        <Button asChild><Link href="/login?redirect=/facilities/new">Login</Link></Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {isEditing && (
        <input type="hidden" name="id" value={existingFacility.id} />
      )}
      <input type="hidden" name="submittedByUserId" value={user.id} />
      <input type="hidden" name="imageUrl" value={uploadedImage || ""} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Facility Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., St. Paulos Hospital"
            defaultValue={existingFacility?.name}
            required
          />
          {getErrorForField("name") && (
            <p className="text-sm text-destructive">
              {getErrorForField("name")}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Facility Type</Label>
          <Select name="type" required defaultValue={existingFacility?.type}>
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {FACILITY_TYPES.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getErrorForField("type") && (
            <p className="text-sm text-destructive">
              {getErrorForField("type")}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Select
          name="location"
          required
          defaultValue={existingFacility?.location}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a location" />
          </SelectTrigger>
          <SelectContent>
            {LOCATIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {getErrorForField("location") && (
          <p className="text-sm text-destructive">
            {getErrorForField("location")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactAddress">Address</Label>
        <Input
          id="contactAddress"
          name="contactAddress"
          placeholder="e.g., Gulele Sub-city, Addis Ababa"
          defaultValue={existingFacility?.contact.address}
          required
        />
        {getErrorForField("contactAddress") && (
          <p className="text-sm text-destructive">
            {getErrorForField("contactAddress")}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Phone Number (Optional)</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            placeholder="+251 11 123 4567"
            defaultValue={existingFacility?.contact.phone}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email Address (Optional)</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            placeholder="contact@facility.com"
            defaultValue={existingFacility?.contact.email}
          />
          {getErrorForField("contactEmail") && (
            <p className="text-sm text-destructive">
              {getErrorForField("contactEmail")}
            </p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="A brief description of the facility..."
          rows={4}
          defaultValue={existingFacility?.description}
        />
      </div>

      <div className="space-y-2">
        <Label>Facility Image (Optional)</Label>
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "profile_uploads"}
          onSuccess={(result) => {
            if (
              result &&
              typeof result.info === "object" &&
              "secure_url" in result.info
            ) {
              const url = result.info.secure_url as string;
              setUploadedImage(url);
            }
          }}
        >
          {({ open }) => {
            return (
              <div
                className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary transition cursor-pointer"
                onClick={(e) => { e.preventDefault(); open(); }}
              >
                {uploadedImage ? (
                  <div>
                    <img
                      src={uploadedImage}
                      alt="Uploaded facility"
                      className="w-full h-auto object-cover rounded-md mx-auto shadow-md"
                    />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Click to replace
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
                      />
                    </svg>
                    <p className="mt-2 text-sm">
                      Click to upload facility image
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, or JPEG up to 5MB
                    </p>
                  </div>
                )}
              </div>
            );
          }}
        </CldUploadWidget>
      </div>

      <div className="space-y-3">
        <Label>Services Offered (Optional)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md">
          {DUMMY_SERVICES.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={`service-${service}`}
                name="servicesOffered"
                value={service}
                defaultChecked={existingFacility?.servicesOffered?.includes(
                  service
                )}
              />
              <Label htmlFor={`service-${service}`} className="font-normal">
                {service}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Amenities (Optional)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 border rounded-md">
          {DUMMY_AMENITIES.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity}`}
                name="amenities"
                value={amenity}
                defaultChecked={existingFacility?.amenities?.includes(amenity)}
              />
              <Label htmlFor={`amenity-${amenity}`} className="font-normal">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <SubmitButton isEditing={isEditing} />
    </form>
  );
}
