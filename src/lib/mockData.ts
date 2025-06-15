import type { Provider, Facility, Review, User } from './types';
import { SPECIALTY_ICONS, FACILITY_TYPE_ICONS, DEFAULT_USER_AVATAR } from './constants';
import { Stethoscope } from 'lucide-react';

const mockReviews: Review[] = [
  {
    id: 'review1',
    userId: 'user1',
    userName: 'Abebe Kebede',
    userAvatarUrl: 'https://placehold.co/40x40.png?text=AK',
    rating: 5,
    comment: 'Excellent doctor, very knowledgeable and caring. Highly recommend!',
    date: '2024-05-10T10:00:00Z',
  },
  {
    id: 'review2',
    userId: 'user2',
    userName: 'Fatuma Ahmed',
    userAvatarUrl: 'https://placehold.co/40x40.png?text=FA',
    rating: 4,
    comment: 'Good experience, the facility was clean and staff were helpful. Waiting time was a bit long.',
    date: '2024-05-12T14:30:00Z',
  },
  {
    id: 'review3',
    userId: 'user3',
    userName: 'Chala Gemechu',
    rating: 3,
    comment: 'Average service. The doctor seemed rushed.',
    date: '2024-04-20T09:15:00Z',
  },
    {
    id: 'review4',
    userId: 'user4',
    userName: 'Sara Berhanu',
    userAvatarUrl: 'https://placehold.co/40x40.png?text=SB',
    rating: 5,
    comment: 'The best pediatrician in town! My kids love Dr. Alem.',
    date: '2024-05-15T11:00:00Z',
  },
  {
    id: 'review5',
    userId: 'user5',
    userName: 'John Doe',
    rating: 2,
    comment: 'Not satisfied with the consultation. Felt like my concerns were not heard.',
    date: '2024-03-01T16:00:00Z',
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
      email: 'almaz.tesfaye@ethiohealth.com',
      address: 'Bole Medhanialem, Addis Ababa',
    },
    insurancesAccepted: ['NIB Insurance', 'Awash Insurance'],
    languagesSpoken: ['Amharic', 'English'],
    overallRating: 4.8,
    reviews: mockReviews.slice(0, 2),
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
      email: 'bruk.girma@ethiohealth.com',
      address: 'Kazanchis, Addis Ababa',
    },
    insurancesAccepted: ['United Insurance', 'Self Pay / No Insurance'],
    languagesSpoken: ['Amharic', 'Oromo', 'English'],
    overallRating: 4.5,
    reviews: [mockReviews[3], mockReviews[1]],
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
      email: 'helen.getachew@ethiohealth.com',
      address: 'CMC area, Addis Ababa',
    },
    insurancesAccepted: ['NIB Insurance', 'Self Pay / No Insurance'],
    languagesSpoken: ['Amharic', 'English'],
    overallRating: 4.2,
    reviews: [mockReviews[2]],
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
    insurancesAccepted: ['Ethiopian Insurance Corporation', 'Self Pay / No Insurance'],
    overallRating: 4.3,
    reviews: mockReviews.slice(1, 3),
    location: 'Addis Ababa',
    amenities: ['Parking', 'Pharmacy On-site', 'Cafeteria']
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
    insurancesAccepted: ['NIB Insurance', 'Awash Insurance', 'United Insurance'],
    overallRating: 4.7,
    reviews: mockReviews.slice(0, 2).reverse(),
    location: 'Addis Ababa',
    amenities: ['Waiting Area', 'Wi-Fi', 'Accessible']
  },
];

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Abebe Kebede',
    email: 'abebe@example.com',
    avatarUrl: 'https://placehold.co/100x100.png?text=AK',
  },
  {
    id: 'user2',
    name: 'Fatuma Ahmed',
    email: 'fatuma@example.com',
    avatarUrl: 'https://placehold.co/100x100.png?text=FA',
  }
];

export const getProviderById = (id: string): Provider | undefined => mockProviders.find(p => p.id === id);
export const getFacilityById = (id: string): Facility | undefined => mockFacilities.find(f => f.id === id);
