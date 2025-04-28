// Import plugins
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Export configuration with explicit `from` option
export default {
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
  // Fix for "from option missing" warning
  from: undefined,
  to: undefined,
  map: false,
};