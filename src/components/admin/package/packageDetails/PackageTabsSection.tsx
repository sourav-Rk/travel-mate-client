"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

interface PackageTabsSectionProps {
  inclusions: string[]
  exclusions: string[]
  termsAndConditions: string
  cancellationPolicy: string
}

export function PackageTabsSection({
  inclusions,
  exclusions,
  termsAndConditions,
  cancellationPolicy,
}: PackageTabsSectionProps) {
  return (
    <Card className="border-black shadow-2xl bg-white backdrop-blur-sm overflow-hidden ">
      <CardContent className="p-6">
        <Tabs defaultValue="inclusions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate border border-slate-700">
            <TabsTrigger
              value="inclusions"
              className="data-[state=active]:bg-blue-400 data-[state=active]:text-slate-900 text-slate-400"
            >
              Inclusions
            </TabsTrigger>
            <TabsTrigger
              value="exclusions"
              className="data-[state=active]:bg-blue-400 data-[state=active]:text-slate-900 text-slate-400"
            >
              Exclusions
            </TabsTrigger>
            <TabsTrigger
              value="terms"
              className="data-[state=active]:bg-blue-400 data-[state=active]:text-slate-900 text-slate-400"
            >
              Terms
            </TabsTrigger>
            <TabsTrigger
              value="cancellation"
              className="data-[state=active]:bg-blue-400 data-[state=active]:text-slate-900 text-slate-400"
            >
              Cancellation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inclusions" className="mt-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate mb-4">What's Included</h3>
              <ul className="space-y-2">
                {inclusions.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="exclusions" className="mt-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate mb-4">What's Not Included</h3>
              <ul className="space-y-2">
                {exclusions.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-slate-400">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="terms" className="mt-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate mb-4">Terms & Conditions</h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-400 leading-relaxed">{termsAndConditions}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cancellation" className="mt-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate mb-4">Cancellation Policy</h3>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-400 leading-relaxed">{cancellationPolicy}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
