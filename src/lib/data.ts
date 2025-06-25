
'use server';

import type { Provider, Facility, Review } from './types';
import { pool } from './db';
import { mockProviders, mockFacilities } from './mockData';

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
    // userAvatarUrl is not stored in the DB in this implementation
  };
};

// Centralized function to fetch reviews from DB and handle errors
async function fetchReviewsFromDB(
  query: string,
  params: string[],
  entityType: 'provider' | 'facility'
): Promise<Review[] | null> {
  if (!pool) {
    console.warn('Database not configured. Falling back to mock data.');
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


export const getProviderById = async (id: string): Promise<Provider | undefined> => {
  const providerData = mockProviders.find(p => p.id === id);
  if (!providerData) return undefined;

  const provider = deepCopy(providerData);

  const dbReviews = await fetchReviewsFromDB(
    'SELECT * FROM reviews WHERE provider_id = $1 ORDER BY date DESC',
    [id],
    'provider'
  );
  
  // If dbReviews is not null, it means DB fetch was successful.
  if (dbReviews !== null) {
    provider.reviews = dbReviews.map(review => {
      delete review.facilityQuality; // Clean up facility-specific ratings
      return review;
    });
  } else {
    // Fallback for when DB is not configured or an error occurred
    provider.reviews = provider.reviews.map(review => {
      const cleanReview = deepCopy(review);
      delete (cleanReview as any).facilityQuality;
      return cleanReview;
    });
  }
  
  return provider;
};

export const getFacilityById = async (id: string): Promise<Facility | undefined> => {
  const facilityData = mockFacilities.find(f => f.id === id);
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
    // Fallback for when DB is not configured or an error occurred
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
