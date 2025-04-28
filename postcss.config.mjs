// PostCSS Configuration
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Configuration with explicit options to suppress warnings
export default {
  plugins: [
    tailwindcss,
    autoprefixer
  ],
  // Add these options to prevent the 'from' option warning
  from: undefined,
  to: undefined,
  map: { inline: false }
};