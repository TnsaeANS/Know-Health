import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  rating: number; // 1-5 stars
  comment: string;
  date: string; // ISO date string
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  specialtyIcon?: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>; // Allow for custom SVGs if needed
  photoUrl: string;
  bio: string;
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  };
  insurancesAccepted: string[];
  languagesSpoken: string[];
  overallRating: number; // Calculated average
  reviews: Review[];
  location: string; // Simple location string for now
  qualifications?: string[];
}

export interface Facility {
  id:string;
  name: string;
  type: string; // e.g., Hospital, Clinic, Pharmacy
  typeIcon?: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
  photoUrl: string;
  description: string;
  contact: {
    phone?: string;
    email?: string;
    address: string;
  };
  servicesOffered: string[];
  insurancesAccepted: string[];
  overallRating: number; // Calculated average
  reviews: Review[];
  location: string;
  amenities?: string[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export type ReviewSummaryAI = {
  summary: string;
  positiveThemes: string;
  negativeThemes: string;
};
