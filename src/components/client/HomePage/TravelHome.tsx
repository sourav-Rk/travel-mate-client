import TravelHero from "./TravelHero";
import TravelFeatured from "./TravelFeatured";
import TravelTrending from "./TravelTrending";
import TravelPromo from "./TravelPromo";
import TravelAttractions from "./TravelAttractions";
import TravelReviews from "./TravelReviews";
import TravelPopular from "./TravelPopular";
import IndiaTravelPromo from "./TravelPromoMate";
import PopularDestinations from "./PopularDestinations";
import BookingSteps from "./BookingSteps";
import { useGetTrendingPackagesQuery } from "@/hooks/client/useClientPackage";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/Spinner";
import CircularGallery from "@/components/CircularGallery";
import { useNavigate } from "react-router-dom";
import type { UnifiedPackage } from "@/types/packageType";
export default function TravelHome() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<UnifiedPackage[]>();
  const { data, isLoading } = useGetTrendingPackagesQuery();

  useEffect(() => {
    if (data?.packages) setPackages(data.packages as UnifiedPackage[]);
  }, [data]);

  const galleryItems = packages?.map((pkg) => ({
    image: pkg.images[0], // Use the first image from each package
    text: pkg.title, // Use the title as the text
  }));

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-white">
      <TravelHero />
      <PopularDestinations destinations={packages ?? []} />
      <TravelFeatured featuredTrips={packages ?? []} />
      <IndiaTravelPromo />
      <BookingSteps />
      <TravelTrending />
      <TravelPromo />
      <TravelAttractions topAttractions={packages ?? []} />
      <TravelReviews />
      <div
        onClick={() => navigate("/")}
        style={{ height: "600px", position: "relative" }}
      >
        <CircularGallery
          items={galleryItems}
          bend={3}
          textColor="#2CA4BC"
          borderRadius={0.05}
          scrollSpeed={2}
          scrollEase={0.05}
        />
      </div>
      <TravelPopular popularTours={packages ?? []} />
    </div>
  );
}
