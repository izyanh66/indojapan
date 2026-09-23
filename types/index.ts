export type CountryCode = 'IN' | 'JP' | 'DE' | 'US' | 'GLOBAL';

export type UserRole = 'MANUFACTURER' | 'SUPPLIER' | 'BRAND_BUYER' | 'JOB_SEEKER' | 'TECH_PARTNER';

export type PostCategory = 'ALL' | 'INJP' | 'REQUIREMENTS' | 'INNOVATIONS' | 'ALERTS' | 'MACHINERY' | 'SUSTAINABLE';

export interface Author {
  id: string;
  name: string;
  role: UserRole;
  companyName: string;
  country: CountryCode;
  countryName: string;
  avatar: string;
  isVerified: boolean;
  trustScore: number;
  location: string;
  badgeText?: string;
}

export interface MetricHighlight {
  label: string;
  value: string;
  isPositive: boolean;
}

export interface PostMedia {
  type: 'video' | 'photo';
  url: string;
  thumbnailUrl: string;
  duration?: string;
  resolution?: string;
  title: string;
  viewCount: string;
}

export interface Post {
  id: string;
  author: Author;
  timestamp: string;
  category: PostCategory;
  categoryLabel: string;
  corridorBadge?: string;
  content: string;
  media?: PostMedia;
  metrics?: MetricHighlight;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  hasMeetingOption: boolean;
  meetingAvailability?: string;
}

export interface MeetingBooking {
  id: string;
  postId?: string;
  hostId: string;
  hostName: string;
  hostCompany: string;
  hostCountry: CountryCode;
  guestName: string;
  guestCompany: string;
  guestEmail: string;
  guestCountry: CountryCode;
  date: string;
  timeSlot: string;
  timeIST: string;
  timeJST: string;
  topic: string;
  meetingType: 'VIRTUAL_FACTORY_TOUR' | 'CAD_REVIEW' | 'RFQ_NEGOTIATION' | 'TECH_TRANSFER';
  ndaRequired: boolean;
  notes: string;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED';
}

export interface RFQItem {
  id: string;
  title: string;
  buyerCompany: string;
  buyerCountry: CountryCode;
  buyerVerified: boolean;
  category: string;
  material: string;
  quantity: string;
  targetBudget: string;
  tolerance: string;
  leadTime: string;
  cadFileAttached: boolean;
  cadFileName?: string;
  description: string;
  tags: string[];
  bidsCount: number;
  postedDate: string;
  status: 'OPEN' | 'BIDDING' | 'AWARDED';
  isSustainableRequest?: boolean;
  isBilateralCorridor?: boolean;
}

export interface BusinessEntity {
  id: string;
  name: string;
  legalEntity: string;
  country: CountryCode;
  city: string;
  isVerified: boolean;
  trustScore: number;
  primaryCategory: string;
  capabilities: string[];
  materials: string[];
  machineryCount: number;
  activeLines: number;
  spareCapacityHours: number;
  certifications: string[];
  sustainableRating: string; // e.g. "A+ EcoVadis (68% green energy)"
  carbonFootprintReduction: string;
  logo: string;
  coverImage: string;
  about: string;
  corridorPartnerStatus: 'ACTIVE_JETRO_MOU' | 'IN_PROGRESS' | 'STANDARD';
  featuredMachinery: {
    model: string;
    specs: string;
    status: 'ACTIVE' | 'SPARE_CAPACITY' | 'MAINTENANCE';
  }[];
}

export interface OpportunityItem {
  id: string;
  title: string;
  type: 'SUPPLIER_NEED' | 'CAPACITY_ALERT' | 'JOB_ROLE' | 'PARTNERSHIP_PROPOSAL';
  company: string;
  country: CountryCode;
  timeAgo: string;
  matchScore: number;
  description: string;
  tags: string[];
  actionLabel: string;
}

export interface MarketInsight {
  id: string;
  material: string;
  pricePerKg: string;
  change24h: string;
  isUp: boolean;
  trendSummary: string;
  aiDemandForecast: string;
  sustainableAlternative: string;
}
