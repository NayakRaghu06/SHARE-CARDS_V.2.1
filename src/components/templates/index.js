// Template exports for easy importing
export { default as ClassicTemplate } from './ClassicTemplate';
export { default as ModernTemplate } from './ModernTemplate';
export { default as DarkTemplate } from './DarkTemplate';

export const TEMPLATES = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Professional and traditional business card layout',
    colorScheme: 'blue',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with vibrant gradient background',
    colorScheme: 'purple-gradient',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Elegant dark mode design with gold accents',
    colorScheme: 'dark-gold',
  },
];
