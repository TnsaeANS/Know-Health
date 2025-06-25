
"use server";

import { z } from 'zod';
import { pool } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

const providerFormSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  specialty: z.string().min(1, { message: 'Please select a specialty' }),
  location: z.string().min(1, { message: 'Please select a location' }),
  bio: z.string().optional(),
  languages: z.array(z.string()).optional().default([]),
  qualifications: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  contactAddress: z.string().optional(),
});

export type ProviderFormState = {
  message: string;
  fields?: Record<string, any>;
  issues?: string[];
  success: boolean;
  newProviderId?: string;
};

export async function submitProviderAction(
  prevState: ProviderFormState,
  data: FormData
): Promise<ProviderFormState> {
  if (!pool) {
    return { message: 'Database is not configured. Could not add provider.', success: false };
  }

  const formData = {
      name: data.get('name'),
      specialty: data.get('specialty'),
      location: data.get('location'),
      bio: data.get('bio'),
      languages: data.getAll('languages'),
      qualifications: data.get('qualifications'),
      contactPhone: data.get('contactPhone'),
      contactEmail: data.get('contactEmail'),
      contactAddress: data.get('contactAddress'),
  };

  const parsed = providerFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      message: 'Invalid provider data. Please check the fields.',
      fields: formData,
      issues: parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`),
      success: false,
    };
  }
  
  const { name, specialty, location, bio, languages, qualifications, contactPhone, contactEmail, contactAddress } = parsed.data;

  const newId = `provider-${randomUUID()}`;
  const photoUrl = `https://placehold.co/300x300.png?text=${name.substring(0,2)}`;

  const qualificationsArray = qualifications?.split(',').map(q => q.trim()).filter(Boolean) || [];

  const insertQuery = `
    INSERT INTO providers (
      id, name, specialty, location, bio, languages_spoken, qualifications, contact_phone, contact_email, contact_address, photo_url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
  `;

  try {
    await pool.query(insertQuery, [
        newId, name, specialty, location, bio, languages, qualificationsArray, contactPhone, contactEmail, contactAddress, photoUrl
    ]);

    revalidatePath('/providers');
    
    return {
        message: 'Provider added successfully!',
        success: true,
        newProviderId: newId,
    };

  } catch (error) {
    console.error('Database error on provider submission:', error);
    return {
      message: 'A database error occurred. Please try again later.',
      success: false,
    };
  }
}
