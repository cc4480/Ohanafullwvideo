import ContactSection from "@/components/features/ContactSection";
import { Briefcase, Mail, MapPin, Phone } from "lucide-react";
import SEOHead from "@/components/SEOHead";
import { LocalBusinessStructuredData, BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";

export default function Contact() {
  const websiteUrl = "https://ohanarealty.com";

  return (
    <>
      <SEOHead 
        title="Contact Ohana Realty | Laredo TX Real Estate Agency | Valentin Cuellar"
        description="Contact Valentin Cuellar at Ohana Realty for all your real estate needs in Laredo, TX. Visit our office at 5702 McPherson Rd, call us at (956) 324-6714, or fill out our online form for prompt assistance."
        canonicalUrl="/contact"
        ogImage={`${websiteUrl}/og-image-contact.jpg`}
      />
      
      {/* Business Structured Data with enhanced contact info */}
      <LocalBusinessStructuredData
        name="Ohana Realty"
        description="Premier real estate agency in Laredo, TX offering personalized service for buying, selling, and renting properties. Contact Valentin Cuellar for expert assistance with residential and commercial real estate."
        url={websiteUrl}
        logo={`${websiteUrl}/logo.png`}
        streetAddress="5702 McPherson Rd, Suite 9"
        addressLocality="Laredo"
        addressRegion="TX"
        postalCode="78041"
        telephone="+19563246714"
        email="valentin_cuellar@hotmail.com"
        priceRange="$$$"
        latitude={27.5454625}
        longitude={-99.4785054}
        openingHours={[
          "Monday 9:00-18:00",
          "Tuesday 9:00-18:00",
          "Wednesday 9:00-18:00",
          "Thursday 9:00-18:00",
          "Friday 9:00-18:00",
          "Saturday 10:00-16:00"
        ]}
        sameAs={[
          "https://www.facebook.com/ohanarealty",
          "https://www.instagram.com/ohanarealty",
          "https://www.linkedin.com/company/ohana-realty"
        ]}
      />
      
      {/* Breadcrumb Structured Data */}
      <BreadcrumbStructuredData
        items={[
          {
            name: "Home",
            item: websiteUrl
          },
          {
            name: "Contact",
            item: `${websiteUrl}/contact`
          }
        ]}
      />
      
      {/* FAQ Structured Data */}
      <FAQStructuredData
        questions={[
          {
            question: "What's the best way to contact Ohana Realty?",
            answer: "The best way to contact Ohana Realty is by calling Valentin Cuellar directly at (956) 324-6714, sending an email to valentin_cuellar@hotmail.com, or using the contact form on our website. You can also visit our office at 5702 McPherson Rd, Suite 9, Laredo, TX 78041 during business hours."
          },
          {
            question: "What are Ohana Realty's office hours?",
            answer: "Ohana Realty is open Monday through Friday from 9AM to 6PM, Saturday from 10AM to 4PM, and Sunday by appointment only. We're flexible and can arrange meetings outside these hours when necessary to accommodate your schedule."
          },
          {
            question: "How quickly will Ohana Realty respond to my inquiry?",
            answer: "Ohana Realty prides itself on responsive service. We typically respond to all inquiries within 2 business hours during normal business hours. For inquiries received after hours, we'll respond by the next business day."
          },
          {
            question: "Can I schedule a property viewing through the contact form?",
            answer: "Yes, you can request a property viewing through our contact form. Simply mention the specific property address or MLS number you're interested in, along with your preferred dates and times, and Valentin will contact you to confirm the appointment."
          },
          {
            question: "Do I need to make an appointment to visit your office?",
            answer: "While walk-ins are welcome during regular business hours, we recommend scheduling an appointment to ensure Valentin is available to meet with you and can prepare relevant property information based on your specific needs and interests."
          }
        ]}
      />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Contact Us</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about a property or need assistance with your real estate journey? 
            Get in touch with Valentin Cuellar at Ohana Realty. We're here to help you find your dream home in Laredo, TX.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif font-medium text-xl mb-2">Call Us</h3>
            <p className="text-muted-foreground mb-4">Speak directly with Valentin</p>
            <a href="tel:+19563246714" className="text-primary hover:underline">
              (956) 324-6714
            </a>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif font-medium text-xl mb-2">Email Us</h3>
            <p className="text-muted-foreground mb-4">Send us your inquiry anytime</p>
            <a href="mailto:valentin_cuellar@hotmail.com" className="text-primary hover:underline">
              valentin_cuellar@hotmail.com
            </a>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-serif font-medium text-xl mb-2">Office Hours</h3>
            <p className="text-muted-foreground mb-4">When you can visit us</p>
            <p>Monday - Friday: 9AM - 6PM</p>
            <p>Saturday: 10AM - 4PM</p>
            <p>Sunday: By appointment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-serif font-semibold mb-4">Office Location</h2>
              <div className="flex items-start gap-3 mb-2">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p>5702 McPherson Rd, Suite 9<br />Laredo, TX 78041</p>
              </div>
            </div>

            <div className="aspect-video w-full rounded-lg overflow-hidden border shadow-sm">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3601.5794065365126!2d-99.4785054!3d27.5454625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8661209c98bf4575%3A0x7ae365eb49d8866d!2s5702%20McPherson%20Rd%2C%20Laredo%2C%20TX%2078041!5e0!3m2!1sen!2sus!4v1650294322752!5m2!1sen!2sus"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>

          <div className="bg-card rounded-lg p-8 shadow-md">
            <ContactSection hideTitle={true} />
          </div>
        </div>
      </div>
    </>
  );
}