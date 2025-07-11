
'use server';

import type { Provider, Facility, Review } from './types';
import { pool } from './db';

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
    comment: row.comment || "",
    date: new Date(row.date).toISOString(),
    bedsideManner: row.bedside_manner ?? undefined,
    medicalAdherence: row.medical_adherence ?? undefined,
    specialtyCare: row.specialty_care ?? undefined,
    facilityQuality: row.facility_quality ?? undefined,
    waitTime: row.wait_time ?? undefined,
  };
};

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
    console.warn('Database not configured. Cannot fetch providers. Returning empty array.');
    return [];
  }
  try {
    const providersResult = await pool.query('SELECT * FROM providers ORDER BY name');
    
    const allReviewsResult = await pool.query('SELECT * FROM reviews WHERE provider_id IS NOT NULL');
    const reviewsByProvider = new Map<string, Review[]>();

    for (const row of allReviewsResult.rows) {
      if (!reviewsByProvider.has(row.provider_id)) {
        reviewsByProvider.set(row.provider_id, []);
      }
      reviewsByProvider.get(row.provider_id)!.push(mapDbRowToReview(row));
    }

    const providersWithReviews = providersResult.rows.map(row => {
      const provider = mapDbRowToProvider(row);
      provider.reviews = (reviewsByProvider.get(provider.id) || []).map(review => {
        const { facilityQuality, ...providerReview } = review;
        return providerReview as Review;
      });
      return provider;
    });

    return providersWithReviews;
  } catch (error) {
    console.warn('Could not fetch providers from DB. This is expected if the database is not configured locally. Returning empty array.');
    return [];
  }
};

export const getFacilities = async (): Promise<Facility[]> => {
  if (!pool) {
    console.warn('Database not configured. Cannot fetch facilities. Returning empty array.');
    return [];
  }
  try {
    const facilitiesResult = await pool.query('SELECT * FROM facilities ORDER BY name');
      
    const allReviewsResult = await pool.query('SELECT * FROM reviews WHERE facility_id IS NOT NULL');
    const reviewsByFacility = new Map<string, Review[]>();
  
    for (const row of allReviewsResult.rows) {
      if (!reviewsByFacility.has(row.facility_id)) {
        reviewsByFacility.set(row.facility_id, []);
      }
      reviewsByFacility.get(row.facility_id)!.push(mapDbRowToReview(row));
    }
  
    const facilitiesWithReviews = facilitiesResult.rows.map(row => {
      const facility = mapDbRowToFacility(row);
      facility.reviews = (reviewsByFacility.get(facility.id) || []).map(review => {
        const { bedsideManner, medicalAdherence, specialtyCare, ...facilityReview } = review;
        return facilityReview as Review;
      });
      return facility;
    });
  
    return facilitiesWithReviews;
  } catch (error) {
    console.warn('Could not fetch facilities from DB. This is expected if the database is not configured locally. Returning empty array.');
    return [];
  }
};

export const getProviderById = async (id: string): Promise<Provider | undefined> => {
  if (!pool) {
    console.error('Database not configured. Could not fetch provider.');
    throw new Error('Database is not configured.');
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
      console.error('Database not configured. Could not fetch facility.');
      throw new Error('Database is not configured.');
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
