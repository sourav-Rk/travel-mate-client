import { getPackageDetails, updatePackageBlockStatus } from "@/services/admin/admin.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

//get package details
export const useGetPackageDetailsAdminQuery = (packageId : string,userType : string) =>{
   return useQuery({
       queryFn : ()=>  getPackageDetails(packageId,userType),
       queryKey : ["package-details",packageId,userType],
       enabled: !!packageId
   })
}

//block or unblock the package
export const useUpdatePackageBlockMutation = () => {
     const queryClient = useQueryClient();
     return useMutation({
        mutationFn : updatePackageBlockStatus,
        onSuccess : () => queryClient.invalidateQueries({queryKey: ["packages"]})
     })
}