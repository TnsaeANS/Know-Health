
"use server";

import { z } from 'zod';
import { pool } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';

const facilityFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  type: z.string().min(1, { message: 'Please select a facility type' }),
  location: z.string().min(1, { message: 'Please select a location' }),
  description: z.string().optional(),
  servicesOffered: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  contactAddress: z.string().min(5, { message: 'Address must be at least 5 characters' }),
  submittedByUserId: z.string().min(1, { message: 'User ID is required' }),
  imageUrl: z.string().url().optional().or(z.literal('')),
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
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!pool) {
    return { message: 'Database is not configured. Could not process facility.', success: false };
  }

  const formData = {
    id: data.get('id') || undefined,
    name: data.get('name'),
    type: data.get('type'),
    location: data.get('location'),
    description: data.get('description'),
    servicesOffered: data.getAll('servicesOffered'),
    amenities: data.getAll('amenities'),
    contactPhone: data.get('contactPhone'),
    contactEmail: data.get('contactEmail'),
    contactAddress: data.get('contactAddress'),
    submittedByUserId: data.get('submittedByUserId'),
    imageUrl: data.get("imageUrl")?.toString() || undefined,
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

  const { id, name, type, location, description, servicesOffered, amenities, contactPhone, contactEmail, contactAddress, submittedByUserId, imageUrl } = parsed.data;

  const client = await pool.connect();

  try {
    if (id) {
      // UPDATE existing facility
      const ownerCheck = await client.query('SELECT submitted_by_user_id FROM facilities WHERE id = $1', [id]);
      if (ownerCheck.rows.length === 0 || ownerCheck.rows[0].submitted_by_user_id !== submittedByUserId) {
          return { message: 'Authorization Error: You cannot edit this facility.', success: false };
      }

      const updateQuery = `
        UPDATE facilities SET
          name = $1, type = $2, location = $3, description = $4, services_offered = $5,
          amenities = $6, contact_phone = $7, contact_email = $8, contact_address = $9,
          photo_url = $10
        WHERE id = $11 AND submitted_by_user_id = $12
      `;
      await client.query(updateQuery, [name, type, location, description, servicesOffered, amenities, contactPhone, contactEmail, contactAddress, imageUrl, id, submittedByUserId]);

      revalidatePath('/facilities');
      revalidatePath(`/facilities/${id}`);
      revalidatePath('/account');

      return {
        message: 'Facility updated successfully!',
        success: true,
        newFacilityId: id,
      };

    } else {
      // INSERT new facility
      const newId = `facility-${randomUUID()}`;
      const photoUrl = imageUrl || `https://placehold.co/400x300.png`;

      const insertQuery = `
        INSERT INTO facilities (
          id, name, type, location, description, services_offered, amenities, contact_phone, contact_email, contact_address, photo_url, submitted_by_user_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `;
      await client.query(insertQuery, [
        newId, name, type, location, description, servicesOffered, amenities, contactPhone, contactEmail, contactAddress, photoUrl, submittedByUserId
      ]);

      revalidatePath('/facilities');
      revalidatePath('/account');
      
      return {
        message: 'Facility added successfully!',
        success: true,
        newFacilityId: newId,
      };
    }
  } catch (error: any) {
    console.error('Database error on facility submission:', error);
    return {
      message: `A database error occurred: ${error.message}. Please try again later.`,
      success: false,
    };
  } finally {
      client.release();
  }
}

export async function deleteFacilityAction(facilityId: string, userId: string): Promise<{ success: boolean; message: string; }> {
    if (!pool) {
      return { success: false, message: 'Database is not configured.' };
    }
  
    const client = await pool.connect();
    try {
      const ownerCheck = await client.query('SELECT submitted_by_user_id FROM facilities WHERE id = $1', [facilityId]);
      if (ownerCheck.rows.length === 0) {
        return { success: false, message: 'Facility not found.' };
      }
      if (ownerCheck.rows[0].submitted_by_user_id !== userId) {
        return { success: false, message: 'You are not authorized to delete this facility.' };
      }
  
      await client.query('DELETE FROM facilities WHERE id = $1', [facilityId]);
  
      revalidatePath('/facilities');
      revalidatePath('/account');
  
      return { success: true, message: 'Facility deleted successfully.' };
    } catch (error: any) {
      console.error(`Database error deleting facility ${facilityId}:`, error);
      return { success: false, message: `A database error occurred: ${error.message}` };
    } finally {
      client.release();
    }
}
