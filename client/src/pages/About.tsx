import { Award, CheckCircle, Home, Star, User } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { LocalBusinessStructuredData, BreadcrumbStructuredData, FAQStructuredData } from "@/components/StructuredData";

export default function About() {
  const stats = [
    { value: "27+", label: "Years Experience" },
    { value: "650+", label: "Properties Sold" },
    { value: "850+", label: "Happy Clients" },
    { value: "100%", label: "Client Satisfaction" },
  ];

  const testimonials = [
    {
      name: "Maria Rodriguez",
      role: "First-time Homebuyer",
      content: "Working with Valentin made buying my first home a stress-free experience. He was patient, knowledgeable, and always available to answer my questions.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      name: "Carlos Mendez",
      role: "Property Investor",
      content: "I've worked with many realtors, but Valentin's market knowledge and negotiation skills are unmatched. He helped me acquire multiple investment properties in Laredo at great prices.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      name: "Lisa Treviño",
      role: "Home Seller",
      content: "Valentin sold our home in just two weeks for above asking price! His marketing strategy and staging advice made all the difference. Highly recommend!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    }
  ];

  const values = [
    {
      icon: <Star className="w-8 h-8 text-primary" />,
      title: "Excellence",
      description: "We strive to exceed expectations in every transaction, providing exceptional service from start to finish."
    },
    {
      icon: <User className="w-8 h-8 text-primary" />,
      title: "Client Focus",
      description: "Your needs and goals are our top priority. We listen carefully and tailor our approach to your unique situation."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-primary" />,
      title: "Integrity",
      description: "We operate with honesty and transparency, ensuring you have all the information needed to make the best decisions."
    },
    {
      icon: <Home className="w-8 h-8 text-primary" />,
      title: "Community",
      description: "We're deeply invested in Laredo's growth and development, supporting local initiatives and neighborhood improvement."
    }
  ];

  const websiteUrl = "https://ohanarealty.com";

  return (
    <>
      <SEOHead 
        title="About Ohana Realty | Laredo TX Premier Real Estate | Valentin Cuellar"
        description="Learn about Ohana Realty and expert agent Valentin Cuellar. With over 27 years of experience in Laredo's real estate market, we provide personalized service to find your dream property. Explore our story, values, and client testimonials."
        canonicalUrl="/about"
        ogImage={`${websiteUrl}/og-image-about.jpg`}
      />
      
      {/* Business Structured Data */}
      <LocalBusinessStructuredData
        name="Ohana Realty"
        description="Premier real estate agency in Laredo, TX founded by Valentin Cuellar in 2014. Specializing in residential and commercial properties with personalized service and expert local knowledge."
        url={websiteUrl}
        logo={`${websiteUrl}/logo.png`}
        streetAddress="5802 McPherson Rd"
        addressLocality="Laredo"
        addressRegion="TX"
        postalCode="78041"
        telephone="+19567123000"
        email="info@ohanarealty.com"
        priceRange="$$$"
        latitude={27.5629}
        longitude={-99.4805}
        openingHours={[
          "Monday 9:00-18:00",
          "Tuesday 9:00-18:00",
          "Wednesday 9:00-18:00",
          "Thursday 9:00-18:00",
          "Friday 9:00-18:00",
          "Saturday 10:00-15:00"
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
            name: "About",
            item: `${websiteUrl}/about`
          }
        ]}
      />
      
      {/* FAQ Structured Data */}
      <FAQStructuredData
        questions={[
          {
            question: "When was Ohana Realty founded?",
            answer: "Ohana Realty was founded by Valentin Cuellar in 2014 after recognizing the need for a more personalized approach to real estate services in Laredo, Texas."
          },
          {
            question: "What does 'Ohana' mean in your company name?",
            answer: "The name 'Ohana' comes from the Hawaiian term for family, reflecting our belief that real estate is about helping people find their place in the world and creating a sense of family with our clients."
          },
          {
            question: "What areas of real estate does Valentin Cuellar specialize in?",
            answer: "Valentin Cuellar specializes in residential properties, luxury homes, and commercial investments in Laredo. With over 27 years of experience, he has in-depth knowledge of Laredo's neighborhoods, property values, and development trends."
          },
          {
            question: "What values does Ohana Realty operate by?",
            answer: "Ohana Realty operates by four core values: Excellence (exceeding expectations in every transaction), Client Focus (prioritizing client needs), Integrity (maintaining honesty and transparency), and Community (supporting Laredo's growth and development)."
          },
          {
            question: "Is Valentin Cuellar licensed in Texas?",
            answer: "Yes, Valentin Cuellar is a licensed real estate broker in Texas (License #652371) and Ohana Realty is a licensed brokerage with the Texas Real Estate Commission (#9002464)."
          }
        ]}
      />
      <div>
        {/* Hero Section */}
        <div className="bg-primary/10 py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">About Ohana Realty</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              We're dedicated to helping you find your dream home or investment property in Laredo, Texas.
              With deep local knowledge and personalized service, we make real estate simple and rewarding.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/properties">
                <Button size="lg">View Properties</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* About Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-semibold mb-6">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Founded by Valentin Cuellar, Ohana Realty has been serving the Laredo community since 2014. 
                The name "Ohana" comes from the Hawaiian term for family, reflecting our belief that real 
                estate is about helping people find their place in the world.
              </p>
              <p className="text-muted-foreground mb-4">
                After working for several large brokerages, Valentin recognized the need for a more personalized 
                approach to real estate in Laredo. He founded Ohana Realty with the mission of providing expert 
                guidance with a local touch, ensuring every client receives the attention they deserve.
              </p>
              <p className="text-muted-foreground mb-6">
                Today, we continue to build on that foundation, combining in-depth market knowledge with 
                cutting-edge technology to deliver exceptional results for buyers, sellers, and investors in 
                the Laredo area.
              </p>

              <div className="flex items-center gap-4">
                <Award className="w-12 h-12 text-primary" />
                <div>
                  <h3 className="font-serif font-medium text-lg">Licensed Real Estate Brokerage</h3>
                  <p className="text-sm text-muted-foreground">Texas Real Estate Commission #9002464</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                alt="Ohana Realty team" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Meet Our Agent */}
        <div className="bg-card py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-semibold mb-12 text-center">Meet Our Lead Agent</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h3 className="text-2xl font-serif font-medium mb-2">Valentin Cuellar</h3>
                <p className="text-primary font-medium mb-4">Broker & Owner</p>
                
                <p className="text-muted-foreground mb-4">
                  With over 27 years of experience in Laredo real estate, Valentin has developed a reputation for 
                  his detailed market knowledge, negotiation skills, and client-first approach.
                </p>
                
                <p className="text-muted-foreground mb-4">
                  A lifelong resident of Laredo, Valentin has an unmatched understanding of the city's neighborhoods, 
                  property values, and development trends. He specializes in residential properties, luxury homes, 
                  and commercial investments.
                </p>
                
                <p className="text-muted-foreground mb-6">
                  Valentin is active in the Laredo community, serving on the board of the local Habitat for Humanity 
                  chapter and volunteering with several youth education initiatives.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="bg-background px-4 py-2 rounded">
                    <span className="text-sm font-medium">Texas Real Estate License #652371</span>
                  </div>
                  <div className="bg-background px-4 py-2 rounded">
                    <span className="text-sm font-medium">Certified Negotiation Expert</span>
                  </div>
                  <div className="bg-background px-4 py-2 rounded">
                    <span className="text-sm font-medium">Luxury Home Specialist</span>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2 flex justify-center">
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-primary/20">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                    alt="Valentin Cuellar" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-serif font-semibold mb-12 text-center">Our Track Record</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card rounded-lg p-6 shadow-sm">
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-card py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif font-semibold mb-12 text-center">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-background rounded-lg p-6 shadow-sm">
                  <div className="mb-4">{value.icon}</div>
                  <h3 className="text-xl font-serif font-medium mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-serif font-semibold mb-12 text-center">What Our Clients Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card rounded-lg p-6 shadow-sm flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground flex-1">{testimonial.content}</p>
                <div className="flex text-primary mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif font-semibold mb-4">Ready to Find Your Dream Home?</h2>
            <p className="max-w-2xl mx-auto mb-8">
              Let's start your real estate journey together. Contact us today for a consultation
              with Valentin and discover how Ohana Realty can help you achieve your property goals.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary">Contact Us Today</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}