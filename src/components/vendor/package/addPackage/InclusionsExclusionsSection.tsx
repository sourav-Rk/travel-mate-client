import { useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus,X } from "lucide-react";

export default function InclusionsExclusionsSection({
  inclusions,
  exclusions,
  addInclusion,
  removeInclusion,
  addExclusion,
  removeExclusion,
}: any) {
  const [newInclusion, setNewInclusion] = useState("")
  const [newExclusion, setNewExclusion] = useState("")

  const handleAddInclusion = () => {
    addInclusion(newInclusion)
    setNewInclusion("")
  }

  const handleAddExclusion = () => {
    addExclusion(newExclusion)
    setNewExclusion("")
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Label className="text-green-700 font-medium">What's Included</Label>
        <div className="flex gap-2">
          <Input
            value={newInclusion}
            onChange={(e) => setNewInclusion(e.target.value)}
            placeholder="e.g., Accommodation, Meals, Transport"
            className="focus:border-green-400 focus:ring-green-400"
            onKeyPress={(e) => e.key === "Enter" && handleAddInclusion()}
          />
          <Button type="button" onClick={handleAddInclusion} size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {inclusions.map((inclusion: string, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200"
            >
              <span className="text-sm text-green-800">{inclusion}</span>
              <X
                className="h-4 w-4 cursor-pointer text-green-600 hover:text-red-600 transition-colors"
                onClick={() => removeInclusion(index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-red-700 font-medium">What's Not Included</Label>
        <div className="flex gap-2">
          <Input
            value={newExclusion}
            onChange={(e) => setNewExclusion(e.target.value)}
            placeholder="e.g., Personal expenses, Tips"
            className="focus:border-red-400 focus:ring-red-400"
            onKeyPress={(e) => e.key === "Enter" && handleAddExclusion()}
          />
          <Button type="button" onClick={handleAddExclusion} size="sm" className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {exclusions.map((exclusion: string, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200"
            >
              <span className="text-sm text-red-800">{exclusion}</span>
              <X
                className="h-4 w-4 cursor-pointer text-red-600 hover:text-red-700 transition-colors"
                onClick={() => removeExclusion(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
