import React from "react";

interface FeaturedAirbnbRentalsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
}

export function FeaturedAirbnbRentals({
  title = "Featured Vacation Rentals",
  subtitle = "Experience luxury and comfort in our hand-picked vacation rentals",
  limit
}: FeaturedAirbnbRentalsProps) {
  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      {/* Video component using direct HTML */}
      <div className="w-full max-w-4xl mx-auto h-[60vh] overflow-hidden relative rounded-lg">
        <div 
          className="w-full h-full"
          dangerouslySetInnerHTML={{
            __html: `
              <video
                style="width: 100%; height: 100%; object-fit: cover;"
                src="/OHANAVIDEOMASTER.mp4"
                muted
                autoplay
                loop
                playsinline
                controls
              ></video>
            `
          }}
        />
      </div>
    </section>
  );
}

export default FeaturedAirbnbRentals;