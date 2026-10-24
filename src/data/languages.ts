import { Language } from '../types';

export const INDIAN_LANGUAGES: Language[] = [
  { code: 'en', bcp47: 'en-IN', name: 'English', nativeName: 'English' },
  { code: 'kn', bcp47: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'hi', bcp47: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', bcp47: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', bcp47: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', bcp47: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'mr', bcp47: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', bcp47: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', bcp47: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', bcp47: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'or', bcp47: 'or-IN', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'ur', bcp47: 'ur-IN', name: 'Urdu', nativeName: 'اردو', isRTL: true },
  { code: 'as', bcp47: 'as-IN', name: 'Assamese', nativeName: 'অসমীয়া' },
];

export const DEFAULT_LANGUAGE = INDIAN_LANGUAGES[0]; // English by default, or Kannada/Hindi
