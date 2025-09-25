import { getGuideDetailsClient } from "@/services/client/client.service"
import { useQuery } from "@tanstack/react-query"

//guide details query
export const useGetGuideDetailsQuery = (guideId : string) => {
    return useQuery({
        queryKey : ['guide-details-client',guideId],
        queryFn : () => getGuideDetailsClient(guideId),
        enabled: !!guideId
    })
}