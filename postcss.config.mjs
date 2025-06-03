// PostCSS Configuration
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Configuration with explicit options to suppress warnings
export default {
  plugins: [
    tailwindcss,
    autoprefixer
  ],
  // Proper PostCSS options to prevent warnings
  parser: false,
  map: false,
  from: undefined,
  to: undefined
};