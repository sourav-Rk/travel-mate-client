import { updateClientPassword } from "@/services/client/client.service";
import { updateGuidePassword } from "@/services/guide/guide.service";
import { updateVendorPassword } from "@/services/vendor/vendorService";
import type { PasswordChangeFormType } from "@/types/authTypes";
import type { IResponse } from "@/types/Response";
import { useMutation } from "@tanstack/react-query";

type Role = "client" | "vendor" | "guide";

export const useChangePasswordMutation = (role : Role) => {
    const muatationFunctionMap = {
        client : updateClientPassword,
        vendor : updateVendorPassword,
        guide  : updateGuidePassword,
    };

    return useMutation<IResponse,Error,PasswordChangeFormType>({
        mutationFn : (data : PasswordChangeFormType) => muatationFunctionMap[role](data)
    })
}