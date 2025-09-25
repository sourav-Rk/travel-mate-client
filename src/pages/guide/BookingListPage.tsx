"use client"
import { BookingListGuide } from "@/components/guide/bookings/BookingListGuide";

export default function BookingListGuidePage() {
  return (
     <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="hidden md:flex md:w-64 bg-gray-100 p-4">
            {/* Replace this with your real Sidebar component */}
            <nav className="w-full">
              <ul className="space-y-4">
                <li className="font-semibold text-gray-700">Dashboard</li>
                <li className="text-gray-600">Bookings</li>
                <li className="text-gray-600">Payments</li>
              </ul>
            </nav>
          </aside>
    
          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-white overflow-auto">
            <BookingListGuide />
          </main>
        </div>
  );
}