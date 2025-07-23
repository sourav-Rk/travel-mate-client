import { updateClientPassword } from "@/services/client/client.service";
import { updateVendorPassword } from "@/services/vendor/vendorService";
import type { PasswordChangeFormType } from "@/types/authTypes";
import type { IResponse } from "@/types/Response";
import { useMutation } from "@tanstack/react-query";

type Role = "client" | "vendor" ;

export const useChangePasswordMutation = (role : Role) => {
    const muatationFunctionMap = {
        client : updateClientPassword,
        vendor : updateVendorPassword,
    };

    return useMutation<IResponse,Error,PasswordChangeFormType>({
        mutationFn : (data : PasswordChangeFormType) => muatationFunctionMap[role](data)
    })
}