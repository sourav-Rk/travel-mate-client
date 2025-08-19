import { guideProfile } from "@/services/guide/guide.service"
import { useQuery } from "@tanstack/react-query"

//guide profie query
export const useGuideProfileQuery = () => {
    return useQuery({
        queryKey : ['guide-profile'],
        queryFn : guideProfile
    })
}