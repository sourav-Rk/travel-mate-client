import { getPackageDetails } from "@/services/admin/admin.service"
import { useQuery } from "@tanstack/react-query"

//get package details
export const useGetPackageDetailsAdminQuery = (packageId : string,userType : string) =>{
   return useQuery({
       queryFn : ()=>  getPackageDetails(packageId,userType),
       queryKey : ["package-details",packageId,userType],
       enabled: !!packageId
   })
}