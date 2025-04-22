import React from 'react';

interface ContactInfoProps {
  isDarkMode: boolean;
}

export default function ContactInfo({ isDarkMode }: ContactInfoProps) {
  return (
    <div>
      <span className="text-sm font-medium text-primary uppercase tracking-wider">Get in Touch</span>
      <h2 className={`font-serif text-3xl md:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-neutral-800'} mt-2 mb-6`}>
        Contact Valentin Cuellar
      </h2>
      <p className={`${isDarkMode ? 'text-slate-300' : 'text-neutral-600'} mb-8`}>
        Whether you're looking to buy, sell, or simply have questions about the Laredo real estate market, 
        Valentin is here to help.
      </p>
      
      <div className="space-y-6 mb-8">
        <div className="flex items-start">
          <div className={`${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'} p-3 rounded-full mr-4`}>
            <i className='bx bx-map text-primary'></i>
          </div>
          <div>
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-neutral-800'} mb-1`}>Office Address</h3>
            <p className={isDarkMode ? 'text-slate-300' : 'text-neutral-600'}>505 Shiloh Dr, Apt 201<br />Laredo, TX 78045</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className={`${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'} p-3 rounded-full mr-4`}>
            <i className='bx bx-phone text-primary'></i>
          </div>
          <div>
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-neutral-800'} mb-1`}>Phone</h3>
            <p className={isDarkMode ? 'text-slate-300' : 'text-neutral-600'}>
              Office: <a href="tel:+19567123000" className="hover:text-primary">956-712-3000</a>
            </p>
            <p className={isDarkMode ? 'text-slate-300' : 'text-neutral-600'}>
              Mobile: <a href="tel:+19563246714" className="hover:text-primary">956-324-6714</a>
            </p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className={`${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'} p-3 rounded-full mr-4`}>
            <i className='bx bx-time text-primary'></i>
          </div>
          <div>
            <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-neutral-800'} mb-1`}>Business Hours</h3>
            <p className={isDarkMode ? 'text-slate-300' : 'text-neutral-600'}>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className={isDarkMode ? 'text-slate-300' : 'text-neutral-600'}>Saturday: 10:00 AM - 4:00 PM</p>
            <p className={isDarkMode ? 'text-slate-300' : 'text-neutral-600'}>Sunday: By appointment</p>
          </div>
        </div>
      </div>
      
      <SocialLinks isDarkMode={isDarkMode} />
    </div>
  );
}

interface SocialLinksProps {
  isDarkMode: boolean;
}

function SocialLinks({ isDarkMode }: SocialLinksProps) {
  return (
    <div className="flex space-x-4">
      <a 
        href="#" 
        className={`${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'} p-3 rounded-full text-primary hover:bg-primary hover:text-white transition`}
        aria-label="Facebook"
      >
        <i className='bx bxl-facebook text-xl'></i>
      </a>
      <a 
        href="#" 
        className={`${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'} p-3 rounded-full text-primary hover:bg-primary hover:text-white transition`}
        aria-label="Instagram"
      >
        <i className='bx bxl-instagram text-xl'></i>
      </a>
      <a 
        href="#" 
        className={`${isDarkMode ? 'bg-primary/20' : 'bg-primary/10'} p-3 rounded-full text-primary hover:bg-primary hover:text-white transition`}
        aria-label="LinkedIn"
      >
        <i className='bx bxl-linkedin text-xl'></i>
      </a>
    </div>
  );
}