import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Vendor {
    id : string;
    firstName : string;
    lastName : string;
    role : string;
}

const initialState = {
    vendor : JSON.parse(localStorage.getItem("vendorSession") || "null")
}


const vendorSlice = createSlice({
    name :"vendor",
    initialState,
    reducers : {
        vendorLogin : (state,action : PayloadAction<Vendor>) =>{
            state.vendor = action.payload;
            localStorage.setItem("vendorSession",JSON.stringify(action.payload));
        },
        vendorLogout : (state) =>{
            state.vendor = null;
            localStorage.removeItem("vendorSession")
        },
        setVendorStatus : (state,action:PayloadAction<string>) => {
            if(state.vendor){
                state.vendor.status = action.payload
            }
        }
    }
});

export const {vendorLogin,vendorLogout,setVendorStatus} = vendorSlice.actions;
export default vendorSlice.reducer;