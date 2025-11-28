import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { updateGuideProfile } from "@/services/guide/guide.service";
import type { IResponse } from "@/types/Response";
import type { GuideProfileEditFormValues } from "@/utils/guideProfileEdit.validator";

export const useUpdateGuideProfileMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<IResponse, AxiosError, GuideProfileEditFormValues>({
    mutationFn: updateGuideProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guide-profile"] });
    },
  });
};


