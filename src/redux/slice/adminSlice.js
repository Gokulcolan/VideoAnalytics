import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    partNumberDetail: [],
    partNumberIsLoading: false,
    verifiedPartDetail: [],
    verfiedPartIsLoading: false,
  },
  reducers: {
    partNumberReducer: (state, { payload }) => {
      const { apiData, isLoading } = payload;
      state.partNumberDetail = apiData;
      state.partNumberIsLoading = isLoading;
    },
    verifiedPartReducer: (state, { payload }) => {
      const { apiData, isLoading } = payload;
      state.verifiedPartDetail = apiData;
      state.verfiedPartIsLoading = isLoading;
    },
 
  },
});

export const { partNumberReducer,verifiedPartReducer } = adminSlice.actions;

export const adminSelector = (state) => state.admin;
export const adminReducer = adminSlice.reducer;
