import { Neighborhood } from "@shared/schema";

interface NeighborhoodCardProps {
  neighborhood: Neighborhood;
}

export default function NeighborhoodCard({ neighborhood }: NeighborhoodCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md group">
      <div className="h-48 overflow-hidden">
        <img 
          src={neighborhood.image} 
          alt={neighborhood.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl font-bold text-neutral-800 mb-2">
          {neighborhood.name}
        </h3>
        <p className="text-neutral-600 mb-4">
          {neighborhood.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {neighborhood.features?.map((feature, index) => (
            <span 
              key={index} 
              className="bg-neutral-100 text-neutral-700 text-sm px-3 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
        <a href="#" className="flex items-center text-primary font-medium hover:text-primary-dark">
          Learn More
          <i className='bx bx-right-arrow-alt ml-1'></i>
        </a>
      </div>
    </div>
  );
}
