
import { useMutation } from "@tanstack/react-query";
import type {MutationFunction} from"@tanstack/react-query";


export const useLogout = <T>(mutationFunc : MutationFunction<T>) =>{
   return useMutation<T, unknown, void>({
    mutationFn : mutationFunc
   })
}