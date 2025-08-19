import { CalendarIcon } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Popover,PopoverTrigger,PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns"

export default function DateDurationSection({ startDate, endDate, duration, setFieldValue, errors, touched }: any) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-[#2CA4BC]/20">
      <h3 className="text-lg font-semibold text-[#1a5f6b] mb-4 flex items-center gap-2">
        <CalendarIcon className="h-5 w-5 text-[#2CA4BC]" />
        Schedule & Duration
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Start Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Pick start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate || undefined}
                onSelect={(date) => setFieldValue("basicDetails.startDate", date || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {touched.basicDetails?.startDate && errors.basicDetails?.startDate && (
            <p className="text-red-500 text-sm">{errors.basicDetails.startDate}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>End Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Pick end date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate || undefined}
                onSelect={(date) => setFieldValue("basicDetails.endDate", date || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {touched.basicDetails?.endDate && errors.basicDetails?.endDate && (
            <p className="text-red-500 text-sm">{errors.basicDetails.endDate}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Duration (Auto-calculated)</Label>
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-[#1a5f6b]">
              {duration?.days || 0} Days / {duration?.nights || 0} Nights
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}