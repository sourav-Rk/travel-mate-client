import { MapPin } from "lucide-react"

export default function TravelFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#2CA4BC] rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold">TravelMate</span>
            </div>
            <p className="text-gray-400">Your trusted partner for unforgettable travel experiences around the globe.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-[#2CA4BC] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2CA4BC] transition-colors">
                  Destinations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2CA4BC] transition-colors">
                  Tours
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2CA4BC] transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-[#2CA4BC] transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2CA4BC] transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2CA4BC] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2CA4BC] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <p>📧 info@travelco.com</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 123 Travel Street, City, Country</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TravelCo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
