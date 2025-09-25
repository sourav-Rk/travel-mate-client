import type { RootState } from "@/store/store"
import { useSelector } from "react-redux"

export const useClientAuth = () =>{
    const clientInfo = useSelector((state : RootState) => state.user.user);
    return {isLoggedIn: clientInfo !== null,clientInfo}
}