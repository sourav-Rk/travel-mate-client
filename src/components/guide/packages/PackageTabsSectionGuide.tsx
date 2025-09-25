"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PackageItinerary } from "./PackageItineraryGuide"
import { PackageSummary } from "./PackageSummary"
import type { TravelPackage } from "@/types/packageType"

interface PackageTabsSectionProps {
  packageData: TravelPackage
}

export function PackageTabsSection({ packageData }: PackageTabsSectionProps) {
  const [activeTab, setActiveTab] = useState("itinerary")

  return (
    <Card className="border-[#2CA4BC]/30 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-slate-100 to-slate-200 border-b border-slate-300 rounded-none h-14">
            <TabsTrigger
              value="itinerary"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2CA4BC] data-[state=active]:to-[#1a5f6b] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-base font-medium"
            >
              Detailed Itinerary
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2CA4BC] data-[state=active]:to-[#1a5f6b] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-base font-medium"
            >
              Package Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="itinerary" className="p-6 m-0">
            <PackageItinerary packageData={packageData} />
          </TabsContent>

          <TabsContent value="summary" className="p-6 m-0">
            <PackageSummary packageData={packageData} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
