import { addGuide } from "@/services/vendor/vendorService"
import type { IResponse } from "@/types/Response"
import type { IGuide } from "@/types/User"
import { useMutation } from "@tanstack/react-query"

export const useAddGuideMutation = () =>{
    return useMutation<IResponse,Error, IGuide>({
        mutationFn : (guide : IGuide) => addGuide(guide),
    })
}