import { Label } from "@radix-ui/react-label";
import { Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ActivityCard from "./ActivityCard";

export default function ActivitiesSection({
  activities,
  addActivity,
  updateActivity,
  removeActivity,
  errors,
  touched,
  dayIndex,
}: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="flex items-center gap-2">
          <Utensils className="h-4 w-4 text-[#2CA4BC]" />
          Activities
        </Label>
        <Button type="button" onClick={addActivity} size="sm" className="bg-[#2CA4BC] hover:bg-[#1a5f6b]">
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </div>

      {activities.map((activity: any, activityIndex: number) => (
        <ActivityCard
          key={activityIndex}
          activity={activity}
          activityIndex={activityIndex}
          updateActivity={updateActivity}
          removeActivity={removeActivity}
          errors={errors}
          touched={touched}
          dayIndex={dayIndex}
        />
      ))}
    </div>
  )
}
