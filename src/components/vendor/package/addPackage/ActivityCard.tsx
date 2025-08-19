import { Card,CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X,Clock } from "lucide-react";


export default function ActivityCard({ activity, activityIndex, updateActivity, removeActivity, errors, touched, dayIndex }: any) {
  return (
    <Card className="border-gray-200 bg-gray-50">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-[#1a5f6b]">Activity {activityIndex + 1}</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeActivity(activityIndex)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Activity Name *</Label>
            <Input
              value={activity.name}
              onChange={(e) => updateActivity(activityIndex, "name", e.target.value)}
              placeholder="Backwater Cruise"
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            />
            {touched.itinerary?.[dayIndex]?.activities?.[activityIndex]?.name &&
              errors.itinerary?.[dayIndex]?.activities?.[activityIndex]?.name && (
                <p className="text-red-500 text-sm">{errors.itinerary[dayIndex].activities[activityIndex].name}</p>
              )}
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-[#2CA4BC]" />
              Duration
            </Label>
            <Input
              value={activity.duration}
              onChange={(e) => updateActivity(activityIndex, "duration", e.target.value)}
              placeholder="2 hours"
              className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Activity Description</Label>
          <Textarea
            value={activity.description}
            onChange={(e) => updateActivity(activityIndex, "description", e.target.value)}
            placeholder="Enjoy a peaceful cruise through the backwaters..."
            rows={2}
            className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={activity.category}
              onValueChange={(value) => updateActivity(activityIndex, "category", value)}
            >
              <SelectTrigger className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sightseeing">Sightseeing</SelectItem>
                <SelectItem value="adventure">Adventure</SelectItem>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="nature">Nature</SelectItem>
                <SelectItem value="water-sports">Water Sports</SelectItem>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="relaxation">Relaxation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id={`activity-${dayIndex}-${activityIndex}-price`}
              checked={activity.priceIncluded}
              onCheckedChange={(checked) => updateActivity(activityIndex, "priceIncluded", checked)}
              className="data-[state=checked]:bg-[#2CA4BC] data-[state=checked]:border-[#2CA4BC]"
            />
            <Label htmlFor={`activity-${dayIndex}-${activityIndex}-price`} className="font-medium">
              Price Included in Package
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
