import { useState } from "react";
import { Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useToggleBadgeStatus } from "@/hooks/admin/useBadges";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import type { BadgeDto } from "@/types/badge";

interface BadgeListProps {
  badges: BadgeDto[];
}

const categoryColors: Record<string, string> = {
  service: "bg-blue-100 text-blue-800 border-blue-200",
  content: "bg-purple-100 text-purple-800 border-purple-200",
  engagement: "bg-green-100 text-green-800 border-green-200",
  achievement: "bg-amber-100 text-amber-800 border-amber-200",
};

export function BadgeList({ badges }: BadgeListProps) {
  const navigate = useNavigate();
  const toggleBadgeStatus = useToggleBadgeStatus();
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false);
  const [badgeToToggle, setBadgeToToggle] = useState<{
    badgeId: string;
    badgeName: string;
    newStatus: boolean;
  } | null>(null);

  const handleToggleClick = (badgeId: string, badgeName: string, currentStatus: boolean) => {
    setBadgeToToggle({
      badgeId,
      badgeName,
      newStatus: !currentStatus,
    });
    setToggleDialogOpen(true);
  };

  const handleToggleConfirm = () => {
    if (badgeToToggle) {
      toggleBadgeStatus.mutate({
        badgeId: badgeToToggle.badgeId,
        isActive: badgeToToggle.newStatus,
      });
      setToggleDialogOpen(false);
      setBadgeToToggle(null);
    }
  };

  const formatCriteria = (criteria: BadgeDto["criteria"]) => {
    if (criteria.length === 0) return "No criteria";
    if (criteria.length === 1) {
      const criterion = criteria[0];
      let text = `${criterion.type?.replace(/_/g, " ") || "Unknown"}: ${criterion.value}`;
      if (criterion.additionalCondition?.type) {
        text += ` + ${criterion.additionalCondition.type.replace(/_/g, " ")}: ${criterion.additionalCondition.value}`;
      }
      return text;
    }
    return `${criteria.length} criteria`;
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="w-12 font-bold text-slate-700 text-center">Icon</TableHead>
                <TableHead className="font-bold text-slate-700 min-w-[200px]">Name</TableHead>
                <TableHead className="font-bold text-slate-700 min-w-[150px] hidden lg:table-cell">
                  Badge ID
                </TableHead>
                <TableHead className="font-bold text-slate-700 min-w-[200px] hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead className="font-bold text-slate-700 text-center min-w-[100px]">
                  Category
                </TableHead>
                <TableHead className="font-bold text-slate-700 min-w-[180px] hidden xl:table-cell">
                  Criteria
                </TableHead>
                <TableHead className="font-bold text-slate-700 text-center w-20 hidden lg:table-cell">
                  Priority
                </TableHead>
                <TableHead className="font-bold text-slate-700 text-center w-24">Status</TableHead>
                <TableHead className="font-bold text-slate-700 text-center min-w-[140px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {badges.map((badge) => (
                <TableRow
                  key={badge.badgeId}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  {/* Icon */}
                  <TableCell className="text-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-xl mx-auto">
                      {badge.icon || "🏆"}
                    </div>
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{badge.name}</span>
                      <span className="text-xs text-slate-500 font-mono lg:hidden mt-1">
                        {badge.badgeId}
                      </span>
                    </div>
                  </TableCell>

                  {/* Badge ID (Desktop only) */}
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-slate-600 font-mono">{badge.badgeId}</span>
                  </TableCell>

                  {/* Description (Tablet and Desktop) */}
                  <TableCell className="hidden md:table-cell">
                    <p className="text-sm text-slate-600 line-clamp-2">{badge.description}</p>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={`${
                        categoryColors[badge.category] || "bg-slate-100 text-slate-800 border-slate-200"
                      } capitalize`}
                    >
                      {badge.category}
                    </Badge>
                  </TableCell>

                  {/* Criteria (Desktop only) */}
                  <TableCell className="hidden xl:table-cell">
                    <div className="text-sm text-slate-600">
                      {badge.criteria.length > 0 ? (
                        <div className="space-y-1">
                          {badge.criteria.slice(0, 2).map((criterion, idx) => (
                            <div key={idx} className="text-xs bg-slate-50 rounded px-2 py-1">
                              {criterion.type ? criterion.type.replace(/_/g, " ") : "Unknown"}:{" "}
                              {criterion.value}
                              {criterion.additionalCondition?.type && (
                                <span className="text-slate-400 ml-1">
                                  + {criterion.additionalCondition.type.replace(/_/g, " ")}:{" "}
                                  {criterion.additionalCondition.value}
                                </span>
                              )}
                            </div>
                          ))}
                          {badge.criteria.length > 2 && (
                            <p className="text-xs text-slate-400">
                              +{badge.criteria.length - 2} more
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">No criteria</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Priority (Desktop only) */}
                  <TableCell className="text-center hidden lg:table-cell">
                    {badge.priority !== undefined ? (
                      <span className="text-sm font-semibold text-slate-700">
                        {badge.priority}
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <Switch
                        checked={badge.isActive !== false}
                        onCheckedChange={() => {
                          handleToggleClick(
                            badge.badgeId,
                            badge.name,
                            badge.isActive !== false
                          );
                        }}
                        disabled={toggleBadgeStatus.isPending}
                        className="data-[state=checked]:bg-green-600"
                      />
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          badge.isActive !== false
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        {badge.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/admin/ad_pvt/badges/${badge.badgeId}/edit`)}
                        className="border-slate-300 hover:bg-slate-100"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="ml-1 hidden sm:inline">Edit</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Toggle Status Confirmation Dialog */}
      <Dialog open={toggleDialogOpen} onOpenChange={setToggleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {badgeToToggle?.newStatus ? "Activate Badge" : "Deactivate Badge"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {badgeToToggle?.newStatus ? "activate" : "deactivate"} the
              badge <strong>"{badgeToToggle?.badgeName}"</strong>?{" "}
              {badgeToToggle?.newStatus
                ? "This badge will be available for guides to earn."
                : "This badge will be deactivated. Guides who have already earned this badge will keep it, but new guides won't be able to earn it."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setToggleDialogOpen(false);
                setBadgeToToggle(null);
              }}
              disabled={toggleBadgeStatus.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleToggleConfirm}
              disabled={toggleBadgeStatus.isPending}
              className={
                badgeToToggle?.newStatus
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {toggleBadgeStatus.isPending
                ? "Processing..."
                : badgeToToggle?.newStatus
                  ? "Activate"
                  : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

