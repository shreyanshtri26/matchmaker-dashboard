// Base entity with common fields
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User types
export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'matchmaker' | 'customer';
  isActive: boolean;
  lastLogin?: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    matches: boolean;
    messages: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'matches-only';
    showContactInfo: boolean;
  };
}

// Customer types
export interface Customer extends BaseEntity {
  userId: string;
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'avatar'>;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  dateOfBirth: string; // ISO date string
  phoneNumber?: string;
  country: string;
  city: string;
  height: number; // in cm
  income?: number;
  undergraduateCollege?: string;
  degree?: string;
  currentCompany?: string;
  designation?: string;
  maritalStatus: 'single' | 'divorced' | 'widowed' | 'separated' | 'never-married';
  languages: string[];
  siblings?: number;
  caste?: string;
  religion?: string;
  wantKids: 'yes' | 'no' | 'maybe';
  openToRelocate: 'yes' | 'no' | 'maybe';
  openToPets: 'yes' | 'no' | 'maybe';
  bio?: string;
  interests?: string[];
  profilePicture?: string;
  gallery?: string[];
  status: 'active' | 'pending' | 'inactive' | 'suspended';
  matchCount: number;
  lastMatchDate?: string; // ISO date string
  preferences?: CustomerPreferences;
  verificationStatus: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    backgroundCheck: boolean;
  };
}

export interface CustomerPreferences {
  ageRange: {
    min: number;
    max: number;
  };
  heightRange: {
    min: number; // in cm
    max: number; // in cm
  };
  incomeRange?: {
    min?: number;
    max?: number;
  };
  maritalStatus?: ('single' | 'divorced' | 'widowed' | 'separated' | 'never-married')[];
  hasChildren?: 'yes' | 'no' | 'any';
  wantsChildren?: 'yes' | 'no' | 'maybe';
  educationLevel?: string[];
  occupation?: string[];
  location?: {
    countries?: string[];
    cities?: string[];
    openToRelocation: boolean;
  };
  religiousPreferences?: {
    religion?: string[];
    practiceLevel?: 'not-important' | 'somewhat-important' | 'very-important';
  };
  lifestyle?: {
    diet?: string[];
    drinks?: string[];
    smokes?: string[];
    exercise?: string[];
  };
}

// Match types
export interface Match extends BaseEntity {
  customerId: string;
  customer: Pick<Customer, 'id' | 'firstName' | 'lastName' | 'profilePicture'>;
  matchId: string;
  match: Pick<Customer, 'id' | 'firstName' | 'lastName' | 'profilePicture'>;
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn' | 'expired';
  matchScore: number;
  compatibility: {
    values: number;
    lifestyle: number;
    interests: number;
    [key: string]: number;
  };
  notes?: string;
  lastContacted?: string; // ISO date string
  nextFollowUp?: string; // ISO date string
  messages?: Message[];
}

export interface MatchSuggestion {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  location: string;
  education: string;
  occupation: string;
  matchScore: number;
  compatibility: {
    values: number;
    lifestyle: number;
    interests: number;
    [key: string]: number;
  };
  lastActive: string;
  photo?: string;
  profileCompletion: number;
  commonInterests?: string[];
  distance?: number; // in km
}

// Message types
export interface Message extends BaseEntity {
  senderId: string;
  receiverId: string;
  matchId: string;
  content: string;
  isRead: boolean;
  attachments?: string[];
}

// Activity types
export interface Activity extends BaseEntity {
  userId: string;
  type: 'login' | 'logout' | 'profile_view' | 'profile_edit' | 'match_sent' | 'match_accepted' | 'match_rejected' | 'message_sent' | 'note_added';
  description: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

// Report types
export interface MatchReport {
  id: string;
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  totalMatches: number;
  successfulMatches: number;
  pendingMatches: number;
  rejectedMatches: number;
  averageMatchScore: number;
  matchmakerPerformance: Array<{
    matchmakerId: string;
    name: string;
    totalMatches: number;
    successfulMatches: number;
    successRate: number;
  }>;
  popularLocations: Array<{
    location: string;
    count: number;
  }>;
  commonInterests: string[];
  status: 'pending' | 'completed' | 'failed';
  downloadUrl?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface CustomerFormData extends Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'user' | 'userId' | 'status' | 'matchCount' | 'verificationStatus'> {
  // Add any form-specific fields or overrides here
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Nullable<T> = T | null;

// Enum-like objects
export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
] as const;

export const MARITAL_STATUSES = [
  { value: 'single', label: 'Single' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'separated', label: 'Separated' },
  { value: 'never-married', label: 'Never Married' },
] as const;

export const YES_NO_MAYBE = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'maybe', label: 'Maybe' },
] as const;

// Shared types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  // Add other customer fields as needed
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  // Add other filter/sort params as needed
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
