import TravelHero from "./TravelHero"
import TravelFeatured from "./TravelFeatured"
import TravelTrending from "./TravelTrending"
import TravelPromo from "./TravelPromo"
import TravelAttractions from "./TravelAttractions"
import TravelReviews from "./TravelReviews"
import TravelPopular from "./TravelPopular"
import TravelFooter from "./TravelFooter"
export default function TravelHome() {
  return (
    <div className="min-h-screen bg-white">
      <TravelHero />
      <TravelFeatured />
      <TravelTrending />
      <TravelPromo />
      <TravelAttractions />
      <TravelReviews />
      <TravelPopular />
      <TravelFooter />
    </div>
  )
}
