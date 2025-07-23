import { getClientDetails, updateClientDetails, type Client } from "@/services/client/client.service"
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