
"use server";

import { z } from 'zod';
import { pool } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

const providerFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  specialty: z.string().min(1, { message: 'Please select a specialty' }),
  location: z.string().min(1, { message: 'Please select a location' }),
  bio: z.string().optional(),
  languages: z.array(z.string()).optional().default([]),
  qualifications: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  contactAddress: z.string().optional(),
  mapUrl: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
  submittedByUserId: z.string().min(1, { message: 'User ID is required' }),
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
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!pool) {
    return { message: 'Database is not configured. Could not add provider.', success: false };
  }

  const formData = {
      id: data.get('id') || undefined,
      name: data.get('name'),
      specialty: data.get('specialty'),
      location: data.get('location'),
      bio: data.get('bio'),
      languages: data.getAll('languages'),
      qualifications: data.get('qualifications'),
      contactPhone: data.get('contactPhone'),
      contactEmail: data.get('contactEmail'),
      contactAddress: data.get('contactAddress'),
      mapUrl: data.get('mapUrl'),
      submittedByUserId: data.get('submittedByUserId'),
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
  
  const { id, name, specialty, location, bio, languages, qualifications, contactPhone, contactEmail, contactAddress, mapUrl, submittedByUserId } = parsed.data;

  const qualificationsArray = qualifications?.split(',').map(q => q.trim()).filter(Boolean) || [];
  const client = await pool.connect();

  try {
    if (id) {
      // UPDATE existing provider
      const ownerCheck = await client.query('SELECT submitted_by_user_id FROM providers WHERE id = $1', [id]);
      if (ownerCheck.rows.length === 0 || ownerCheck.rows[0].submitted_by_user_id !== submittedByUserId) {
          return { message: 'Authorization Error: You cannot edit this provider.', success: false };
      }

      const updateQuery = `
        UPDATE providers SET
          name = $1, specialty = $2, location = $3, bio = $4, languages_spoken = $5,
          qualifications = $6, contact_phone = $7, contact_email = $8, contact_address = $9
        WHERE id = $10 AND submitted_by_user_id = $11
      `;
      await client.query(updateQuery, [name, specialty, location, bio, languages, qualificationsArray, contactPhone, contactEmail, contactAddress, id, submittedByUserId]);

      revalidatePath('/providers');
      revalidatePath(`/providers/${id}`);
      revalidatePath('/account');
      
      return {
        message: 'Provider updated successfully!',
        success: true,
        newProviderId: id,
      };

    } else {
      // INSERT new provider
      const newId = `provider-${randomUUID()}`;
      const photoUrl = `https://placehold.co/300x300.png`;

      const insertQuery = `
        INSERT INTO providers (
          id, name, specialty, location, bio, languages_spoken, qualifications, contact_phone, contact_email, contact_address, photo_url, submitted_by_user_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `;

      await client.query(insertQuery, [
          newId, name, specialty, location, bio, languages, qualificationsArray, contactPhone, contactEmail, contactAddress, photoUrl, submittedByUserId
      ]);

      revalidatePath('/providers');
      revalidatePath('/account');
      
      return {
          message: 'Provider added successfully!',
          success: true,
          newProviderId: newId,
      };
    }
  } catch (error) {
    console.error('Database error on provider submission:', error);
    return {
      message: 'A database error occurred. Please try again later.',
      success: false,
    };
  } finally {
      client.release();
  }
}

export async function deleteProviderAction(providerId: string, userId: string): Promise<{ success: boolean; message: string; }> {
    if (!pool) {
      return { success: false, message: 'Database is not configured.' };
    }
  
    const client = await pool.connect();
    try {
      const ownerCheck = await client.query('SELECT submitted_by_user_id FROM providers WHERE id = $1', [providerId]);
      if (ownerCheck.rows.length === 0) {
        return { success: false, message: 'Provider not found.' };
      }
      if (ownerCheck.rows[0].submitted_by_user_id !== userId) {
        return { success: false, message: 'You are not authorized to delete this provider.' };
      }
  
      await client.query('DELETE FROM providers WHERE id = $1', [providerId]);
  
      revalidatePath('/providers');
      revalidatePath('/account');
  
      return { success: true, message: 'Provider deleted successfully.' };
    } catch (error: any) {
      console.error(`Database error deleting provider ${providerId}:`, error);
      return { success: false, message: 'A database error occurred. Please try again.' };
    } finally {
      client.release();
    }
}
