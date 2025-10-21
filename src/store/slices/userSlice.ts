import {createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/UserRole";

const initialState = {
    user : JSON.parse(localStorage.getItem("authSession") || "null"),
};

const userSlice  = createSlice({
    name : "user",
    initialState,
    reducers : {
        loginUser : (state, action : PayloadAction<User>) =>{
            state.user = action.payload;
            localStorage.setItem("authSession",JSON.stringify(action.payload));
        },
        logoutUser : (state) =>{
            state.user = null;
            localStorage.removeItem("authSession");
        },
        setVendorStatus :(state,action:PayloadAction<string>) => {
            if(state.user?.role === "vendor"){
                state.user.status = action.payload
            }
        }
    },
});

export const {loginUser,logoutUser,setVendorStatus} = userSlice.actions;
export default userSlice.reducer;