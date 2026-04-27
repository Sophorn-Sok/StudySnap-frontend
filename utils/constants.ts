// Constants for the application
export const API_ENDPOINTS = {
  AUTH: '/auth',
  NOTES: '/notes',
  FLASHCARDS: '/flashcards',
  MEETINGS: '/meetings',
  USERS: '/users',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  NOTES: '/notes',
  NOTE_NEW: '/notes/new',
  FLASHCARDS: '/flashcards',
  MEETINGS: '/meetings',
  ANALYTICS: '/analytics',
  PRICING: '/pricing',
  SETTINGS: '/settings',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
};

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
};
