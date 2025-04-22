import ContactForm from './contact/ContactForm';
import ContactInfo from './contact/ContactInfo';
import { useDarkMode } from '@/hooks/use-dark-mode';

interface ContactSectionProps {
  hideTitle?: boolean;
  propertyInquiry?: string;
}

/**
 * ContactSection component that displays contact information and a contact form
 * Refactored into smaller, more manageable components for better maintainability
 */
export default function ContactSection({ hideTitle = false, propertyInquiry }: ContactSectionProps) {
  const isDarkMode = useDarkMode();
  
  return (
    <section id="contact" className={`py-16 ${isDarkMode ? 'bg-background' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        {!hideTitle && (
          <div className="text-center mb-12">
            <h2 className={`font-serif text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-neutral-800'} mb-4`}>
              Contact Valentin Cuellar
            </h2>
            <p className={`${isDarkMode ? 'text-slate-300' : 'text-neutral-600'} max-w-2xl mx-auto`}>
              Whether you're looking to buy, sell, or simply have questions about the Laredo real estate market, 
              Valentin is here to help.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ContactInfo isDarkMode={isDarkMode} />
          <ContactForm isDarkMode={isDarkMode} propertyInquiry={propertyInquiry} />
        </div>
      </div>
    </section>
  );
}
