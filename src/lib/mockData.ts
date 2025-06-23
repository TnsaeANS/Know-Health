
import type { Provider, Facility, Review, User } from './types';
import { SPECIALTY_ICONS, FACILITY_TYPE_ICONS, DEFAULT_USER_AVATAR } from './constants';
import { Stethoscope } from 'lucide-react';
import { pool } from './db';

export const mockReviews: Review[] = [
  {
    id: 'review1',
    userId: 'user1',
    userName: 'Abebe Kebede',
    userAvatarUrl: 'https://placehold.co/40x40.png?text=AK',
    comment: 'Excellent doctor, very knowledgeable and caring. Highly recommend!',
    date: '2024-05-10T10:00:00Z',
    bedsideManner: 5,
    medicalAdherence: 5,
    waitTime: 4,
    specialtyCare: 4,
  },
  {
    id: 'review2',
    userId: 'user2',
    userName: 'Fatuma Ahmed',
    userAvatarUrl: 'https://placehold.co/40x40.png?text=FA',
    comment: 'Good experience, the facility was clean and staff were helpful. Waiting time was a bit long.',
    date: '2024-05-12T14:30:00Z',
    facilityQuality: 4,
    waitTime: 2,
  },
  {
    id: 'review3',
    userId: 'user3',
    userName: 'Chala Gemechu',
    comment: 'Average service. The doctor seemed rushed.',
    date: '2024-04-20T09:15:00Z',
    bedsideManner: 3,
    medicalAdherence: 3,
    waitTime: 3,
    specialtyCare: 3,
  },
    {
    id: 'review4',
    userId: 'user4',
    userName: 'Sara Berhanu',
    userAvatarUrl: 'https://placehold.co/40x40.png?text=SB',
    comment: 'The best pediatrician in town! My kids love Dr. Alem.',
    date: '2024-05-15T11:00:00Z',
    bedsideManner: 5,
    medicalAdherence: 5,
    waitTime: 5,
    specialtyCare: 4,
  },
  {
    id: 'review5',
    userId: 'user5',
    userName: 'John Doe',
    comment: 'Not satisfied with the consultation. Felt like my concerns were not heard.',
    date: '2024-03-01T16:00:00Z',
    bedsideManner: 2,
    medicalAdherence: 2,
    waitTime: 4,
    specialtyCare: 3,
  }
];

export const mockProviders: Provider[] = [
  {
    id: 'provider1',
    name: 'Dr. Almaz Tesfaye',
    specialty: 'Cardiology',
    specialtyIcon: SPECIALTY_ICONS['cardiology'] || Stethoscope,
    photoUrl: 'https://placehold.co/300x300.png',
    bio: 'Dr. Almaz Tesfaye is a renowned cardiologist with over 15 years of experience in treating various heart conditions. She is dedicated to providing compassionate and comprehensive care to her patients.',
    contact: {
      phone: '+251 912 345 678',
      email: 'almaz.tesfaye@knowhealth.com',
      address: 'Bole Medhanialem, Addis Ababa',
    },
    languagesSpoken: ['Amharic', 'English'],
    reviews: mockReviews.filter(r => r.bedsideManner !== undefined && r.id === 'review1'),
    location: 'Addis Ababa',
    qualifications: ['MD, Cardiology Fellowship', 'Member of Ethiopian Heart Association']
  },
  {
    id: 'provider2',
    name: 'Dr. Bruk Girma',
    specialty: 'Pediatrics',
    specialtyIcon: SPECIALTY_ICONS['pediatrics'] || Stethoscope,
    photoUrl: 'https://placehold.co/300x300.png',
    bio: 'Dr. Bruk Girma is a friendly and experienced pediatrician committed to the health and well-being of children. He believes in a holistic approach to child care.',
    contact: {
      phone: '+251 911 223 344',
      email: 'bruk.girma@knowhealth.com',
      address: 'Kazanchis, Addis Ababa',
    },
    languagesSpoken: ['Amharic', 'Oromo', 'English'],
    reviews: [mockReviews.find(r => r.id === 'review1')!, mockReviews.find(r => r.id === 'review4')!].filter(Boolean) as Review[],
    location: 'Addis Ababa',
    qualifications: ['MD, Specialization in Pediatrics', 'Certified in Neonatal Resuscitation']
  },
  {
    id: 'provider3',
    name: 'Dr. Helen Getachew',
    specialty: 'Dentistry',
    specialtyIcon: SPECIALTY_ICONS['dentistry'] || Stethoscope,
    photoUrl: 'https://placehold.co/300x300.png',
    bio: 'Dr. Helen Getachew offers a wide range of dental services with a focus on patient comfort and satisfaction. She stays updated with the latest advancements in dental technology.',
    contact: {
      phone: '+251 922 111 000',
      email: 'helen.getachew@knowhealth.com',
      address: 'CMC area, Addis Ababa',
    },
    languagesSpoken: ['Amharic', 'English'],
    reviews: [mockReviews.find(r => r.id === 'review3')!].filter(Boolean) as Review[],
    location: 'Addis Ababa',
    qualifications: ['DDS (Doctor of Dental Surgery)', 'Advanced Course in Cosmetic Dentistry']
  },
];

