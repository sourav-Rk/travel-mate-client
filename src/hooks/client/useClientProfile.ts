import { getClientDetails, updateClientDetails, type Client, type ClientResponse } from "@/services/client/client.service"
import { getClientDetailsForGuide } from "@/services/guide/guide.service"
import type { IResponse } from "@/types/Response"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useClientProfileQuery = () =>{
    return useQuery({
        queryFn : getClientDetails,
        queryKey : ['client-profile']
    })
}

export  const useClientProfileMutation = () =>{
    const queryClient = useQueryClient();
    return useMutation<IResponse,Error,Partial<Client>>({
        mutationFn : updateClientDetails,
        onSuccess : () => queryClient.invalidateQueries({queryKey : ["client-profile"]})
    })
}

export const useClientDetailsForGuideQuery = (clientId: string, enabled = true) => {
  return useQuery<ClientResponse>({
    queryKey: ["client-details-guide", clientId],
    queryFn: () => getClientDetailsForGuide(clientId),
    enabled: enabled && !!clientId, 
  });
};