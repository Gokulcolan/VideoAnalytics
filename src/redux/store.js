import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { adminReducer } from "./slice/adminSlice";


const rootReducer = combineReducers({

  admin: adminReducer,
 
});

const store = configureStore({ reducer: rootReducer });
export default store;
