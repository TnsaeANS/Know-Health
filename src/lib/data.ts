
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

const mapDbRowToProvider = (row: any): Provider => ({
  id: row.id,
  name: row.name,
  specialty: row.specialty,
  photoUrl: row.photo_url || `https://placehold.co/300x300.png?text=${row.name.substring(0,2)}`,
  bio: row.bio,
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
    description: row.description,
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

async function fetchReviewsFromDB(
  query: string,
  params: string[],
  entityType: 'provider' | 'facility'
): Promise<Review[] | null> {
  if (!pool) {
    return null; 
  }
  try {
    const result = await pool.query(query, params);
    return result.rows.map(mapDbRowToReview);
  } catch (error: any) {
    if (error.code === '28P01') { 
      console.error(`\n--- DATABASE AUTHENTICATION FAILED ---\nCould not connect to the database. Please check that the POSTGRES_URL in your .env file is correct.\nFalling back to mock data.\n---\n`);
    } else {
      console.error(`Failed to fetch reviews for ${entityType} with params ${params}:`, error);
      console.error('Falling back to mock data.');
    }
    return null; 
  }
}

export const getProviders = async (): Promise<Provider[]> => {
  if (pool) {
    try {
      const result = await pool.query('SELECT * FROM providers ORDER BY name');
      return result.rows.map(mapDbRowToProvider);
    } catch (e) {
      console.error('Failed to fetch providers from DB, falling back to mock data:', e);
    }
  } else {
    console.log('DB not configured, returning mock providers.');
  }
  return deepCopy(mockProviders);
};

export const getFacilities = async (): Promise<Facility[]> => {
  if (pool) {
    try {
      const result = await pool.query('SELECT * FROM facilities ORDER BY name');
      return result.rows.map(mapDbRowToFacility);
    } catch (e) {
      console.error('Failed to fetch facilities from DB, falling back to mock data:', e);
    }
  } else {
    console.log('DB not configured, returning mock facilities.');
  }
  return deepCopy(mockFacilities);
};

export const getProviderById = async (id: string): Promise<Provider | undefined> => {
  let providerData: Provider | undefined;

  if (pool) {
    try {
      const result = await pool.query('SELECT * FROM providers WHERE id = $1', [id]);
      if (result.rows.length > 0) {
        providerData = mapDbRowToProvider(result.rows[0]);
      }
    } catch (error) {
      console.error(`Failed to fetch provider ${id} from DB, falling back to mock data:`, error);
    }
  }

  if (!providerData) {
    providerData = mockProviders.find(p => p.id === id);
  }

  if (!providerData) return undefined;

  const provider = deepCopy(providerData);

  const dbReviews = await fetchReviewsFromDB(
    'SELECT * FROM reviews WHERE provider_id = $1 ORDER BY date DESC',
    [id],
    'provider'
  );
  
  const sourceReviews = dbReviews ?? provider.reviews;

  provider.reviews = sourceReviews.map(review => {
    const { facilityQuality, ...providerReview } = review;
    return providerReview as Review;
  });
  
  return provider;
};
  
export const getFacilityById = async (id: string): Promise<Facility | undefined> => {
  let facilityData: Facility | undefined;

  if (pool) {
      try {
          const result = await pool.query('SELECT * FROM facilities WHERE id = $1', [id]);
          if (result.rows.length > 0) {
              facilityData = mapDbRowToFacility(result.rows[0]);
          }
      } catch (error) {
          console.error(`Failed to fetch facility ${id} from DB, falling back to mock data:`, error);
      }
  }

  if (!facilityData) {
      facilityData = mockFacilities.find(f => f.id === id);
  }

  if (!facilityData) return undefined;

  const facility = deepCopy(facilityData);
  
  const dbReviews = await fetchReviewsFromDB(
    'SELECT * FROM reviews WHERE facility_id = $1 ORDER BY date DESC',
    [id],
    'facility'
  );

  const sourceReviews = dbReviews ?? facility.reviews;

  facility.reviews = sourceReviews.map(review => {
    const { bedsideManner, medicalAdherence, specialtyCare, ...facilityReview } = review;
    return facilityReview as Review;
  });

  return facility;
};
