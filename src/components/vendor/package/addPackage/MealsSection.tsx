import { Label } from "@radix-ui/react-label";
import { Utensils } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function MealsSection({ meals, updateMeals, dayIndex }: any) {
  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <Utensils className="h-4 w-4 text-[#2CA4BC]" />
        Meals Included
      </Label>
      <div className="flex gap-6">
        {["breakfast", "lunch", "dinner"].map((meal) => (
          <div key={meal} className="flex items-center space-x-2">
            <Checkbox
              id={`${dayIndex}-${meal}`}
              checked={meals[meal as keyof typeof meals]}
              onCheckedChange={(checked) => updateMeals({ ...meals, [meal]: checked })}
              className="data-[state=checked]:bg-[#2CA4BC] data-[state=checked]:border-[#2CA4BC]"
            />
            <Label htmlFor={`${dayIndex}-${meal}`} className="capitalize font-medium">
              {meal}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}
