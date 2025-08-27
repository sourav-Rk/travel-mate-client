import TravelHero from "./TravelHero"
import TravelFeatured from "./TravelFeatured"
import TravelTrending from "./TravelTrending"
import TravelPromo from "./TravelPromo"
import TravelAttractions from "./TravelAttractions"
import TravelReviews from "./TravelReviews"
import TravelPopular from "./TravelPopular"
import IndiaTravelPromo from "./TravelPromoMate"
import PopularDestinations from "./PopularDestinations"
import BookingSteps from "./BookingSteps"
import { useGetTrendingPackagesQuery } from "@/hooks/client/useClientPackage"
import { useEffect, useState } from "react"
import type { PackageDetails } from "@/hooks/vendor/usePackage"
import { Spinner } from "@/components/Spinner"
export default function TravelHome() {
  
  const [packages,setPackages] = useState<PackageDetails[]>();
  const {data,isLoading} = useGetTrendingPackagesQuery();

  useEffect(() => {
     if(!data) return;
     setPackages(data.packages);
  });

  if(isLoading) return <Spinner/>

  
  return (
    <div className="min-h-screen bg-white">
      <TravelHero />
      <PopularDestinations destinations={packages ?? []}/>
      <TravelFeatured featuredTrips={packages ?? []} />
      <IndiaTravelPromo/>
      <BookingSteps/>
      <TravelTrending />
      <TravelPromo />
      <TravelAttractions topAttractions={packages ?? []}/>
      <TravelReviews />
      <TravelPopular popularTours={packages ?? []}/>
    </div>
  )
}
