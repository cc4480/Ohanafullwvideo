import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function AboutRealtor() {
  return (
    <section id="about" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-sm font-medium text-primary uppercase tracking-wider">About Your Realtor</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-800 mt-2 mb-6">Valentin Cuellar</h2>
            <p className="text-neutral-600 mb-6">
              With extensive knowledge of the Laredo real estate market, Valentin Cuellar provides expert guidance to clients seeking to buy or sell properties in the area. His commitment to understanding each client's unique needs ensures a personalized approach to every transaction.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="bg-primary-light bg-opacity-10 p-2 rounded-full mr-4">
                  <i className='bx bx-check text-primary text-xl'></i>
                </div>
                <p className="text-neutral-700">Extensive knowledge of Laredo neighborhoods</p>
              </div>
              <div className="flex items-center">
                <div className="bg-primary-light bg-opacity-10 p-2 rounded-full mr-4">
                  <i className='bx bx-check text-primary text-xl'></i>
                </div>
                <p className="text-neutral-700">Personalized property matching service</p>
              </div>
              <div className="flex items-center">
                <div className="bg-primary-light bg-opacity-10 p-2 rounded-full mr-4">
                  <i className='bx bx-check text-primary text-xl'></i>
                </div>
                <p className="text-neutral-700">Expert negotiation skills</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/#contact">
                <Button className="w-full sm:w-auto">
                  Contact Valentin
                </Button>
              </Link>
              <a href="tel:+19567123000">
                <Button variant="outline" className="border-primary w-full sm:w-auto">
                  <i className='bx bx-phone mr-2'></i>
                  Call: 956-712-3000
                </Button>
              </a>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1374&auto=format&fit=crop" 
                alt="Valentin Cuellar" 
                className="rounded-lg shadow-lg w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="flex gap-1 text-secondary">
                    <i className='bx bxs-star'></i>
                    <i className='bx bxs-star'></i>
                    <i className='bx bxs-star'></i>
                    <i className='bx bxs-star'></i>
                    <i className='bx bxs-star-half'></i>
                  </div>
                  <p className="ml-2 text-neutral-800 font-medium">4.8/5</p>
                </div>
                <p className="text-neutral-600 text-sm">Based on 42 client reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
