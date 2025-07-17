import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "@/store/slices/clientSlice";
import adminReducer from "@/store/slices/adminSlice";
import vendorReducer from "@/store/slices/vendor.slice";
import guideReducer from "@/store/slices/guideSlice";

export const store = configureStore({
  reducer: {
    client: clientReducer,
    admin: adminReducer,
    vendor : vendorReducer,
    guide : guideReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
