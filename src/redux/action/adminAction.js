import { showToast } from "../../components/Toast/toastService";
import { Apiservice } from "../api/ApiService";

import { connectedDeviceReducer, partNumberReducer, verifiedPartReducer } from "../slice/adminSlice";

export function apiHelper(
  apiReducer,
  method,
  apiURL,
  data = "",
  Toastmessage = "",
  giveToast = true
) {
  return async (dispatch) => {
    dispatch(apiReducer({ isLoading: true }));
    Apiservice(method, apiURL, data)
      .then((e) => {
        // console.log(e, "demo");
        dispatch(apiReducer({ apiData: e?.data, isLoading: false }));
        if (giveToast) {
          if (method === "POST")
            showToast(`${Toastmessage} Added Successfully`, "success");
          else if (method === "PUT") {
            showToast("Updated Data", "success");
          }
        }
      })
      .catch((e) => {
        dispatch(apiReducer({ isLoading: false }));
        showToast(e?.message, "error");
      });
  };
}

export function partNumberApi() {
  return apiHelper(partNumberReducer, "GET", "/part_number");
}

export function VerifiedListApi() {
  return apiHelper(
    verifiedPartReducer,
    "GET",
    "/object_detected"
  );
}

export function connectedDeviceApi() {
  return apiHelper(
    connectedDeviceReducer,
    "GET",
    "/camera_plc_status"
  )
}
