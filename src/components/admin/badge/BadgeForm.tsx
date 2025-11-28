import { useState, useEffect } from "react";
import { ArrowLeft, Save, X, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { useCreateBadge, useUpdateBadge, useBadge } from "@/hooks/admin/useBadges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { BadgeCriteria, CreateBadgePayload, UpdateBadgePayload } from "@/types/badge";


const BADGE_CRITERIA_TYPES = [
  { value: "completed_services", label: "Completed Services" },
  { value: "total_posts", label: "Total Posts" },
  { value: "total_likes", label: "Total Likes" },
  { value: "total_views", label: "Total Views" },
  { value: "max_post_likes", label: "Max Post Likes" },
  { value: "max_post_views", label: "Max Post Views" },
  { value: "average_rating", label: "Average Rating" },
  { value: "total_ratings", label: "Total Ratings" },
  { value: "completion_rate", label: "Completion Rate" },
  { value: "services_and_posts", label: "Services and Posts" },
  { value: "posts_and_likes", label: "Posts and Likes" },
  { value: "services_and_rating", label: "Services and Rating" },
];

const CATEGORIES = [
  { value: "service", label: "Service" },
  { value: "content", label: "Content" },
  { value: "engagement", label: "Engagement" },
  { value: "achievement", label: "Achievement" },
];

interface BadgeFormData {
  badgeId: string;
  name: string;
  description: string;
  category: "service" | "content" | "engagement" | "achievement";
  icon?: string;
  criteria: Array<{
    type: string;
    value: number;
    additionalCondition?: {
      type: string;
      value: number;
    };
  }>;
  priority?: number;
  isActive?: boolean;
}

export function BadgeForm() {
  const navigate = useNavigate();
  const { badgeId } = useParams<{ badgeId: string }>();
  const isEditMode = !!badgeId;

  const { data: existingBadge, isLoading: isLoadingBadge } = useBadge(badgeId || "");
  const createBadge = useCreateBadge();
  const updateBadge = useUpdateBadge();

  const [formData, setFormData] = useState<BadgeFormData>({
    badgeId: "",
    name: "",
    description: "",
    category: "service",
    icon: "",
    criteria: [{ type: "completed_services", value: 1 }],
    priority: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BadgeFormData, string>>>({});

  // Load existing badge data in edit mode
  useEffect(() => {
    if (isEditMode && existingBadge) {
      setFormData({
        badgeId: existingBadge.badge.badgeId,
        name: existingBadge.badge.name,
        description: existingBadge.badge.description,
        category: existingBadge.badge.category,
        icon: existingBadge.badge.icon || "",
        criteria: existingBadge.badge.criteria,
        priority: existingBadge.badge.priority || 0,
        isActive: existingBadge.badge.isActive !== false,
      });
    }
  }, [isEditMode, existingBadge]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BadgeFormData, string>> = {};

    if (!isEditMode && !formData.badgeId.trim()) {
      newErrors.badgeId = "Badge ID is required";
    } else if (!isEditMode && !/^[a-z0-9_-]+$/.test(formData.badgeId)) {
      newErrors.badgeId = "Badge ID must contain only lowercase letters, numbers, underscores, and hyphens";
    } else if (!isEditMode && formData.badgeId.length > 50) {
      newErrors.badgeId = "Badge ID cannot exceed 50 characters";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Name cannot exceed 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    if (formData.criteria.length === 0) {
      newErrors.criteria = "At least one criterion is required";
    }

    if (formData.icon && formData.icon.length > 10) {
      newErrors.icon = "Icon cannot exceed 10 characters";
    }

    if (formData.priority !== undefined && (formData.priority < 0 || formData.priority > 1000)) {
      newErrors.priority = "Priority must be between 0 and 1000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Clean criteria - remove additionalCondition if it's not fully filled
  const cleanCriteria = (criteria: BadgeFormData["criteria"]) => {
    return criteria.map((criterion) => {
      const cleaned = { ...criterion };
      // Remove additionalCondition if it's incomplete (empty type, empty string type, or missing/invalid value)
      if (cleaned.additionalCondition) {
        const hasValidType = 
          cleaned.additionalCondition.type && 
          cleaned.additionalCondition.type !== "" &&
          cleaned.additionalCondition.type.trim() !== "";
        const hasValidValue = 
          cleaned.additionalCondition.value !== undefined &&
          cleaned.additionalCondition.value !== null &&
          cleaned.additionalCondition.value > 0;
        
        // Only keep additionalCondition if both type and value are valid
        if (!hasValidType || !hasValidValue) {
          delete cleaned.additionalCondition;
        }
      }
      return cleaned;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Clean criteria before sending
    const cleanedCriteria = cleanCriteria(formData.criteria);

    if (isEditMode) {
      // Explicitly exclude badgeId from update payload - backend doesn't allow badgeId in update
      const updatePayload: UpdateBadgePayload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        icon: formData.icon || undefined,
        criteria: cleanedCriteria,
        priority: formData.priority,
        isActive: formData.isActive,
      };
      
      // Ensure badgeId is not accidentally included
      if ("badgeId" in updatePayload) {
        delete updatePayload.badgeId;
      }

      updateBadge.mutate({ badgeId: badgeId!, payload: updatePayload });
    } else {
      const createPayload: CreateBadgePayload = {
        badgeId: formData.badgeId,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        icon: formData.icon || undefined,
        criteria: cleanedCriteria,
        priority: formData.priority,
      };
     createBadge.mutate(createPayload);
    }
  };

  const addCriterion = () => {
    setFormData({
      ...formData,
      criteria: [...formData.criteria, { type: "completed_services", value: 1 }],
    });
  };

  const removeCriterion = (index: number) => {
    if (formData.criteria.length > 1) {
      setFormData({
        ...formData,
        criteria: formData.criteria.filter((_, i) => i !== index),
      });
    }
  };

  const updateCriterion = (index: number, field: keyof BadgeCriteria, value: unknown) => {
    const updatedCriteria = [...formData.criteria];
    updatedCriteria[index] = { ...updatedCriteria[index], [field]: value };
    setFormData({ ...formData, criteria: updatedCriteria });
  };

  const updateAdditionalCondition = (
    index: number,
    field: "type" | "value",
    value: unknown
  ) => {
    const updatedCriteria = [...formData.criteria];
    if (!updatedCriteria[index].additionalCondition) {
      updatedCriteria[index].additionalCondition = { type: "completed_services", value: 1 };
    }
    updatedCriteria[index].additionalCondition = {
      ...updatedCriteria[index].additionalCondition!,
      [field]: value,
    };
    setFormData({ ...formData, criteria: updatedCriteria });
  };

  if (isEditMode && isLoadingBadge) {
    return (
      <div className="ml-0 lg:ml-64 min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-all duration-300 flex items-center justify-center pt-16 lg:pt-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="ml-0 lg:ml-64 min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 transition-all duration-300"
    >
      <div className="p-4 lg:p-8 pt-16 lg:pt-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/ad_pvt/badges")}
            className="mb-4 hover:bg-slate-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Badges
          </Button>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
              {isEditMode ? "Edit Badge" : "Create New Badge"}
            </h1>
            <p className="text-slate-600 text-sm lg:text-base">
              {isEditMode
                ? "Update badge details and criteria"
                : "Define a new badge with criteria for local guides"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 lg:p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="badgeId" className="text-slate-700 font-medium text-sm lg:text-base">
                    Badge ID {!isEditMode && <span className="text-red-500">*</span>}
                  </Label>
                  <Input
                    id="badgeId"
                    value={formData.badgeId}
                    onChange={(e) =>
                      !isEditMode && setFormData({ ...formData, badgeId: e.target.value })
                    }
                    placeholder="e.g., first_service, service_5"
                    disabled={isEditMode}
                    className="mt-1 bg-white border-slate-200 w-full disabled:bg-slate-50 disabled:text-slate-600 disabled:cursor-not-allowed"
                  />
                  {errors.badgeId && (
                    <p className="mt-1 text-sm text-red-600">{errors.badgeId}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    {isEditMode
                      ? "Badge ID cannot be changed after creation"
                      : "Unique identifier (lowercase, numbers, underscores, hyphens only)"}
                  </p>
                </div>

                <div>
                  <Label htmlFor="name" className="text-slate-700 font-medium text-sm lg:text-base">
                    Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., First Service, Service Starter"
                    className="mt-1 bg-white border-slate-200 w-full"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-slate-700 font-medium text-sm lg:text-base">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe what this badge represents..."
                    rows={3}
                    className="mt-1 bg-white border-slate-200 w-full"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-slate-700 font-medium">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          category: value as BadgeFormData["category"],
                        })
                      }
                    >
                      <SelectTrigger className="mt-1 bg-white border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="icon" className="text-slate-700 font-medium">
                      Icon (Emoji)
                    </Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="🏆, ⭐, 🎯"
                      className="mt-1 bg-white border-slate-200"
                    />
                    {errors.icon && (
                      <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="priority" className="text-slate-700 font-medium text-sm lg:text-base">
                    Priority
                  </Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                    className="mt-1 bg-white border-slate-200 w-full"
                  />
                  {errors.priority && (
                    <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
                  )}
                  <p className="mt-1 text-xs text-slate-500">
                    Lower numbers appear first (0 = highest priority)
                  </p>
                </div>

                {isEditMode && (
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <Label htmlFor="isActive" className="text-slate-700 font-medium">
                        Active Status
                      </Label>
                      <p className="text-xs text-slate-500 mt-1">
                        Inactive badges won't be awarded to new guides
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Criteria */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Criteria</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCriterion}
                  className="border-slate-300"
                >
                  <Plus className="mr-2 h-3 w-3" />
                  Add Criterion
                </Button>
              </div>

              <div className="space-y-4">
                {formData.criteria.map((criterion, index) => (
                  <div
                    key={index}
                    className="p-4 border border-slate-200 rounded-lg bg-slate-50 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-700">
                        Criterion {index + 1}
                      </h3>
                      {formData.criteria.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCriterion(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-700 font-medium text-sm">
                          Criteria Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={criterion.type}
                          onValueChange={(value) => updateCriterion(index, "type", value)}
                        >
                          <SelectTrigger className="mt-1 bg-white border-slate-200 w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {BADGE_CRITERIA_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-slate-700 font-medium text-sm">
                          Value <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="number"
                          value={criterion.value}
                          onChange={(e) =>
                            updateCriterion(index, "value", parseInt(e.target.value) || 0)
                          }
                          className="mt-1 bg-white border-slate-200 w-full"
                        />
                      </div>
                    </div>

                    {/* Additional Condition */}
                    <div className="border-t border-slate-200 pt-4">
                      <Label className="text-slate-700 font-medium text-sm mb-2 block">
                        Additional Condition (Optional)
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-slate-600 text-xs">Condition Type</Label>
                          <Select
                            value={criterion.additionalCondition?.type || ""}
                            onValueChange={(value) => updateAdditionalCondition(index, "type", value)}
                          >
                            <SelectTrigger className="mt-1 bg-white border-slate-200 w-full">
                              <SelectValue placeholder="Select condition type" />
                            </SelectTrigger>
                            <SelectContent>
                              {BADGE_CRITERIA_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-slate-600 text-xs">Condition Value</Label>
                          <Input
                            type="number"
                            value={criterion.additionalCondition?.value || ""}
                            onChange={(e) =>
                              updateAdditionalCondition(
                                index,
                                "value",
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="mt-1 bg-white border-slate-200 w-full"
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.criteria.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg">
                    <p className="text-slate-500">No criteria added</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCriterion}
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      Add First Criterion
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/ad_pvt/badges")}
              className="border-slate-300 w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createBadge.isPending || updateBadge.isPending}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg w-full sm:w-auto"
            >
              <Save className="mr-2 h-4 w-4" />
              {createBadge.isPending || updateBadge.isPending
                ? "Saving..."
                : isEditMode
                  ? "Update Badge"
                  : "Create Badge"}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

