// Simple PostCSS configuration - ignoring the warning since it's non-critical for deployment
import tailwindcss from '@tailwindcss/vite';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss,
    autoprefixer
  ]
};