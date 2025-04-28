// PostCSS Configuration with fixed warning handling for enterprise-grade SEO
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Create a function that handles the "from" warning by modifying plugins
const createPlugin = (plugin, options = {}) => {
  const createdPlugin = plugin(options);
  
  // Add a postcssPlugin property if it doesn't exist
  if (!createdPlugin.postcssPlugin) {
    createdPlugin.postcssPlugin = plugin.postcssPlugin || plugin.name || 'anonymous-plugin';
  }
  
  // Create a proxy around the original process method that adds the "from" option
  const originalProcess = createdPlugin.process;
  if (originalProcess) {
    createdPlugin.process = (css, processOptions, pluginOptions) => {
      const opts = processOptions || {};
      if (!opts.from) opts.from = 'input.css';
      return originalProcess(css, opts, pluginOptions);
    };
  }
  
  return createdPlugin;
};

// Apply tailwind first, then autoprefixer
export default {
  plugins: [
    createPlugin(tailwindcss, {
      config: './tailwind.config.ts'
    }),
    createPlugin(autoprefixer, {
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'not dead',
        'Safari >= 12',
        'iOS >= 12',
        'not ie 11'
      ],
      grid: 'autoplace'
    })
  ],
  // Remove the properties that may cause warnings
  map: { 
    inline: false,
    annotation: true
  }
};