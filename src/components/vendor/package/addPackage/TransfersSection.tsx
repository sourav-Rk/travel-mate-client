import { Label } from "@radix-ui/react-label";
import { Car,Plus,X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TransfersSection({ transfers, newTransfer, setNewTransfer, addTransfer, removeTransfer }: any) {
  return (
    <div className="space-y-4">
      <Label className="flex items-center gap-2">
        <Car className="h-4 w-4 text-[#2CA4BC]" />
        Transfers
      </Label>
      <div className="flex gap-2">
        <Input
          value={newTransfer}
          onChange={(e) => setNewTransfer(e.target.value)}
          placeholder="e.g., Airport to Hotel, Hotel to Backwaters"
          className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
          onKeyPress={(e) => e.key === "Enter" && addTransfer()}
        />
        <Button type="button" onClick={addTransfer} size="sm" className="bg-[#2CA4BC] hover:bg-[#1a5f6b]">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {transfers.map((transfer: string, transferIndex: number) => (
          <Badge key={transferIndex} variant="outline" className="border-[#2CA4BC]/30 text-[#1a5f6b] pr-1">
            <Car className="h-3 w-3 mr-1" />
            {transfer}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeTransfer(transferIndex)}
              className="h-5 w-5 p-0 ml-1 hover:bg-red-100 hover:text-red-600 rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
