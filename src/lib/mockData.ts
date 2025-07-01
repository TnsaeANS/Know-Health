
import type { Provider, Facility, Review, User } from './types';
import { DEFAULT_USER_AVATAR } from './constants';
import { Stethoscope } from 'lucide-react';

export const mockReviews: Review[] = [
  {
    id: 'review1',
    userId: 'user1',
    userName: 'Abebe Kebede',
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
