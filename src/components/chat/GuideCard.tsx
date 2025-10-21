"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GuideDetailsForClientDto } from "@/types/api/client";

export default function GuideCard({
  guide,
  compact = false,
  className,
}: {
  guide: GuideDetailsForClientDto;
  compact?: boolean;
  className?: string;
}) {
   if (!guide) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading guide details...
      </div>
    );
  }
  return (
    <Card className={cn("p-4 bg-card", className)}>
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={guide?.profileImage || "/placeholder.svg"}
            alt={`${guide.firstName || "guide"} avatar`}
          />
          <AvatarFallback aria-hidden>
            {guide?.firstName
              ? guide.firstName
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              : "G"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="font-medium truncate">{guide.firstName}</div>
          <div className="text-sm text-muted-foreground truncate">
            {guide.bio}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <div className="text-sm">
          <div className="text-muted-foreground">Alternate Phone</div>
          <div className="mt-0.5 font-medium">{guide.alternatePhone}</div>
        </div>
        <div className="text-sm">
          <div className="text-muted-foreground">Phone</div>
          <div className="mt-0.5 font-medium">{guide.phone}</div>
        </div>
        <div className="text-sm">
          <div className="text-muted-foreground">Languages</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {guide.languageSpoken.map((lang) => (
              <Badge
                key={lang}
                variant="secondary"
                className="bg-secondary text-secondary-foreground"
              >
                {lang}
              </Badge>
            ))}
          </div>
        </div>
        {!compact && (
          <>
            <div className="text-sm">
              <div className="text-muted-foreground">Trips led</div>
              <div className="mt-0.5 font-medium">
                {guide.totalTrips.toLocaleString()}
              </div>
            </div>
            {guide.bio && (
              <div className="text-sm">
                <div className="text-muted-foreground">About</div>
                <p className="mt-1 text-pretty leading-relaxed">{guide.bio}</p>
              </div>
            )}
            <Button className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Message {guide.firstName.split(" ")[0]}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
