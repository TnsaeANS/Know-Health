
import type { NavItem, FilterOption } from '@/lib/types';
import { Home, Stethoscope, Hospital, Info, MessageSquare, BriefcaseMedical, Building, Languages, MapPin, Smile, Bone, Brain, Baby, Eye, LucideIcon } from 'lucide-react';

export const APP_NAME = "Know Health";

export const NAV_LINKS: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Find Doctors', href: '/providers', icon: Stethoscope },
  { label: 'Find Facilities', href: '/facilities', icon: Hospital },
  { label: 'Contact Us', href: '/contact', icon: MessageSquare },
];

export const SPECIALTIES: FilterOption[] = [
  { value: 'cardiology', label: 'Cardiology' },
  { value: 'dentistry', label: 'Dentistry' },
  { value: 'dermatology', label: 'Dermatology' },
  { value: 'general_practice', label: 'General Practice' },
  { value: 'neurology', label: 'Neurology' },
  { value: 'oncology', label: 'Oncology' },
  { value: 'orthopedics', label: 'Orthopedics' },
  { value: 'pediatrics', label: 'Pediatrics' },
  { value: 'ophthalmology', label: 'Ophthalmology' },
];

export const SPECIALTY_ICONS: { [key: string]: LucideIcon } = {
  cardiology: BriefcaseMedical, 
  dentistry: Smile,
  dermatology: Stethoscope, 
  general_practice: Stethoscope,
  neurology: Brain,
  oncology: Stethoscope, 
  orthopedics: Bone,
  pediatrics: Baby,
  ophthalmology: Eye,
};


export const FACILITY_TYPES: FilterOption[] = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'laboratory', label: 'Laboratory' },
  { value: 'diagnostic_center', label: 'Diagnostic Center' },
];

export const FACILITY_TYPE_ICONS: { [key: string]: LucideIcon } = {
  hospital: Hospital,
  clinic: Building,
  pharmacy: BriefcaseMedical, 
  laboratory: BriefcaseMedical, 
  diagnostic_center: BriefcaseMedical, 
};

export const LANGUAGES_SPOKEN: FilterOption[] = [
  { value: 'amharic', label: 'Amharic' },
  { value: 'oromo', label: 'Oromo' },
  { value: 'tigrinya', label: 'Tigrinya' },
  { value: 'somali', label: 'Somali' },
  { value: 'english', label: 'English' },
];

export const LOCATIONS: FilterOption[] = [
  { value: 'addis_ababa', label: 'Addis Ababa' },
  { value: 'adama', label: 'Adama' },
  { value: 'bahir_dar', label: 'Bahir Dar' },
  { value: 'mekelle', label: 'Mekelle' },
  { value: 'hawassa', label: 'Hawassa' },
];

export const DEFAULT_USER_AVATAR = "https://placehold.co/100x100.png";
