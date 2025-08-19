import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus,X } from "lucide-react";
// Sub-components for better organization
export default function TagsSection({ tags, newTag, setNewTag, addTag, removeTag, error }: any) {
  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <div className="flex gap-2 mb-2">
        <Input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Add a tag (e.g., family-friendly, adventure)"
          className="focus:border-[#2CA4BC] focus:ring-[#2CA4BC]"
          onKeyPress={(e) => e.key === "Enter" && addTag()}
        />
        <Button type="button" onClick={addTag} size="sm" className="bg-[#2CA4BC] hover:bg-[#1a5f6b]">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag: string, index: number) => (
          <Badge key={index} variant="secondary" className="bg-[#2CA4BC]/10 text-[#1a5f6b] hover:bg-[#2CA4BC]/20 pr-1">
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeTag(tag)}
              className="h-5 w-5 p-0 ml-1 hover:bg-red-100 hover:text-red-600 rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
