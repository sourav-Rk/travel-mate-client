"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { GuideCard } from "./GuideCard"
import { GuidesSearchFilter } from "./GuideSearchFilter"
import {  useMemo } from "react"
import type { GuideListDto } from "@/types/api/guide"

interface GuidesListProps {
  guides: GuideListDto[]; // ideally type your guide
  onAssignGuide: (guideId: string) => void;
  isAssigning?: boolean;
  filters: {
    searchTerm: string;   
    languages: string[];
    minExperience: number;
    maxExperience: number;
    gender: string;
  };
  onFiltersChange: (filters: any) => void;
}


export function GuidesList({ guides, onAssignGuide, isAssigning = false,onFiltersChange }: GuidesListProps) {


  const availableLanguages = useMemo(() => {
    const languages = new Set<string>()
    guides.forEach((guide) => {
      guide.languageSpoken.forEach((lang : string) => languages.add(lang))
    })
    return Array.from(languages).sort()
  }, [guides])

  return (
    <div>
      <GuidesSearchFilter
        onFiltersChange={onFiltersChange}
        availableLanguages={availableLanguages}
        totalGuides={guides.length}
        filteredCount={guides.length}
      />

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Available Guides
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {guides.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {guides.length === 0 ? "No guides available" : "No guides match your filters"}
              </p>
              {guides.length > 0 && guides.length === 0 && (
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Available Guides First */}
              {guides.map((guide) => (
                <GuideCard key={guide._id} guide={guide} onAssign={onAssignGuide} isAssigning={isAssigning} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
