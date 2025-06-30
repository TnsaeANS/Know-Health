
'use server';

import type { Provider, Facility, Review } from './types';
import { pool } from './db';
import { mockProviders, mockFacilities } from './mockData';
import { Stethoscope, Building } from 'lucide-react';

// Helper function to deep copy an object
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
  reviews: [], // Reviews are fetched separately
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
    reviews: [], // Reviews are fetched separately
    location: row.location,
    amenities: row.amenities || [],
    affiliatedProviderIds: row.affiliated_provider_ids || [],
});


// Centralized function to fetch reviews from DB and handle errors
async function fetchReviewsFromDB(
  query: string,
  params: string[],
  entityType: 'provider' | 'facility'
): Promise<Review[] | null> {
  if (!pool) {
    // console.warn('Database not configured. Using mock reviews.');
    return null; // Indicates fallback to mock data
  }
  try {
    const result = await pool.query(query, params);
    return result.rows.map(mapDbRowToReview);
  } catch (error: any) {
    if (error.code === '28P01') { // invalid_password
      console.error(`\n--- DATABASE AUTHENTICATION FAILED ---\nCould not connect to the database. Please check that the POSTGRES_URL in your .env file is correct.\nFalling back to mock data.\n---\n`);
    } else {
      console.error(`Failed to fetch reviews for ${entityType} with params ${params}:`, error);
      console.error('Falling back to mock data.');
    }
    return null; // Signal failure to the caller function, so it can fall back
  }
}

export const getProviders = async (): Promise<Provider[]> => {
  if (pool) {
    try {
      const result = await pool.query('SELECT * FROM providers ORDER BY name');
      if (result.rows.length > 0) {
        return result.rows.map(mapDbRowToProvider);
      }
    } catch (e) {
      console.error('Failed to fetch providers from DB, falling back to mock data:', e);
    }
  }
  console.log('No providers found in DB or DB not configured, returning mock data.');
  return mockProviders;
};

export const getFacilities = async (): Promise<Facility[]> => {
  if (pool) {
    try {
      const result = await pool.query('SELECT * FROM facilities ORDER BY name');
      if (result.rows.length > 0) {
        return result.rows.map(mapDbRowToFacility);
      }
    } catch (e) {
      console.error('Failed to fetch facilities from DB, falling back to mock data:', e);
    }
  }
  console.log('No facilities found in DB or DB not configured, returning mock data.');
  return mockFacilities;
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
        console.error(`Failed to fetch provider ${id} from DB, will try mock data:`, error);
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
    
    if (dbReviews !== null) {
      provider.reviews = dbReviews.map(review => {
        delete review.facilityQuality; // Clean up facility-specific ratings
        return review;
      });
    } else {
      provider.reviews = provider.reviews.map(review => {
        const cleanReview = deepCopy(review);
        delete (cleanReview as any).facilityQuality;
        return cleanReview;
      });
    }
    
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
            console.error(`Failed to fetch facility ${id} from DB, will try mock data:`, error);
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
  
    if (dbReviews !== null) {
      facility.reviews = dbReviews.map(review => {
        delete review.bedsideManner;
        delete review.medicalAdherence;
        delete review.specialtyCare;
        return review;
      });
    } else {
      facility.reviews = facility.reviews.map(review => {
        const cleanReview = deepCopy(review);
        delete (cleanReview as any).bedsideManner;
        delete (cleanReview as any).medicalAdherence;
        delete (cleanReview as any).specialtyCare;
        return cleanReview;
      });
    }
  
    return facility;
  };
