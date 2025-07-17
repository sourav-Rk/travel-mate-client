import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit"

interface Guide {
    id : string;
    firstName : string;
    lastName : string;
    email : string;
    role : string;
}

const initialState = {
    guide : JSON.parse(localStorage.getItem("guideSession") || "null"),
}

const guideSlice = createSlice({
    name :"guide",
    initialState,
    reducers :{
        guideLogin :(state,action : PayloadAction<Guide>)=>{
            state.guide = action.payload;
            localStorage.setItem("guideSession",JSON.stringify(action.payload))
        },
        guideLogout : (state) =>{
            state.guide = null;
            localStorage.removeItem("guideSession");
        }
    }
});

export const {guideLogin,guideLogout} = guideSlice.actions;
export default guideSlice.reducer