export const mockFacilities: Facility[] = [
  {
    id: 'facility1',
    name: 'St. Paulos Hospital Millennium Medical College',
    type: 'Hospital',
    typeIcon: FACILITY_TYPE_ICONS['hospital'] || Stethoscope,
    photoUrl: 'https://placehold.co/400x300.png',
    description: 'A leading public teaching hospital offering a wide range of specialized medical services and advanced treatments. Known for its commitment to medical education and research.',
    contact: {
      phone: '+251 112 750 001',
      email: 'info@stpaulos.gov.et',
      address: 'Gulele Sub-city, Addis Ababa',
    },
    servicesOffered: ['Emergency Care', 'Surgery', 'Internal Medicine', 'Pediatrics', 'Obstetrics & Gynecology'],
    reviews: mockReviews.filter(r => r.facilityQuality !== undefined && r.id === 'review2'),
    location: 'Addis Ababa',
    amenities: ['Parking', 'Pharmacy On-site', 'Cafeteria'],
    affiliatedProviderIds: ['provider1', 'provider2'], // Added
  },
  {
    id: 'facility2',
    name: 'Ethio-American Clinic',
    type: 'Clinic',
    typeIcon: FACILITY_TYPE_ICONS['clinic'] || Stethoscope,
    photoUrl: 'https://placehold.co/400x300.png',
    description: 'A modern private clinic providing high-quality outpatient services with a focus on patient-centered care. Offers consultations with various specialists.',
    contact: {
      phone: '+251 930 001 122',
      email: 'contact@ethioamericanclinic.com',
      address: 'Old Airport, Addis Ababa',
    },
    servicesOffered: ['General Consultation', 'Specialist Consultation', 'Minor Procedures', 'Vaccinations'],
    reviews: [mockReviews.find(r => r.id === 'review2')!].filter(Boolean) as Review[],
    location: 'Addis Ababa',
    amenities: ['Waiting Area', 'Wi-Fi', 'Accessible'],
    affiliatedProviderIds: ['provider3'], // Added
  },
];

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

export const getProviderById = async (id: string): Promise<Provider | undefined> => {
  const providerData = mockProviders.find(p => p.id === id);
  if (!providerData) return undefined;

  const provider = deepCopy(providerData);
  
  if (pool) {
    try {
      const result = await pool.query('SELECT * FROM reviews WHERE provider_id = $1 ORDER BY date DESC', [id]);
      provider.reviews = result.rows.map(mapDbRowToReview).map(review => {
        delete review.facilityQuality;
        return review;
      });
    } catch (error) {
      console.error(`Failed to fetch reviews for provider ${id}:`, error);
      // Fallback to mock reviews or empty array
      provider.reviews = provider.reviews.map(review => {
        const cleanReview = deepCopy(review);
        delete (cleanReview as any).facilityQuality; 
        return cleanReview;
      });
    }
  } else {
     // Fallback for when DB is not configured
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

  if (pool) {
     try {
      const result = await pool.query('SELECT * FROM reviews WHERE facility_id = $1 ORDER BY date DESC', [id]);
      facility.reviews = result.rows.map(mapDbRowToReview).map(review => {
          delete review.bedsideManner;
          delete review.medicalAdherence;
          delete review.specialtyCare;
          return review;
      });
    } catch (error) {
      console.error(`Failed to fetch reviews for facility ${id}:`, error);
      // Fallback to mock reviews or empty array
      facility.reviews = facility.reviews.map(review => {
        const cleanReview = deepCopy(review);
        delete (cleanReview as any).bedsideManner; 
        delete (cleanReview as any).medicalAdherence;
        delete (cleanReview as any).specialtyCare;
        return cleanReview;
      });
    }
  } else {
      // Fallback for when DB is not configured
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
