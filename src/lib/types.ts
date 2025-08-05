
import type { LucideIcon } from "lucide-react";

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
  comment: string;
  date: string; // ISO date string
  status: "published" | "under_review" | "hidden";

  // Entity IDs
  providerId?: string;
  facilityId?: string;

  // Provider-specific ratings
  bedsideManner?: number;
  medicalAdherence?: number;
  specialtyCare?: number;

  // Facility-specific ratings
  facilityQuality?: number;

  // Common ratings
  waitTime?: number;
}

export interface ReportedReview extends Review {
  reportReason: string;
  reportId: number;
  reporterUserId: string;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  bio: string;
  contact: {
    phone?: string;
    email?: string;
    address?: string;
  };
  languagesSpoken: string[];
  reviews: Review[];
  location: string;
  qualifications?: string[];
  submitted_by_user_id?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  imageUrl: string; 
  description: string;
  contact: {
    phone?: string;
    email?: string;
    address: string;
  };
  servicesOffered: string[];
  reviews: Review[];
  location: string;
  amenities?: string[];
  affiliatedProviderIds?: string[];
  submitted_by_user_id?: string;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}
