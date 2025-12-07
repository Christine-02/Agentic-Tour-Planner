// API Configuration
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const AI_API_BASE_URL =
  process.env.REACT_APP_AI_API_URL || 'http://localhost:8000';

// App Configuration
export const APP_NAME = 'TourPlanner';
export const APP_VERSION = '1.0.0';

// Theme Colors
export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#6366f1',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },
};

// Animation Configuration
export const ANIMATIONS = {
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.6,
  },
  easing: {
    easeOut: 'easeOut',
    easeInOut: 'easeInOut',
  },
};

// Interest Categories
export const INTEREST_CATEGORIES = [
  { value: 'museums', label: 'Museums & Art', icon: '🎨' },
  { value: 'food', label: 'Food & Dining', icon: '🍽️' },
  { value: 'nature', label: 'Nature & Outdoors', icon: '🌿' },
  { value: 'history', label: 'History & Culture', icon: '🏛️' },
  { value: 'nightlife', label: 'Nightlife & Entertainment', icon: '🌃' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'adventure', label: 'Adventure & Sports', icon: '🏔️' },
  { value: 'photography', label: 'Photography', icon: '📸' },
  { value: 'architecture', label: 'Architecture', icon: '🏗️' },
  { value: 'beaches', label: 'Beaches & Water', icon: '🏖️' },
];

// Budget Options
export const BUDGET_OPTIONS = [
  { value: 'budget', label: 'Budget ($500-1000)', range: [500, 1000] },
  { value: 'mid-range', label: 'Mid-range ($1000-2500)', range: [1000, 2500] },
  { value: 'luxury', label: 'Luxury ($2500+)', range: [2500, 10000] },
];

// Day Hours Options
export const DAY_HOURS_OPTIONS = [
  { value: 6, label: '6 hours (Relaxed)' },
  { value: 8, label: '8 hours (Balanced)' },
  { value: 10, label: '10 hours (Active)' },
  { value: 12, label: '12 hours (Intensive)' },
];

// Trip Status
export const TRIP_STATUS = {
  PLANNED: 'planned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Category Colors for Itinerary Items
export const CATEGORY_COLORS = {
  Landmarks: 'blue',
  Museums: 'purple',
  Architecture: 'green',
  Neighborhoods: 'orange',
  Food: 'red',
  Nature: 'teal',
  Entertainment: 'pink',
  Shopping: 'yellow',
  Adventure: 'cyan',
  Photography: 'indigo',
};

// Weather Conditions
export const WEATHER_CONDITIONS = {
  sunny: { icon: '☀️', color: 'yellow' },
  cloudy: { icon: '☁️', color: 'gray' },
  rainy: { icon: '🌧️', color: 'blue' },
  stormy: { icon: '⛈️', color: 'purple' },
  snowy: { icon: '❄️', color: 'cyan' },
};

// Alert Types
export const ALERT_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ALERT: 'alert',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'tour_planner_user_preferences',
  SAVED_TRIPS: 'tour_planner_saved_trips',
  RECENT_SEARCHES: 'tour_planner_recent_searches',
};

// Default Values
export const DEFAULTS = {
  DAY_HOURS: 8,
  TRAVELERS: 1,
  BUDGET: 'mid-range',
  INTERESTS: [],
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    'Unable to connect to the server. Please check your internet connection.',
  API_ERROR: 'Something went wrong. Please try again later.',
  VALIDATION_ERROR: 'Please fill in all required fields.',
  OPENAI_API_KEY_MISSING:
    'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  TRIP_CREATED: 'Your trip has been created successfully!',
  TRIP_UPDATED: 'Your trip has been updated successfully!',
  TRIP_DELETED: 'Your trip has been deleted successfully!',
  ITINERARY_UPDATED: 'Your itinerary has been updated successfully!',
};

// Feature Flags
export const FEATURES = {
  GROUP_PLANNING: true,
  WEATHER_ALERTS: true,
  DRAG_AND_DROP: true,
  REAL_TIME_UPDATES: true,
  SOCIAL_SHARING: true,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  API: 'YYYY-MM-DD',
  FULL: 'dddd, MMMM DD, YYYY',
};

// Time Formats
export const TIME_FORMATS = {
  DISPLAY: 'HH:mm',
  API: 'HH:mm:ss',
  TWELVE_HOUR: 'h:mm A',
};
