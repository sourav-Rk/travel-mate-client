"use client";

export default function SignupHero() {
  return (
    <div className="hidden lg:block space-y-6">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 bg-clip-text text-transparent">
          Travel Mate
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Discover amazing destinations, create unforgettable memories,
          and explore the world with our curated travel packages.
        </p>
      </div>

      <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
        <img
          src="/neom-eOWabmCNEdg-unsplash.jpg"
          alt="Travel destination"
          className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h3 className="text-2xl font-semibold mb-2">
            Your Adventure Awaits
          </h3>
          <p className="text-sm opacity-90">
            Join thousands of travelers exploring the world
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">50K+</div>
          <div className="text-sm text-gray-600">Happy Travelers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-600">200+</div>
          <div className="text-sm text-gray-600">Destinations</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">15K+</div>
          <div className="text-sm text-gray-600">Travel Packages</div>
        </div>
      </div>
    </div>
  );
}
