import { addVendorAddress, updateVendorAddress } from "@/services/vendor/vendorService"
import type { AddressType } from "@/types/addressType"
import { useMutation } from "@tanstack/react-query"

export const useAddVendorAddressMutation = () =>{
    return useMutation({
        mutationFn : (data : AddressType) => addVendorAddress(data)
    });
};


export const useUpdateVendorAddressMutation = () =>{
    return useMutation({
        mutationFn : (data : AddressType) => updateVendorAddress(data)
    });
};
