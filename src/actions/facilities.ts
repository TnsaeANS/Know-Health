
"use server";

import { z } from 'zod';
import { pool } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

const facilityFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  type: z.string().min(1, { message: 'Please select a facility type' }),
  location: z.string().min(1, { message: 'Please select a location' }),
  description: z.string().optional(),
  servicesOffered: z.array(z.string()).optional().default([]),
  amenities: z.array(z.string()).optional().default([]),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  contactAddress: z.string().min(5, { message: 'Address must be at least 5 characters' }),
});

export type FacilityFormState = {
  message: string;
  fields?: Record<string, any>;
  issues?: string[];
  success: boolean;
  newFacilityId?: string;
};

export async function submitFacilityAction(
  prevState: FacilityFormState,
  data: FormData
): Promise<FacilityFormState> {
  if (!pool) {
    return { message: 'Database is not configured. Could not add facility.', success: false };
  }

  const formData = {
    name: data.get('name'),
    type: data.get('type'),
    location: data.get('location'),
    description: data.get('description'),
    servicesOffered: data.getAll('servicesOffered'),
    amenities: data.getAll('amenities'),
    contactPhone: data.get('contactPhone'),
    contactEmail: data.get('contactEmail'),
    contactAddress: data.get('contactAddress'),
  };

  const parsed = facilityFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: 'Invalid facility data. Please check the fields.',
      fields: formData,
      issues: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      success: false,
    };
  }

  const { name, type, location, description, servicesOffered, amenities, contactPhone, contactEmail, contactAddress } = parsed.data;

  const newId = `facility-${randomUUID()}`;
  const photoUrl = `https://placehold.co/400x300.png?text=${name.substring(0, 2)}`;

  const insertQuery = `
    INSERT INTO facilities (
      id, name, type, location, description, services_offered, amenities, contact_phone, contact_email, contact_address, photo_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  `;

  try {
    await pool.query(insertQuery, [
      newId, name, type, location, description, servicesOffered, amenities, contactPhone, contactEmail, contactAddress, photoUrl
    ]);

    revalidatePath('/facilities');
    
    return {
      message: 'Facility added successfully!',
      success: true,
      newFacilityId: newId,
    };

  } catch (error) {
    console.error('Database error on facility submission:', error);
    return {
      message: 'A database error occurred. Please try again later.',
      success: false,
    };
  }
}
