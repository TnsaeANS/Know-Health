
'use server';

import type { Provider, Facility, Review } from './types';
import { pool } from './db';
import { mockProviders, mockFacilities } from './mockData';

function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepCopy(item)) as any;
  }
  const copiedObject = {} as { [key: string]: any };
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copiedObject[key] = deepCopy(obj[key]);
    }
  }
  return copiedObject as T;
}

const mapDbRowToReview = (row: any): Review => {
  return {
    id: String(row.id),
    userId: row.user_id,
    userName: row.user_name,
    userAvatarUrl: row.user_avatar_url,
    comment: row.comment || "",
    date: new Date(row.date).toISOString(),
    bedsideManner: row.bedside_manner,
    medicalAdherence: row.medical_adherence,
    specialtyCare: row.specialty_care,
    facilityQuality: row.facility_quality,
    waitTime: row.wait_time,
  };
};

// Ensure bio is always a string
const mapDbRowToProvider = (row: any): Provider => ({
  id: row.id,
  name: row.name,
  specialty: row.specialty,
  photoUrl: row.photo_url || `https://placehold.co/300x300.png?text=${row.name.substring(0,2)}`,
  bio: row.bio || '',
  contact: {
    phone: row.contact_phone,
    email: row.contact_email,
    address: row.contact_address,
  },
  languagesSpoken: row.languages_spoken || [],
  reviews: [], 
  location: row.location,
  qualifications: row.qualifications || [],
});

// Ensure description is always a string
const mapDbRowToFacility = (row: any): Facility => ({
    id: row.id,
    name: row.name,
    type: row.type,
    photoUrl: row.photo_url || `https://placehold.co/400x300.png?text=${row.name.substring(0,2)}`,
    description: row.description || '',
    contact: {
      phone: row.contact_phone,
      email: row.contact_email,
      address: row.contact_address,
    },
    servicesOffered: row.services_offered || [],
    reviews: [],
    location: row.location,
    amenities: row.amenities || [],
    affiliatedProviderIds: row.affiliated_provider_ids || [],
});

async function fetchReviewsFromDB(query: string, params: string[]): Promise<Review[]> {
  if (!pool) {
    return []; 
  }
  try {
    const result = await pool.query(query, params);
    return result.rows.map(mapDbRowToReview);
  } catch (error: any) {
    console.error(`Failed to fetch reviews with params ${params}:`, error);
    throw new Error('A database error occurred while fetching reviews.');
  }
}

export const getProviders = async (): Promise<Provider[]> => {
  if (!pool) {
    console.warn('DB not configured, returning mock providers.');
    return deepCopy(mockProviders);
  }
  try {
    const result = await pool.query('SELECT * FROM providers ORDER BY name');
    return result.rows.map(mapDbRowToProvider);
  } catch (error) {
    console.error('Failed to fetch providers from DB:', error);
    throw new Error('Could not fetch providers from the database.');
  }
};

export const getFacilities = async (): Promise<Facility[]> => {
  if (!pool) {
    console.warn('DB not configured, returning mock facilities.');
    return deepCopy(mockFacilities);
  }
  try {
    const result = await pool.query('SELECT * FROM facilities ORDER BY name');
    return result.rows.map(mapDbRowToFacility);
  } catch (error) {
    console.error('Failed to fetch facilities from DB:', error);
    throw new Error('Could not fetch facilities from the database.');
  }
};

export const getProviderById = async (id: string): Promise<Provider | undefined> => {
  if (!pool) {
    console.warn('Database not configured. Falling back to mock data for getProviderById.');
    const mockProvider = mockProviders.find(p => p.id === id);
    if (!mockProvider) return undefined;

    const provider = deepCopy(mockProvider);
    provider.reviews = (provider.reviews || []).map(review => {
        const { facilityQuality, ...providerReview } = review;
        return providerReview;
    });
    return provider;
  }
  
  try {
    const result = await pool.query('SELECT * FROM providers WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return undefined;
    }
    const provider = mapDbRowToProvider(result.rows[0]);

    const reviews = await fetchReviewsFromDB(
      'SELECT * FROM reviews WHERE provider_id = $1 ORDER BY date DESC',
      [id]
    );
    
    provider.reviews = reviews.map(review => {
        const { facilityQuality, ...providerReview } = review;
        return providerReview as Review;
    });

    return provider;
  } catch (error) {
    console.error(`Failed to fetch provider ${id} from DB.`, error);
    throw new Error('Could not fetch provider details from the database.');
  }
};
  
export const getFacilityById = async (id: string): Promise<Facility | undefined> => {
  if (!pool) {
      console.warn('Database not configured. Falling back to mock data for getFacilityById.');
      const mockFacility = mockFacilities.find(f => f.id === id);
      if (!mockFacility) return undefined;
      
      const facility = deepCopy(mockFacility);
      facility.reviews = (facility.reviews || []).map(review => {
          const { bedsideManner, medicalAdherence, specialtyCare, ...facilityReview } = review;
          return facilityReview;
      });
      return facility;
  }

  try {
    const result = await pool.query('SELECT * FROM facilities WHERE id = $1', [id]);
    if (result.rows.length === 0) {
        return undefined;
    }
    const facility = mapDbRowToFacility(result.rows[0]);
    
    const reviews = await fetchReviewsFromDB(
      'SELECT * FROM reviews WHERE facility_id = $1 ORDER BY date DESC',
      [id]
    );

    facility.reviews = reviews.map(review => {
      const { bedsideManner, medicalAdherence, specialtyCare, ...facilityReview } = review;
      return facilityReview as Review;
    });

    return facility;
  } catch (error) {
    console.error(`Failed to fetch facility ${id} from DB.`, error);
    throw new Error('Could not fetch facility details from the database.');
  }
};
